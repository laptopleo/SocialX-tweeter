/**
 * ⚡ SISTEMA DE CACHE EN MEMORIA
 *
 * Cache simple para reducir llamadas a la base de datos
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 1000 * 60 * 5; // 5 minutos por defecto

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.defaultTTL),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Verificar si expiró
    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Limpiar entradas expiradas
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp) {
        this.cache.delete(key);
      }
    }
  }
}

// Instancia global
export const cache = new MemoryCache();

// Limpiar cache cada 10 minutos
if (typeof window === "undefined") {
  setInterval(() => cache.cleanup(), 1000 * 60 * 10);
}

/**
 * Helper para cachear funciones
 */
export function withCache<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached) return Promise.resolve(cached);

  return fn().then((data) => {
    cache.set(key, data, ttl);
    return data;
  });
}
