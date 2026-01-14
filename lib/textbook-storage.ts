/**
 * Textbook Storage Service - Offline caching for textbook readings
 * Ensures textbook-reading.tsx can load cached readings when offline
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TextbookReading } from "./textbook-reading-types";

const KEYS = {
  TEXTBOOK_READINGS_CACHE: "@grammar_tutor:textbook_readings_cache",
  LAST_SYNC_TIME: "@grammar_tutor:textbook_last_sync",
};

/**
 * Save all textbook readings to local cache
 */
export async function cacheTextbookReadings(readings: TextbookReading[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.TEXTBOOK_READINGS_CACHE, JSON.stringify(readings));
    await AsyncStorage.setItem(KEYS.LAST_SYNC_TIME, Date.now().toString());
    console.log(`Cached ${readings.length} textbook readings`);
  } catch (error) {
    console.error("Failed to cache textbook readings:", error);
  }
}

/**
 * Get cached textbook readings from local storage
 */
export async function getCachedTextbookReadings(): Promise<TextbookReading[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.TEXTBOOK_READINGS_CACHE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load cached textbook readings:", error);
    return [];
  }
}

/**
 * Get a specific reading by ID from cache
 */
export async function getCachedReading(id: string): Promise<TextbookReading | null> {
  try {
    const readings = await getCachedTextbookReadings();
    return readings.find(r => r.id === id) || null;
  } catch (error) {
    console.error("Failed to get cached reading:", error);
    return null;
  }
}

/**
 * Get last sync timestamp
 */
export async function getLastSyncTime(): Promise<number> {
  try {
    const time = await AsyncStorage.getItem(KEYS.LAST_SYNC_TIME);
    return time ? parseInt(time) : 0;
  } catch (error) {
    console.error("Failed to get last sync time:", error);
    return 0;
  }
}

/**
 * Check if cache needs refresh (older than 7 days)
 */
export async function needsCacheRefresh(): Promise<boolean> {
  const lastSync = await getLastSyncTime();
  if (lastSync === 0) return true;
  
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  return lastSync < sevenDaysAgo;
}

/**
 * Clear all cached textbook data
 */
export async function clearTextbookCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      KEYS.TEXTBOOK_READINGS_CACHE,
      KEYS.LAST_SYNC_TIME,
    ]);
    console.log("Cleared textbook cache");
  } catch (error) {
    console.error("Failed to clear textbook cache:", error);
  }
}
