import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, RefreshControl, useWindowDimensions } from 'react-native';
import { styles } from '../styles/styles';
import { Player } from '../helpers/types';
import { checkWinnerWithLine, getNextActiveBoard } from '../helpers/gameLogic';

import { SmallBoard } from '../components/SmallBoard';
import { useGameState } from '../hooks/useGameState';
import { useOnlineGame } from '../hooks/useOnlineGame';

import { OnlineHeader } from '../components/online/OnlineHeader';
import { OnlineScore } from '../components/online/OnlineScore';
import { OnlineStatus } from '../components/online/OnlineStatus';
import { OnlineRoom } from '../components/online/OnlineRoom';
import { OnlineSideSelector } from '../components/online/OnlineSideSelector';
import { OnlineActions } from '../components/online/OnlineActions';
import { OnlineFooter } from '../components/online/OnlineFooter';


type Props = {
    localId: string;
    onExit: () => void;
};

export function OnlineGameScreen({ localId, onExit }: Props) {
    const { width } = useWindowDimensions();
    const boardSize = Math.min(width - 32, 390);
    const game = useGameState('ONLINE');
    const online = useOnlineGame({
        localId,
        setState: game.setState,
        setCurrentPlayer: game.setCurrentPlayer,
        setActiveBoard: game.setActiveBoard,
        setBigWinner: game.setBigWinner
    });

    useEffect(() => {
        if (game.bigWinner?.player) {
            setLastRoundWinner(game.bigWinner.player);
        }
    }, [game.bigWinner]);


    const [refreshing, setRefreshing] = useState(false);
    const [inputRoomId, setInputRoomId] = useState('');

    const [lastRoundWinner, setLastRoundWinner] = useState<Player | null>(null);

    const isDraw = !game.bigWinner && game.state.winners.every(w => w !== null);

    const handleResync = async () => {
        setRefreshing(true);
        await online.resyncGame();
        setRefreshing(false);
    };

    const handleRestart = async () => {
        const winnerPlayer = game.bigWinner?.player || null;
        await online.resetOnlineGame(winnerPlayer);
    };

    const handleExit = async () => {
        await online.leaveRoom();
        onExit();
    };

    const handleMove = (boardIndex: number, cellIndex: number) => {
        if (game.bigWinner) return;
        if (!online.symbol || online.symbol !== game.currentPlayer) return;
        if (game.state.boards[boardIndex][cellIndex] !== null) return;
        if (game.activeBoard !== null && game.activeBoard !== boardIndex) return;

        const newBoards = game.state.boards.map((b, i) =>
            i === boardIndex ? b.map((c, j) => (j === cellIndex ? game.currentPlayer : c)) : b
        );

        const newWinners = [...game.state.winners];
        if (!newWinners[boardIndex]) {
            const sw = checkWinnerWithLine(newBoards[boardIndex]);
            if (sw) newWinners[boardIndex] = sw;
        }

        const nextPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        const nextActiveBoard = getNextActiveBoard(newBoards, newWinners, cellIndex);

        game.handleMove(boardIndex, cellIndex);
        online.sendMove(newBoards, newWinners, nextPlayer, nextActiveBoard);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={{ flex: 1 }} // ← AQUI (ESSENCIAL)
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center', // ← CENTRALIZA VERTICAL
                    alignItems: 'center',
                    paddingVertical: 20
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleResync} />
                }
            >

                <OnlineHeader gameId={online.gameId} onResync={handleResync} />
                <OnlineScore scores={online.scores} />
                <OnlineStatus
                    game={game}
                    online={online}
                    lastRoundWinner={lastRoundWinner}
                />


                <OnlineRoom
                    online={online}
                    inputRoomId={inputRoomId}
                    setInputRoomId={setInputRoomId}
                />

                <View style={[styles.bigBoard, { width: boardSize, height: boardSize }]}>
                    {game.state.boards.map((board, idx) => (
                        <SmallBoard
                            key={idx}
                            board={board}
                            index={idx}
                            active={!game.bigWinner && (game.activeBoard === null || game.activeBoard === idx)}
                            winnerLine={game.state.winners[idx]?.line ?? null}
                            onMove={handleMove}
                            renderLine={game.renderLine}
                        />
                    ))}

                    {game.bigWinner && (
                        <View style={[styles.bigWinLine, game.renderLine(game.bigWinner.line)]} />
                    )}
                </View>

                <OnlineSideSelector online={online} />

                <OnlineActions
                    onRestart={handleRestart}
                    onExit={handleExit}
                    showRestart={!!game.bigWinner || isDraw}
                    isDraw={isDraw}
                />
                <OnlineFooter
                    onlineCount={online.onlineCount}
                    refreshing={refreshing}
                    gameId={online.gameId}
                />


            </ScrollView>
        </SafeAreaView>
    );
}
