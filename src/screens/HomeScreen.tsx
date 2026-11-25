import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { GameMode } from '../helpers/types';
import { styles } from '../styles/styles';

type Props = {
    onSelectMode: (mode: GameMode) => void;
};

export function HomeScreen({ onSelectMode }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.homeContent}>
                <View style={styles.brandMark}>
                    <Text style={styles.brandMarkText}>X</Text>
                </View>
                <Text style={styles.eyebrow}>ESTRATÉGIA EM 9 TABULEIROS</Text>
                <Text style={styles.title}>Ultimate{'\n'}Jogo da Velha</Text>
                <Text style={styles.subtitle}>
                    Um jogo clássico com uma nova camada de estratégia. Escolha como quer jogar.
                </Text>

                <View style={styles.modeList}>
                    <TouchableOpacity
                        style={[styles.modeBtn, styles.primaryButton]}
                        onPress={() => onSelectMode('LOCAL')}
                    >
                        <Text style={styles.buttonText}>2 jogadores · local</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modeBtn}
                        onPress={() => onSelectMode('AI')}
                    >
                        <Text style={styles.buttonText}>Vs IA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modeBtn}
                        onPress={() => onSelectMode('ONLINE')}
                    >
                        <Text style={styles.buttonText}>Online</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
