/** 
 * Epos Design System - Minimal Black & White Theme
 * Inspired by Linear, Raycast, Vercel
 * 
 * Core Principles:
 * - Pure black (#000000) and pure white (#FFFFFF)
 * - Ultra-thin borders (0.5px - 1px)
 * - No gradients, shadows, or glows
 * - Increased letter-spacing for tech aesthetic
 * - Transparent backgrounds with thin white borders
 */

/** @type {const} */
const themeColors = {
  // Primary: Pure black
  primary: { light: '#000000', dark: '#FFFFFF' },
  
  // Background: Pure white (light) / Pure black (dark)
  background: { light: '#FFFFFF', dark: '#000000' },
  
  // Surface: Transparent with border
  surface: { light: 'rgba(0, 0, 0, 0.02)', dark: 'rgba(255, 255, 255, 0.02)' },
  
  // Foreground: Text color
  foreground: { light: '#000000', dark: '#FFFFFF' },
  
  // Muted: Secondary text
  muted: { light: '#666666', dark: '#999999' },
  
  // Border: Ultra-thin borders
  border: { light: 'rgba(0, 0, 0, 0.1)', dark: 'rgba(255, 255, 255, 0.1)' },
  
  // Success: Minimal green
  success: { light: '#000000', dark: '#FFFFFF' },
  
  // Warning: Minimal yellow
  warning: { light: '#000000', dark: '#FFFFFF' },
  
  // Error: Minimal red
  error: { light: '#000000', dark: '#FFFFFF' },
};

module.exports = { themeColors };
