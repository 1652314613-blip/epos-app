import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomSplashScreen from "@/components/custom-splash-screen";
import PWAInstallPrompt from "@/components/pwa-install-prompt";
import { registerServiceWorker } from "@/lib/pwa-register";

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore errors if splash screen is already hidden
});
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);
  const [appIsReady, setAppIsReady] = useState(false);

  // Initialize app and hide splash screen
  useEffect(() => {
    // 注册Service Worker (Web平台)
    if (Platform.OS === "web") {
      registerServiceWorker();
    }

    async function prepare() {
      try {
        // Initialize Manus runtime
        initManusRuntime();
        
        // Preload MaterialIcons font to prevent timeout
        // Use a shorter timeout and catch errors gracefully
        await Promise.race([
          Font.loadAsync({
            ...MaterialIcons.font,
          }),
          new Promise((resolve) => setTimeout(resolve, 3000)), // 3 second timeout
        ]).catch((err) => {
          console.warn('Font loading timeout or error (non-critical):', err);
          // Continue anyway - icons will use fallback
        });
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Hide splash screen when app is ready
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore errors if splash screen is already hidden
      });
    }
  }, [appIsReady]);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for mobile
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

  // Ensure minimum 8px padding for top and bottom on mobile
  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);

  // Don't render app until ready
  if (!appIsReady) {
    return <CustomSplashScreen />;
  }

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
          {/* Default to hiding native headers so raw route segments don't appear (e.g. "(tabs)", "products/[id]"). */}
          {/* If a screen needs the native header, explicitly enable it and set a human title via Stack.Screen options. */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="oauth/callback" />
          </Stack>
          <StatusBar style="auto" />
          {/* PWA安装引导 (Web平台) */}
          {Platform.OS === "web" && <PWAInstallPrompt />}
          </QueryClientProvider>
        </trpc.Provider>
      </AuthProvider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={providerInitialMetrics}>
          <SafeAreaFrameContext.Provider value={frame}>
            <SafeAreaInsetsContext.Provider value={insets}>
              {content}
            </SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>
    </ThemeProvider>
  );
}
