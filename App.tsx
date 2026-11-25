import React, { useState } from 'react';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnlineGameScreen } from './src/screens/OnlineGameScreen';
import { GameMode } from './src/helpers/types';

export default function App() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [localId] = useState(
    () => `player-${Math.random().toString(36).slice(2, 10)}`
  );

  if (mode === 'LOCAL' || mode === 'AI') {
    return <GameScreen mode={mode} onExit={() => setMode(null)} />;
  }

  if (mode === 'ONLINE') {
    return <OnlineGameScreen localId={localId} onExit={() => setMode(null)} />;
  }

  return <HomeScreen onSelectMode={setMode} />;
}
