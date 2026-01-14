/**
 * Animation utilities using react-native-reanimated
 */
import { withSpring, withTiming, withSequence, withDelay } from "react-native-reanimated";

/**
 * Button press animation config
 */
export const buttonPressAnimation = {
  scale: withSequence(
    withTiming(0.95, { duration: 100 }),
    withTiming(1, { duration: 100 })
  ),
};

/**
 * Fade in animation
 */
export const fadeIn = (duration = 300) => {
  return withTiming(1, { duration });
};

/**
 * Fade out animation
 */
export const fadeOut = (duration = 300) => {
  return withTiming(0, { duration });
};

/**
 * Slide in from bottom
 */
export const slideInFromBottom = (duration = 400) => {
  return withSpring(0, {
    damping: 20,
    stiffness: 90,
  });
};

/**
 * Scale in animation
 */
export const scaleIn = (duration = 300) => {
  return withSpring(1, {
    damping: 15,
    stiffness: 100,
  });
};

/**
 * Bounce animation
 */
export const bounce = () => {
  return withSequence(
    withTiming(1.1, { duration: 150 }),
    withTiming(0.95, { duration: 100 }),
    withTiming(1, { duration: 100 })
  );
};

/**
 * Staggered list animation
 */
export const staggeredAnimation = (index: number, totalDuration = 300) => {
  const delay = (index * totalDuration) / 10;
  return withDelay(
    delay,
    withSpring(1, {
      damping: 20,
      stiffness: 90,
    })
  );
};

/**
 * Shake animation (for errors)
 */
export const shake = () => {
  return withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};

/**
 * Success pulse animation
 */
export const successPulse = () => {
  return withSequence(
    withTiming(1.2, { duration: 200 }),
    withTiming(1, { duration: 200 })
  );
};
