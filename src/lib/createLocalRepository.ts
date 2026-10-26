import type { Repository } from './repository';
import { loadList, saveList } from './storage';

/** Generic on-device repository that keeps one list under one storage key. */
export function createLocalRepository<T extends { id: string }>(key: string): Repository<T> {
  return {
    list: () => loadList<T>(key),
    async add(item) {
      const items = await loadList<T>(key);
      await saveList(key, [...items, item]);
    },
    async update(item) {
      const items = await loadList<T>(key);
      await saveList(key, items.map((i) => (i.id === item.id ? item : i)));
    },
    async remove(id) {
      const items = await loadList<T>(key);
      await saveList(key, items.filter((i) => i.id !== id));
    },
  };
}
