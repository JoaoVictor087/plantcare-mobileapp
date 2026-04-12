export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryDark: string;
  accent: string;
  border: string;
};

export const lightTheme: ThemeColors = {
  background: '#E8DFDF',
  surface: '#FFFFFF',
  text: '#145A14',
  textSecondary: '#2E7D32',
  primary: '#2E7D32',
  primaryDark: '#145A14',
  accent: '#9FE870',
  border: '#C4BDBD',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#E8F5E9',
  textSecondary: '#A5D6A7',
  primary: '#66BB6A',
  primaryDark: '#388E3C',
  accent: '#9FE870',
  border: '#333333',
};
