import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import type { Repository } from './repository';

/** Loads a repository's list, reloads it whenever the screen gains focus, and keeps it in sync after changes. */
export function useRepositoryList<T extends { id: string }>(repository: Repository<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setItems(await repository.list());
    setLoading(false);
  }, [repository]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const add = async (item: T) => {
    setItems((prev) => [...prev, item]);
    await repository.add(item);
  };

  const update = async (item: T) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    await repository.update(item);
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await repository.remove(id);
  };

  return { items, loading, add, update, remove, refresh };
}
