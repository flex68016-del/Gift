/**
 * Cache Redis/Upstash pour les cadeaux chauds
 * Toutes les opérations sont async pour supporter Upstash REST API
 */

interface CacheProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  delPattern(pattern: string): Promise<void>;
}

/**
 * Implémentation Upstash (placeholder)
 * À remplacer par un vrai client Upstash/ioredis quand disponible
 */
class UpstashCache implements CacheProvider {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.UPSTASH_REDIS_REST_URL || "";
    this.token = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  }

  async get(key: string): Promise<string | null> {
    if (!this.baseUrl || !this.token) {
      // Fallback: pas de cache si Upstash n'est pas configuré
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/get/${key}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.result;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.baseUrl || !this.token) {
      return;
    }

    try {
      const url = `${this.baseUrl}/set/${key}`;
      const body = new URLSearchParams();
      body.append("value", value);
      if (ttl) {
        body.append("ex", ttl.toString());
      }

      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
    } catch {
      // Ignore les erreurs de cache
    }
  }

  async del(key: string): Promise<void> {
    if (!this.baseUrl || !this.token) {
      return;
    }

    try {
      await fetch(`${this.baseUrl}/del/${key}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch {
      // Ignore les erreurs de cache
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.baseUrl || !this.token) {
      return;
    }

    try {
      await fetch(`${this.baseUrl}/keys/${pattern}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch {
      // Ignore les erreurs de cache
    }
  }
}

const cacheProvider = new UpstashCache();

/**
 * Clés de cache
 */
const CACHE_KEYS = {
  gift: (giftId: string) => `gift:${giftId}`,
  giftShell: (slug: string) => `gift:shell:${slug}`,
} as const;

/**
 * TTL du cache en secondes
 */
const CACHE_TTL = {
  gift: 60, // 60 secondes pour les cadeaux chauds
  giftShell: 30, // 30 secondes pour la coque de page
} as const;

/**
 * Cache d'un cadeau (sans URL signées)
 */
export async function cacheGift(giftId: string, payload: unknown): Promise<void> {
  const key = CACHE_KEYS.gift(giftId);
  await cacheProvider.set(key, JSON.stringify(payload), CACHE_TTL.gift);
}

/**
 * Récupérer un cadeau du cache
 */
export async function getCachedGift(giftId: string): Promise<unknown | null> {
  const key = CACHE_KEYS.gift(giftId);
  const value = await cacheProvider.get(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Invalider le cache d'un cadeau
 */
export async function invalidateGiftCache(giftId: string): Promise<void> {
  const key = CACHE_KEYS.gift(giftId);
  await cacheProvider.del(key);
}

/**
 * Cache de la coque de page
 */
export async function cacheGiftShell(slug: string, payload: unknown): Promise<void> {
  const key = CACHE_KEYS.giftShell(slug);
  await cacheProvider.set(key, JSON.stringify(payload), CACHE_TTL.giftShell);
}

/**
 * Récupérer la coque de page du cache
 */
export async function getCachedGiftShell(slug: string): Promise<unknown | null> {
  const key = CACHE_KEYS.giftShell(slug);
  const value = await cacheProvider.get(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Invalider tous les caches liés à un cadeau
 */
export async function invalidateAllGiftCaches(giftId: string, slug: string): Promise<void> {
  await Promise.all([
    invalidateGiftCache(giftId),
    cacheProvider.del(CACHE_KEYS.giftShell(slug)),
  ]);
}
