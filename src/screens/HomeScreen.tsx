import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Linking,
    useWindowDimensions
} from 'react-native';
import { GameMode } from '../helpers/types';
import { styles } from '../styles/styles';

const PRIVACY_POLICY_URL = 'https://gutembergbs.github.io/ultimate-velha/politica-de-privacidade/';

type Props = {
    onSelectMode: (mode: GameMode) => void;
};

export function HomeScreen({ onSelectMode }: Props) {
    const { width } = useWindowDimensions();
    const isWideScreen = width >= 900;

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.homeContent, isWideScreen && styles.homeContentWide]}>
                <View style={[styles.homeIntro, isWideScreen && styles.homeIntroWide]}>
                    <View style={styles.brandMark}>
                        <Text style={styles.brandMarkText}>X</Text>
                    </View>
                    <Text style={styles.eyebrow}>ESTRATÉGIA EM 9 TABULEIROS</Text>
                    <Text style={[styles.title, isWideScreen && styles.homeTitleWide]}>
                        Ultimate{'\n'}Jogo da Velha
                    </Text>
                    <Text style={styles.subtitle}>
                        Um jogo clássico com uma nova camada de estratégia. Escolha como quer jogar.
                    </Text>
                </View>

                <View style={[styles.modeList, isWideScreen && styles.modeListWide]}>
                    <TouchableOpacity
                        style={[styles.modeBtn, styles.primaryButton, isWideScreen && styles.modeBtnWide]}
                        onPress={() => onSelectMode('LOCAL')}
                    >
                        <Text style={styles.buttonText}>2 jogadores · local</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.modeBtn, isWideScreen && styles.modeBtnWide]}
                        onPress={() => onSelectMode('AI')}
                    >
                        <Text style={styles.buttonText}>Vs IA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeBtn, isWideScreen && styles.modeBtnWide]}
                        onPress={() => onSelectMode('ONLINE')}
                    >
                        <Text style={styles.buttonText}>Online</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessibilityRole="link"
                        onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
                        style={styles.privacyLink}
                    >
                        <Text style={styles.privacyLinkText}>Política de Privacidade</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
