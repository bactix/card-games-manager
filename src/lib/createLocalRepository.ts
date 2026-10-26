import type { Repository } from './repository';
import { loadList, saveList } from './storage';

/**
 * Generic on-device repository that keeps one list under one storage key.
 * `seed` is what the list holds until something is saved for the first time.
 */
export function createLocalRepository<T extends { id: string }>(
  key: string,
  seed: T[] = [],
): Repository<T> {
  const read = () => loadList<T>(key, seed);
  return {
    list: read,
    async add(item) {
      const items = await read();
      await saveList(key, [...items, item]);
    },
    async update(item) {
      const items = await read();
      await saveList(key, items.map((i) => (i.id === item.id ? item : i)));
    },
    async remove(id) {
      const items = await read();
      await saveList(key, items.filter((i) => i.id !== id));
    },
  };
}
