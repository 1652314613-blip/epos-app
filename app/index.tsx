/**
 * App Entry Point
 * 
 * 应用启动时显示欢迎页面
 */

import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    // 检查是否是首次启动
    const checkFirstLaunch = async () => {
      // 这里可以添加检查逻辑
      // 暂时直接跳转到欢迎页面
      router.replace("/welcome");
    };

    checkFirstLaunch();
  }, []);

  return null;
}
