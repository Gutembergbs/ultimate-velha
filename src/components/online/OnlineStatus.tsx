import { View, Text } from 'react-native';
import { styles } from '../../styles/styles';

export function OnlineStatus({ game, online, lastRoundWinner }: any) {

  const isDraw = game.state.winners.every((w: any) => w !== null);

  const didLoseBySequence =
    lastRoundWinner &&
    game.bigWinner &&
    game.bigWinner.player !== lastRoundWinner &&
    game.bigWinner.player !== online.symbol;



  return (
    <View style={[
      styles.statusCard,
      game.bigWinner && { borderColor: '#F97316' },
      isDraw && { borderColor: '#FBBF24' }
    ]}>
      <Text style={[
        styles.statusText,
        (game.bigWinner || online.symbol === game.currentPlayer) && { color: '#67E8F9' },
        isDraw && { color: '#FBBF24' },
        game.bigWinner && { color: '#FDBA74', fontSize: 20 }
      ]}>
        {game.bigWinner
          ? (
            didLoseBySequence
              ? "❌ Você Perdeu!"
              : game.bigWinner.player === online.symbol
                ? "✨ Você Venceu!"
                : "❌ Você Perdeu!"
          )
          : (isDraw
            ? "🤝 Empate!"
            : (online.symbol === game.currentPlayer
              ? "Sua vez!"
              : `Vez de ${game.currentPlayer}`))
        }

      </Text>
    </View>
  );
}
