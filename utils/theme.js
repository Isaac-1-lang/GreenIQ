export const COLORS = {
  // Primary Greens
  primary: '#0F766E', // Deep Teal Green
  primaryLight: '#2DD4BF',
  primaryDark: '#115E59',
  
  // Accents
  accent: '#10B981', // Vibrant Emerald
  accentLight: '#34D399',
  
  // Secondary Colors
  secondary: '#3B82F6', // Trust Blue
  
  // Neutrals for Typography & Backgrounds
  background: '#F8FAFC', // Very light blue/gray
  surface: '#FFFFFF', // Pure white
  surfaceGlass: 'rgba(255, 255, 255, 0.85)',
  surfaceGradientTop: '#FFFFFF',
  surfaceGradientBottom: '#F1F5F9',
  
  // Text
  text: '#1E293B', // Slate 800
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8', // Slate 400
  textInverse: '#FFFFFF',
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Gradients
  gradientPrimary: ['#0F766E', '#10B981'],
  gradientLight: ['#2DD4BF', '#34D399'],
  gradientPremium: ['#0F766E', '#115E59'],
};

export const SIZES = {
  // Typography
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 16,
  body2: 14,
  caption: 12,

  // Spacing
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,

  // Radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusPill: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  }
};

export const GLOBAL_STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.l,
    ...SHADOWS.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
};
