import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SmallBoardState } from '../helpers/types';
import { styles } from '../styles/styles';

type Props = {
  board: SmallBoardState;
  index: number;
  active: boolean;
  winnerLine: number[] | null;
  onMove: (b:number, c:number) => void;
  renderLine: (line:number[]) => any;
};

export function SmallBoard({
  board,index,active,winnerLine,onMove,renderLine
}:Props) {
  return (
    <View style={[styles.smallBoard,!active&&styles.disabledBoard]}>
      {board.map((c,i)=>(
        <TouchableOpacity key={i} style={styles.cell}
          onPress={()=>onMove(index,i)}>
          <Text style={[
            styles.cellText,
            c==='X'?styles.xColor:styles.oColor
          ]}>{c}</Text>
        </TouchableOpacity>
      ))}
      {winnerLine && (
        <View style={[styles.winLine,renderLine(winnerLine)]}/>
      )}
    </View>
  );
}
