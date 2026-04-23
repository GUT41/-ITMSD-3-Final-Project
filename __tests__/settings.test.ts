import { useSettingsStore } from '../src/store/settingsStore';
import { getThemeMode, saveThemeMode } from '../src/services/storageService';

jest.mock('../src/services/storageService', () => ({
  getThemeMode: jest.fn(),
  saveThemeMode: jest.fn(),
}));

describe('Settings Store', () => {
  beforeEach(() => {
    useSettingsStore.setState({ themeMode: 'system', isHydrated: false });
    (getThemeMode as jest.Mock).mockReset();
    (saveThemeMode as jest.Mock).mockReset();
  });

  test('hydrates persisted theme mode', async () => {
    (getThemeMode as jest.Mock).mockResolvedValue('dark');
    await useSettingsStore.getState().hydrateSettings();
    const state = useSettingsStore.getState();
    expect(state.themeMode).toBe('dark');
    expect(state.isHydrated).toBe(true);
  });

  test('defaults to system when persisted mode is missing', async () => {
    (getThemeMode as jest.Mock).mockResolvedValue(null);
    await useSettingsStore.getState().hydrateSettings();
    const state = useSettingsStore.getState();
    expect(state.themeMode).toBe('system');
    expect(state.isHydrated).toBe(true);
  });

  test('setThemeMode persists choice', async () => {
    await useSettingsStore.getState().setThemeMode('light');
    expect(useSettingsStore.getState().themeMode).toBe('light');
    expect(saveThemeMode).toHaveBeenCalledWith('light');
  });
});
