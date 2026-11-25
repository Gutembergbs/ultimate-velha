import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';

export function GameHeader({ game, timer }: any) {
  return (
    <>
      <Text style={styles.title}>Ultimate Jogo da Velha</Text>

      <Text style={{ color:'#e5e7eb', marginVertical:6 }}>
        Próxima jogada:{' '}
        {game.mode === 'AI' && game.currentPlayer === 'O'
          ? 'IA (O)'
          : game.currentPlayer}
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => game.setMode('LOCAL')} style={styles.modeBtn}>
          <Text style={styles.buttonText}>2 Jogadores</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => game.setMode('AI')} style={styles.modeBtn}>
          <Text style={styles.buttonText}>Vs IA</Text>
        </TouchableOpacity>
      </View>

      {game.mode === 'LOCAL' && (
        <View style={{ alignItems:'center', marginVertical:10 }}>
          <Text style={{ color:'#fff', fontSize:18 }}>
            ⏱ {timer.timeLeft}s
          </Text>

          <View style={{ flexDirection:'row', gap:8, marginTop:6 }}>
            <TouchableOpacity
              onPress={() => timer.updateBaseTime(-30)}
              style={styles.modeBtn}
            >
              <Text style={styles.buttonText}>-30s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => timer.updateBaseTime(30)}
              style={styles.modeBtn}
            >
              <Text style={styles.buttonText}>+30s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={timer.start}
              style={styles.resetButton}
            >
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* UNDO / RESET */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.undoButton} onPress={game.undoMove}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            game.resetGame();
            timer.resetTimer();
          }}
        >
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
