import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles/styles';

export function OnlineActions({ onRestart, onExit, showRestart, isDraw, resetting }: any) {
  return (
    <View style={{ marginTop: 20, width: '90%' }}>
      {showRestart && (
        <TouchableOpacity
          accessibilityRole="button"
          disabled={resetting}
          onPress={onRestart}
          style={[styles.modeBtn, styles.primaryButton, { marginBottom: 10, opacity: resetting ? 0.6 : 1 }]}
        >
          <Text style={styles.buttonText}>
            {resetting ? "Reiniciando..." : isDraw ? "Jogar Novamente" : "Reiniciar e Atualizar Placar"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.modeBtn} onPress={onExit}>
        <Text style={styles.buttonText}>Sair da Sala</Text>
      </TouchableOpacity>
    </View>
  );
}
