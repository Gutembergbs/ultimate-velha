import { Text, TouchableOpacity, Platform, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export function OnlineHeader({ gameId, onResync }: any) {

  const copyRoomId = () => {
    if (!gameId) return;
    Clipboard.setString(gameId);
    Alert.alert('ID copiado', 'Compartilhe com seu oponente.');
  };

  return (
    <>
      <Text style={{ fontSize: 24, fontWeight: '800', color: '#F8FAFC', marginBottom: 10, textAlign: 'center' }}>
        Ultimate Jogo da Velha
      </Text>

      {Platform.OS === 'web' && gameId && (
        <TouchableOpacity
          onPress={onResync}
          style={{
            marginBottom: 10,
            paddingVertical: 8,
            paddingHorizontal: 14,
            backgroundColor: '#087E8B',
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            🔄 Re-sincronizar
          </Text>
        </TouchableOpacity>
      )}

      {gameId && (
        <TouchableOpacity onPress={copyRoomId} style={{ marginBottom: 10 }}>
          <Text style={{ color: '#67E8F9', fontWeight: '700' }}>
            Sala: {gameId} (Copiar)
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}
