/**
 * ⚡ REDIS CACHE - Ultra rápido
 *
 * Cache de queries para evitar ir a la DB constantemente
 */

// Simulación de cache en memoria (si no tienes Redis)
const memoryCache = new Map<string, { data: any; expires: number }>();

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    // Verificar cache en memoria
    const cached = memoryCache.get(key);
    if (cached && cached.expires > Date.now()) {
      console.log(`✅ Cache HIT: ${key}`);
      return cached.data as T;
    }

    console.log(`❌ Cache MISS: ${key}`);
    return null;
  },

  async set(key: string, data: any, ttlSeconds: number = 60): Promise<void> {
    memoryCache.set(key, {
      data,
      expires: Date.now() + ttlSeconds * 1000,
    });
    console.log(`💾 Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
  },

  async del(key: string): Promise<void> {
    memoryCache.delete(key);
    console.log(`🗑️  Cache DEL: ${key}`);
  },

  async clear(): Promise<void> {
    memoryCache.clear();
    console.log(`🧹 Cache CLEARED`);
  },
};

/**
 * Helper para cachear funciones automáticamente
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 60
): Promise<T> {
  // Intentar obtener del cache
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Si no está en cache, ejecutar función
  const result = await fn();

  // Guardar en cache
  await cache.set(key, result, ttl);

  return result;
}

/**
 * Invalidar cache por patrón
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  const keys = Array.from(memoryCache.keys());
  const toDelete = keys.filter((key) => key.includes(pattern));

  for (const key of toDelete) {
    await cache.del(key);
  }

  console.log(`🗑️  Invalidated ${toDelete.length} keys matching: ${pattern}`);
}
