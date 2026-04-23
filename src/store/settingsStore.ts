import { create } from 'zustand';
import { ThemeMode } from '../theme/colors';
import { getThemeMode, saveThemeMode } from '../services/storageService';

interface SettingsStore {
  themeMode: ThemeMode;
  isHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  hydrateSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  themeMode: 'system',
  isHydrated: false,
  setThemeMode: async (mode) => {
    set({ themeMode: mode });
    await saveThemeMode(mode);
  },
  hydrateSettings: async () => {
    const persistedMode = await getThemeMode();
    set({
      themeMode: persistedMode ?? 'system',
      isHydrated: true,
    });
  },
}));
