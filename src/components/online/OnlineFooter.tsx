import { View, Text } from 'react-native';

type Props = {
  onlineCount: number;
  refreshing: boolean;
  gameId?: string | null;
};

export function OnlineFooter({ onlineCount, refreshing, gameId }: Props) {
  if (!gameId) return null;

  return (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <Text style={{ color: '#67E8F9' }}>
        ● {onlineCount} pessoas na sala
      </Text>

      <Text
        style={{
          color: refreshing ? '#FBBF24' : '#7D8AA0',
          fontSize: 12,
          marginTop: 10,
          fontWeight: refreshing ? 'bold' : 'normal'
        }}
      >
        {refreshing
          ? 'Sincronizando partida...'
          : 'Arraste para baixo para atualizar'}
      </Text>
    </View>
  );
}
