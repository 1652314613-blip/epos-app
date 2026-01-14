/**
 * Page transition animations for Expo Router
 * Using built-in Expo Router transitions
 */

export const pageTransitions = {
  // Slide from right (default)
  slideFromRight: {
    animation: "slide_from_right" as const,
  },

  // Slide from bottom (modal style)
  slideFromBottom: {
    animation: "slide_from_bottom" as const,
  },

  // Fade transition
  fade: {
    animation: "fade" as const,
  },

  // No animation
  none: {
    animation: "none" as const,
  },
};
