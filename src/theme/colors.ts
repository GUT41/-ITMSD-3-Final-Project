import { ColorSchemeName } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  danger: string;
  iconInactive: string;
}

export const lightColors: ThemeColors = {
  background: '#fff',
  surface: '#fff',
  surfaceMuted: '#f5f5f5',
  border: '#ddd',
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#999',
  primary: '#0F6E56',
  danger: '#e74c3c',
  iconInactive: '#ccc',
};

export const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1A1A1A',
  surfaceMuted: '#222',
  border: '#3a3a3a',
  textPrimary: '#F5F5F5',
  textSecondary: '#C9C9C9',
  textMuted: '#9A9A9A',
  primary: '#33B38F',
  danger: '#FF6B6B',
  iconInactive: '#777',
};

export function resolveTheme(mode: ThemeMode, systemScheme: ColorSchemeName): ResolvedTheme {
  if (mode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

export function getThemeColors(mode: ThemeMode, systemScheme: ColorSchemeName): ThemeColors {
  return resolveTheme(mode, systemScheme) === 'dark' ? darkColors : lightColors;
}
