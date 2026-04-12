export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryDark: string;
  accent: string;
  border: string;
  warning: string;
  warningMuted: string;
  success: string;
  overlay: string;
};

export const lightTheme: ThemeColors = {
  background: '#F4F1EC',
  surface: '#FFFFFF',
  surfaceMuted: '#EDE8E2',
  text: '#1B3D1B',
  textSecondary: '#3D5C3D',
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  accent: '#8BC34A',
  border: '#D7D0C8',
  warning: '#E65100',
  warningMuted: '#FFF3E0',
  success: '#2E7D32',
  overlay: 'rgba(27, 61, 27, 0.45)',
};

export const darkTheme: ThemeColors = {
  background: '#0D120D',
  surface: '#1A221A',
  surfaceMuted: '#232E23',
  text: '#E8F5E9',
  textSecondary: '#A5D6A7',
  primary: '#81C784',
  primaryDark: '#66BB6A',
  accent: '#9FE870',
  border: '#2E3B2E',
  warning: '#FFB74D',
  warningMuted: '#3E2E14',
  success: '#A5D6A7',
  overlay: 'rgba(0, 0, 0, 0.55)',
};

export const layout = {
  radiusSm: 8,
  radiusMd: 14,
  radiusLg: 20,
  spaceSm: 8,
  spaceMd: 16,
  spaceLg: 24,
};
