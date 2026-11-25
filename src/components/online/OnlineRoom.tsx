import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { styles } from '../../styles/styles';

export function OnlineRoom({
  online,
  inputRoomId,
  setInputRoomId
}: any) {

  if (online.gameId) return null;

  return (
    <View style={{ width: '90%', marginBottom: 20 }}>
      <TouchableOpacity onPress={online.createRoom} style={[styles.modeBtn, { marginBottom: 10 }]}>
        <Text style={styles.buttonText}>Criar Nova Sala</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder="ID da sala"
          placeholderTextColor="#7D8AA0"
          value={inputRoomId}
          onChangeText={setInputRoomId}
          style={{
            flex: 1,
            backgroundColor: '#111B2F',
            color: '#F8FAFC',
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#2A3E59',
            marginRight: 5
          }}
        />
        <TouchableOpacity onPress={() => online.joinRoom(inputRoomId)} style={styles.modeBtn}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
