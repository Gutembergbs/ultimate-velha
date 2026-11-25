import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/styles';

export function OnlineSideSelector({ online }: any) {
  if (!online.gameId || online.symbol) return null;

  return (
    <View style={{
      padding: 20,
      alignItems: 'center',
      backgroundColor: '#151F33',
      borderWidth: 1,
      borderColor: '#24344D',
      borderRadius: 14,
      marginVertical: 15,
      width: '90%'
    }}>
      <Text style={{ color: '#F8FAFC', fontSize: 18, marginBottom: 15, fontWeight: 'bold' }}>
        Escolha seu lado:
      </Text>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          disabled={!!online.players.X}
          onPress={() => online.selectSide('X')}
          style={[styles.modeBtn, { backgroundColor: online.players.X ? '#26354B' : '#087E8B', opacity: online.players.X ? 0.6 : 1, marginRight: 10 }]}
        >
          <Text style={styles.buttonText}>{online.players.X ? 'X Ocupado' : 'Jogar como X'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!!online.players.O}
          onPress={() => online.selectSide('O')}
          style={[styles.modeBtn, { backgroundColor: online.players.O ? '#26354B' : '#A85D12', opacity: online.players.O ? 0.6 : 1 }]}
        >
          <Text style={styles.buttonText}>{online.players.O ? 'O Ocupado' : 'Jogar como O'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
