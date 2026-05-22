// ============================================================
// EduCheck – Design System / Theme Tokens
// ============================================================

export const COLORS = {
  // Blues
  primary:       '#1565C0',
  primaryDark:   '#0D47A1',
  primaryDeep:   '#0A3D8F',
  primaryLight:  '#1976D2',
  primaryPale:   '#42A5F5',
  accent:        '#4FC3F7',

  // Semantic
  success:       '#2E7D32',
  successLight:  '#4CAF50',
  successBg:     '#E8F5E9',
  error:         '#C62828',
  errorLight:    '#EF5350',
  errorBg:       '#FFEBEE',
  warning:       '#E65100',
  warningLight:  '#FF9800',
  warningBg:     '#FFF3E0',
  purple:        '#6A1B9A',
  purpleBg:      '#F3E5F5',

  // Backgrounds
  bg:            '#EEF2FF',
  bgAlt:         '#F0F4FF',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F8FAFF',

  // Text
  textPrimary:   '#0A1628',
  textSecondary: '#4A5568',
  textMuted:     '#94A3B8',
  textLight:     '#CBD5E1',
  white:         '#FFFFFF',

  // Borders
  border:        '#E2E8F0',
  borderFocus:   '#1565C0',

  // Tab
  tabActive:     '#1565C0',
  tabInactive:   '#94A3B8',
};

export const GRADIENTS = {
  header:      ['#0D47A1', '#1565C0', '#1976D2'],
  headerShort: ['#0D47A1', '#1976D2'],
  card:        ['#1565C0', '#1976D2'],
  success:     ['#1B5E20', '#2E7D32'],
  warm:        ['#E65100', '#FF9800'],
  cool:        ['#006064', '#0097A7'],
};

export const FONTS = {
  xs:   11,
  sm:   12,
  md:   14,
  lg:   16,
  xl:   18,
  xxl:  22,
  xxxl: 28,
};

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  full: 999,
};

export const SHADOWS = {
  sm: {
    elevation: 2,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  md: {
    elevation: 4,
    shadowColor: '#1565C0',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  lg: {
    elevation: 8,
    shadowColor: '#0D47A1',
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// Tab bar shared style
export const TAB_BAR_STYLE = {
  backgroundColor: '#fff',
  elevation: 12,
  shadowColor: '#1565C0',
  shadowOpacity: 0.15,
  shadowRadius: 16,
  borderTopWidth: 0,
  height: 68,
  paddingBottom: 10,
  paddingTop: 8,
};
