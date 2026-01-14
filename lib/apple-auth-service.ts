import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

export interface AppleAuthResult {
  identityToken: string;
  user: string;
  email?: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
}

/**
 * Check if Apple Authentication is available on this device
 */
export async function isAppleAuthAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch (error) {
    console.error('Failed to check Apple Auth availability:', error);
    return false;
  }
}

/**
 * Sign in with Apple
 */
export async function signInWithApple(): Promise<AppleAuthResult> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Extract user information
    const result: AppleAuthResult = {
      identityToken: credential.identityToken!,
      user: credential.user,
      email: credential.email || undefined,
      fullName: credential.fullName ? {
        givenName: credential.fullName.givenName || undefined,
        familyName: credential.fullName.familyName || undefined,
      } : undefined,
    };

    return result;
  } catch (error: any) {
    if (error.code === 'ERR_CANCELED') {
      throw new Error('Apple Sign In was canceled');
    } else {
      console.error('Apple Sign In error:', error);
      throw new Error('Apple Sign In failed');
    }
  }
}

/**
 * Get credential state for a user
 */
export async function getAppleCredentialState(user: string): Promise<AppleAuthentication.AppleAuthenticationCredentialState> {
  try {
    return await AppleAuthentication.getCredentialStateAsync(user);
  } catch (error) {
    console.error('Failed to get credential state:', error);
    return AppleAuthentication.AppleAuthenticationCredentialState.NOT_FOUND;
  }
}

/**
 * Check if user's Apple credentials are still valid
 */
export async function isAppleCredentialValid(user: string): Promise<boolean> {
  const state = await getAppleCredentialState(user);
  return state === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED;
}
