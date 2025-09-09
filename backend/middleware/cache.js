// Simple in-memory cache to reduce database queries
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    // Create cache key based on user ID, route, and query params
    const cacheKey = `${req.user?.id || 'anonymous'}_${req.originalUrl}_${JSON.stringify(req.query)}`;
    
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < duration) {
      return res.json(cachedData.data);
    }
    
    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json to cache the response
    res.json = function(data) {
      if (data.success) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        // Clean up old cache entries periodically
        if (cache.size > 100) {
          const now = Date.now();
          for (const [key, value] of cache.entries()) {
            if (now - value.timestamp > duration) {
              cache.delete(key);
            }
          }
        }
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

export const clearUserCache = (userId) => {
  for (const key of cache.keys()) {
    if (key.startsWith(userId)) {
      cache.delete(key);
    }
  }
};

export const clearCache = () => {
  cache.clear();
};