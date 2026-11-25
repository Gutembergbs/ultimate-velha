import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles/styles';

export function OnlineActions({ onRestart, onExit, showRestart, isDraw }: any) {
  return (
    <View style={{ marginTop: 20, width: '90%' }}>
      {showRestart && (
        <TouchableOpacity
          onPress={onRestart}
          style={[styles.modeBtn, styles.primaryButton, { marginBottom: 10 }]}
        >
          <Text style={styles.buttonText}>
            {isDraw ? "Jogar Novamente" : "Reiniciar e Atualizar Placar"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.modeBtn} onPress={onExit}>
        <Text style={styles.buttonText}>Sair da Sala</Text>
      </TouchableOpacity>
    </View>
  );
}
