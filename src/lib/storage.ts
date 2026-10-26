import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadList<T>(key: string, fallback: T[] = []): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : fallback;
}

export async function saveList<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}
