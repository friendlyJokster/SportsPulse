/**
 * Centralized Design Token System for SportPulse
 * Defines semantic theme tokens for backgrounds, surfaces, text, borders,
 * status indicators, and sports event actions.
 */

export interface ThemeTokens {
  background: {
    base: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    card: string;
    cardHover: string;
    modal: string;
    popover: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  borders: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  sportsEvent: {
    boundary: string;
    wicket: string;
    goal: string;
    superRaid: string;
    gamePoint: string;
  };
}

/**
 * Semantic utility class names matching design system tokens
 */
export const THEME_CLASSES = {
  // Background tokens
  bg: 'bg-theme-bg',
  bgSecondary: 'bg-theme-bg-secondary',
  bgTertiary: 'bg-theme-bg-tertiary',

  // Surface tokens
  card: 'bg-theme-card border-theme-primary',
  cardHover: 'hover:bg-theme-card-hover',
  modal: 'bg-theme-modal border-theme-primary',
  popover: 'bg-theme-popover border-theme-secondary',

  // Text tokens
  textPrimary: 'text-theme-primary',
  textSecondary: 'text-theme-secondary',
  textMuted: 'text-theme-muted',
  textInverse: 'text-theme-inverse',

  // Border tokens
  borderPrimary: 'border-theme-primary',
  borderSecondary: 'border-theme-secondary',

  // Status tokens
  statusSuccess: 'text-theme-success',
  statusWarning: 'text-theme-warning',
  statusError: 'text-theme-error',
  statusInfo: 'text-theme-info',

  // Sports event tokens
  sportBoundary: 'text-sport-boundary bg-sport-boundary/15 border-sport-boundary/30',
  sportWicket: 'text-sport-wicket bg-sport-wicket/15 border-sport-wicket/30',
  sportGoal: 'text-sport-goal bg-sport-goal/15 border-sport-goal/30',
  sportSuperRaid: 'text-sport-super-raid bg-sport-super-raid/15 border-sport-super-raid/30',
  sportGamePoint: 'text-sport-game-point bg-sport-game-point/15 border-sport-game-point/30',
} as const;
