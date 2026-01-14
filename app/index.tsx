/**
 * App Entry Point
 * 
 * 应用启动时直接显示EPOS首页
 */

import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    // 直接跳转到首页
    router.replace("/(tabs)");
  }, []);

  return null;
}
