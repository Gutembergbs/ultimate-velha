import { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { BigBoardState, Player } from '../helpers/types';
import { Alert, Platform } from 'react-native';
import { checkBigWinnerWithLine } from '../helpers/gameLogic';


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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetting, setResetting] = useState(false);
    const presenceRef = useRef<any>(null);
    const gameChannelRef = useRef<any>(null);


    // ---------------------
    // SELECIONAR LADO (X ou O)
    // ---------------------
    const selectSide = async (side: Player) => {
        if (!side || !gameId) return;

        try {
            const { data, error } = await supabase.rpc('select_game_side', {
                p_game_id: gameId,
                p_side: side,
                p_local_id: localId
            });

            if (!error && data?.ok) {
                setSymbol(side);
                setPlayers(data.players);
                setError(null);
            } else if (data?.error) {
                Alert.alert('Lado ocupado', data.error);
                setError(data.error);
            } else {
                setError(error?.message ?? 'Não foi possível selecionar o lado.');
            }
        } catch (err) {
            console.error("Erro ao selecionar lado:", err);
            setError('Não foi possível selecionar o lado.');
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

            if (presenceRef.current) supabase.removeChannel(presenceRef.current);
            if (gameChannelRef.current) supabase.removeChannel(gameChannelRef.current);
            presenceRef.current = null;
            gameChannelRef.current = null;

            // Reseta estados locais
            setGameId(null);
            setSymbol(null);
            setPlayers({});
            await storage.setItem('@last_room_id', '');

        } catch (err) {
            console.error("Erro ao sair da sala:", err);
            setError('Não foi possível sair da sala.');
        }
    };

    // ---------------------
    // CRIAR SALA
    // ---------------------
    const createRoom = async () => {
        setLoading(true);
        setError(null);
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

        if (error) {
            console.error('Erro ao criar sala:', error);
            setError('Não foi possível criar a sala.');
            setLoading(false);
            return;
        }

        await storage.setItem('@last_room_id', id);
        setGameId(id);
        setState({ boards: initialBoard, winners: initialWinners });
        setCurrentPlayer('X');
        setActiveBoard(null);
        setBigWinner(null);
        subscribeRoom(id);
        setLoading(false);
    };

    // ---------------------
    // ENTRAR NA SALA
    // ---------------------
    const joinRoom = async (id: string) => {
        const roomId = id.trim().toUpperCase();
        if (!roomId) {
            setError('Informe o ID da sala.');
            return;
        }

        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('games').select('*').eq('id', roomId).single();

        if (error || !data) {
            Alert.alert('Sala não encontrada', 'Confira o ID e tente novamente.');
            setError('Sala não encontrada.');
            setLoading(false);
            return;
        }

        setGameId(roomId);
        await storage.setItem('@last_room_id', roomId);
        const currentPlayers = data.players || {};
        setPlayers(currentPlayers);
        setScores({ X: data.score_x || 0, O: data.score_o || 0 });

        if (currentPlayers.X === localId) setSymbol('X');
        else if (currentPlayers.O === localId) setSymbol('O');

        setState({ boards: data.board, winners: data.winners });
        setCurrentPlayer(data.current_player);
        setActiveBoard(data.active_board);
        setBigWinner(checkBigWinnerWithLine(data.winners || []));
        subscribeRoom(roomId);
        setLoading(false);
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
                    setBigWinner(checkBigWinnerWithLine(g.winners || []));
                    setError(null);

                    if (g.players?.X === localId) setSymbol('X');
                    else if (g.players?.O === localId) setSymbol('O');
                    else setSymbol(null);
                }
            )
            .subscribe();

        gameChannelRef.current = gameChannel;
    };


    const sendMove = async (
        boards: any[],
        winners: any[],
        nextPlayer: Player,
        activeBoard: number | null,
        expectedPlayer: Player
    ) => {
        if (!gameId) return;
        const { data, error } = await supabase.rpc('submit_game_move', {
            p_game_id: gameId,
            p_local_id: localId,
            p_expected_player: expectedPlayer,
            p_board: boards,
            p_winners: winners,
            p_next_player: nextPlayer,
            p_active_board: activeBoard
        });

        if (error || data !== true) {
            setError('Não foi possível enviar a jogada.');
        }
    };

    const resetOnlineGame = async (winnerPlayer: Player | null) => {
        if (!gameId || resetting) return;
        setResetting(true);
        setError(null);
        const { data, error } = await supabase.rpc('reset_online_game', {
            p_game_id: gameId,
            p_winner: winnerPlayer
        });
        if (error || data !== true) setError('Não foi possível reiniciar a partida.');
        setResetting(false);
    };

    const resyncGame = async () => {
        if (!gameId) return;
        setLoading(true);
        setError(null);

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

        if (error || !data) {
            setError('Não foi possível sincronizar a partida.');
            setLoading(false);
            return;
        }

        // Atualiza estado local
        setState({ boards: data.board, winners: data.winners });
        setCurrentPlayer(data.current_player);
        setActiveBoard(data.active_board);
        setPlayers(data.players || {});
        setScores({ X: data.score_x ?? 0, O: data.score_o ?? 0 });

        if (data.players?.X === localId) setSymbol('X');
        else if (data.players?.O === localId) setSymbol('O');
        else setSymbol(null);

        setBigWinner(checkBigWinnerWithLine(data.winners || []));

        // Recria realtime
        subscribeRoom(gameId);
        setLoading(false);
    };

    useEffect(() => {
        let mounted = true;

        storage.getItem('@last_room_id').then((id: string | null) => {
            if (mounted && id) joinRoom(id);
        });

        return () => {
            mounted = false;
            if (presenceRef.current) supabase.removeChannel(presenceRef.current);
            if (gameChannelRef.current) supabase.removeChannel(gameChannelRef.current);
        };
    }, [localId]);

    return {
        gameId,
        symbol,
        players,
        scores,
        onlineCount,
        loading,
        error,
        resetting,
        selectSide,
        leaveRoom, // Adicionado aqui
        createRoom,
        joinRoom,
        sendMove,
        resetOnlineGame,
        resyncGame
    };
}