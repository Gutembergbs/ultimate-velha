import { View, Text } from 'react-native';

export function OnlineScore({ scores }: any) {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#151F33',
      borderWidth: 1,
      borderColor: '#24344D',
      padding: 10,
      borderRadius: 10,
      width: '90%',
      marginBottom: 10
    }}>
      <Text style={{ color: '#F8FAFC', fontSize: 16 }}>
      <Text style={{ color: '#38BDF8', fontWeight: 'bold' }}>X:</Text> {scores?.X || 0}
      </Text>
      <Text style={{ color: '#F8FAFC', fontSize: 16 }}>
      <Text style={{ color: '#FBBF24', fontWeight: 'bold' }}>O:</Text> {scores?.O || 0}
      </Text>
    </View>
  );
}
