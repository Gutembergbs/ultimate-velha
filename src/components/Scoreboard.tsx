// src/components/Scoreboard.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type ScoreItem = {
  id: string;
  winner: string | null;
  date: string;
};

type Props = {
  scores: ScoreItem[];
};

export function Scoreboard({ scores }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Placar</Text>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.date}</Text>
            <Text style={styles.text}>{item.winner ?? 'Empate'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  text: { color: '#fff' },
});
