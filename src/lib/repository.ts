/**
 * The contract every feature's data source implements.
 * Local storage and API versions are interchangeable behind it.
 */
export interface Repository<T extends { id: string }> {
  list(): Promise<T[]>;
  add(item: T): Promise<void>;
  update(item: T): Promise<void>;
  remove(id: string): Promise<void>;
  /** Saves the whole list in the given order. */
  replaceAll(items: T[]): Promise<void>;
}
