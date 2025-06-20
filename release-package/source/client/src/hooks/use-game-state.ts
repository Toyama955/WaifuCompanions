import { useState, useEffect } from 'react';

interface GameSettings {
  soundEffects: boolean;
  backgroundMusic: boolean;
  animations: boolean;
  notifications: boolean;
}

interface GameProgress {
  selectedCharacter?: number;
  unlockedCharacters: number[];
  totalPlayTime: number;
  achievements: string[];
}

export function useGameState() {
  const [settings, setSettings] = useState<GameSettings>({
    soundEffects: true,
    backgroundMusic: false,
    animations: true,
    notifications: true,
  });

  const [progress, setProgress] = useState<GameProgress>({
    unlockedCharacters: [1, 2, 3, 4, 5, 6],
    totalPlayTime: 0,
    achievements: [],
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('companionSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }

    const savedProgress = localStorage.getItem('companionProgress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to parse saved progress:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('companionSettings', JSON.stringify(settings));
  }, [settings]);

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('companionProgress', JSON.stringify(progress));
  }, [progress]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateProgress = (newProgress: Partial<GameProgress>) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
  };

  const addAchievement = (achievement: string) => {
    setProgress(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement]
    }));
  };

  const unlockCharacter = (characterId: number) => {
    setProgress(prev => ({
      ...prev,
      unlockedCharacters: [...new Set([...prev.unlockedCharacters, characterId])]
    }));
  };

  return {
    settings,
    progress,
    updateSettings,
    updateProgress,
    addAchievement,
    unlockCharacter,
  };
}
