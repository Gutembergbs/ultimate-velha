import { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { BigBoardState, Player } from '../helpers/types';
import { Platform } from 'react-native';


let storage: any;
if (Platform.OS === 'web') {
    storage = {
        getItem: async (key: string) => localStorage.getItem(key),
        setItem: async (key: string, value: string) => localStorage.setItem(key, value),
    };
} else {
    storage = require('@react-native-async-storage/async-storage').default;
}

type OnlineGameProps = {
    localId: string;
    setState: (state: BigBoardState) => void;
    setCurrentPlayer: (player: Player) => void;
    setActiveBoard: (board: number | null) => void;
    setBigWinner: (winner: any) => void;
};

export function useOnlineGame({
    localId,
    setState,
    setCurrentPlayer,
    setActiveBoard,
    setBigWinner
}: OnlineGameProps) {
    const [gameId, setGameId] = useState<string | null>(null);
    const [symbol, setSymbol] = useState<Player | null>(null);
    const [players, setPlayers] = useState<{ X?: string; O?: string }>({});
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [onlineCount, setOnlineCount] = useState(0);
    const presenceRef = useRef<any>(null);
    const gameChannelRef = useRef<any>(null);


    // ---------------------
    // SELECIONAR LADO (X ou O)
    // ---------------------
    const selectSide = async (side: Player) => {
        if (!side || !gameId) return;

        try {
            const { data: game } = await supabase.from('games').select('players').eq('id', gameId).single();
            const currentPlayers = (game?.players as Record<string, string>) || {};

            if (currentPlayers[side]) {
                alert(`O jogador ${side} já foi escolhido por outra pessoa.`);
                return;
            }

            const updatedPlayers = { ...currentPlayers, [side]: localId };

            const { error } = await supabase.from('games')
                .update({ players: updatedPlayers })
                .eq('id', gameId);

            if (!error) {
                setSymbol(side);
                setPlayers(updatedPlayers);
            }
        } catch (err) {
            console.error("Erro ao selecionar lado:", err);
        }
    };

    // ---------------------
    // SAIR DA SALA (Libera a vaga)
    // ---------------------
    const leaveRoom = async () => {
        if (!gameId) return;

        try {
            // Busca os jogadores atuais no banco
            const { data: game } = await supabase.from('games').select('players').eq('id', gameId).single();
            const currentPlayers = { ...game?.players } as Record<string, string>;

            // Remove o localId de qualquer posição que ele ocupe
            if (currentPlayers.X === localId) delete currentPlayers.X;
            if (currentPlayers.O === localId) delete currentPlayers.O;

            // Atualiza o banco de dados
            await supabase.from('games')
                .update({ players: currentPlayers })
                .eq('id', gameId);

            // Reseta estados locais
            setGameId(null);
            setSymbol(null);
            setPlayers({});
            await storage.setItem('@last_room_id', '');

        } catch (err) {
            console.error("Erro ao sair da sala:", err);
        }
    };

    // ---------------------
    // CRIAR SALA
    // ---------------------
    const createRoom = async () => {
        const id = Math.random().toString(36).substring(2, 10).toUpperCase();
        const initialBoard = Array(9).fill(null).map(() => Array(9).fill(null));
        const initialWinners = Array(9).fill(null);

        const { error } = await supabase.from('games').insert([{
            id,
            board: initialBoard,
            winners: initialWinners,
            players: {},
            current_player: 'X',
            status: 'waiting',
            active_board: null,
            score_x: 0,
            score_o: 0
        }]);

        if (error) return console.error('Erro ao criar sala:', error);

        await storage.setItem('@last_room_id', id);
        setGameId(id);
        setState({ boards: initialBoard, winners: initialWinners });
        setCurrentPlayer('X');
        setActiveBoard(null);
        setBigWinner(null);
        subscribeRoom(id);
    };

    // ---------------------
    // ENTRAR NA SALA
    // ---------------------
    const joinRoom = async (id: string) => {
        const { data, error } = await supabase.from('games').select('*').eq('id', id).single();

        if (error || !data) {
            alert('Sala não encontrada');
            return;
        }

        setGameId(id);
        const currentPlayers = data.players || {};
        setPlayers(currentPlayers);
        setScores({ X: data.score_x || 0, O: data.score_o || 0 });

        if (currentPlayers.X === localId) setSymbol('X');
        else if (currentPlayers.O === localId) setSymbol('O');

        setState({ boards: data.board, winners: data.winners });
        setCurrentPlayer(data.current_player);
        setActiveBoard(data.active_board);
        subscribeRoom(id);
    };

    // ---------------------
    // MONITORAR PRESENÇA E ATUALIZAÇÕES
    // ---------------------
    const subscribeRoom = (id: string) => {
        // Remove subscriptions antigas
        if (presenceRef.current) supabase.removeChannel(presenceRef.current);
        if (gameChannelRef.current) supabase.removeChannel(gameChannelRef.current);

        // PRESENCE
        const presenceChannel = supabase.channel(`presence-${id}`, {
            config: { presence: { key: localId } }
        });

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                setOnlineCount(Object.keys(state).length);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({ online_at: new Date().toISOString() });
                }
            });

        presenceRef.current = presenceChannel;

        // GAME REALTIME
        const gameChannel = supabase
            .channel(`game-${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'games',
                    filter: `id=eq.${id}`
                },
                (payload) => {
                    const g = payload.new;

                    setState({ boards: g.board, winners: g.winners });
                    setCurrentPlayer(g.current_player);
                    setActiveBoard(g.active_board);
                    setPlayers(g.players || {});
                    setScores({ X: g.score_x ?? 0, O: g.score_o ?? 0 });

                    const isAllNull = g.board.every((b: any[]) => b.every(c => c === null));
                    if (isAllNull) setBigWinner(null);

                    if (g.players?.X === localId) setSymbol('X');
                    else if (g.players?.O === localId) setSymbol('O');
                    else setSymbol(null);
                }
            )
            .subscribe();

        gameChannelRef.current = gameChannel;
    };


    const sendMove = async (boards: any, winners: any, nextPlayer: Player, activeBoard: number | null) => {
        if (!gameId) return;
        await supabase.from('games').update({
            board: boards,
            winners: winners,
            current_player: nextPlayer,
            active_board: activeBoard
        }).eq('id', gameId);
    };

    const resetOnlineGame = async (winnerPlayer: Player | null) => {
        if (!gameId) return;
        const nextScoreX = winnerPlayer === 'X' ? scores.X + 1 : scores.X;
        const nextScoreO = winnerPlayer === 'O' ? scores.O + 1 : scores.O;

        await supabase.from('games').update({
            board: Array(9).fill(null).map(() => Array(9).fill(null)),
            winners: Array(9).fill(null),
            current_player: 'X',
            active_board: null,
            score_x: nextScoreX,
            score_o: nextScoreO
        }).eq('id', gameId);
    };

    const resyncGame = async () => {
        if (!gameId) return;

        console.log('🔄 Re-sincronizando jogo...');

        // Remove subscriptions antigas
        if (presenceRef.current) {
            supabase.removeChannel(presenceRef.current);
            presenceRef.current = null;
        }

        if (gameChannelRef.current) {
            supabase.removeChannel(gameChannelRef.current);
            gameChannelRef.current = null;
        }

        // Busca estado atual
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', gameId)
            .single();

        if (error || !data) return;

        // Atualiza estado local
        setState({ boards: data.board, winners: data.winners });
        setCurrentPlayer(data.current_player);
        setActiveBoard(data.active_board);
        setPlayers(data.players || {});
        setScores({ X: data.score_x ?? 0, O: data.score_o ?? 0 });

        if (data.players?.X === localId) setSymbol('X');
        else if (data.players?.O === localId) setSymbol('O');
        else setSymbol(null);

        setBigWinner(null);

        // Recria realtime
        subscribeRoom(gameId);
    };



    return {
        gameId,
        symbol,
        players,
        scores,
        onlineCount,
        selectSide,
        leaveRoom, // Adicionado aqui
        createRoom,
        joinRoom,
        sendMove,
        resetOnlineGame,
        resyncGame
    };
}