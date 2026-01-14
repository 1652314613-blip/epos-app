/**
 * Apple Authentication Service
 * Verifies Apple identity tokens (JWT) using Apple's public keys
 */

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Apple's JWKS endpoint for public keys
const APPLE_JWKS_URI = "https://appleid.apple.com/auth/keys";

// Create JWKS client
const client = jwksClient({
  jwksUri: APPLE_JWKS_URI,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

/**
 * Get Apple's signing key
 */
function getAppleSigningKey(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key?.getPublicKey();
        if (signingKey) {
          resolve(signingKey);
        } else {
          reject(new Error("Failed to get public key"));
        }
      }
    });
  });
}

/**
 * Apple JWT payload interface
 */
export interface AppleTokenPayload {
  iss: string; // https://appleid.apple.com
  aud: string; // Your app's bundle ID
  exp: number; // Expiration time
  iat: number; // Issued at time
  sub: string; // User's unique Apple ID
  email?: string; // User's email (if shared)
  email_verified?: boolean | string;
  is_private_email?: boolean | string;
  real_user_status?: number;
}

/**
 * Verify Apple identity token
 * @param token - The identity token from Apple Sign In
 * @returns Decoded and verified token payload
 */
export async function verifyAppleToken(token: string): Promise<AppleTokenPayload> {
  try {
    // Decode token header to get 'kid' (key ID)
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token format");
    }

    const { kid } = decoded.header;
    if (!kid) {
      throw new Error("Token missing 'kid' in header");
    }

    // Get Apple's public key for this kid
    const publicKey = await getAppleSigningKey(kid);

    // Verify and decode the token
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "https://appleid.apple.com",
      // Note: In production, you should verify 'aud' matches your app's bundle ID
      // audience: process.env.APPLE_BUNDLE_ID,
    }) as AppleTokenPayload;

    // Additional validation
    if (!payload.sub) {
      throw new Error("Token missing 'sub' (user ID)");
    }

    return payload;
  } catch (error) {
    console.error("[Apple Auth] Token verification failed:", error);
    throw new Error(
      `Apple token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Validate Apple authorization code (for server-to-server flow)
 * This is an alternative to verifying identity tokens
 * Requires client_secret generation using Apple's private key
 */
export async function validateAppleAuthCode(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<any> {
  try {
    const response = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Apple token exchange failed: ${error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Apple Auth] Code validation failed:", error);
    throw error;
  }
}
