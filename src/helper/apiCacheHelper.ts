import cacheData from "memory-cache";

export enum CacheInvalidateTime {
    Fire = 100,
    HOT = 1000,
    DEFAULT = 3 * 1000,
    COLD = 10*1000,
    ICE = 60 * 60 * 1000
}

export function getCache(url: string) {
    return cacheData.get(url);
}

export function setCache(url: string, data: any, time = CacheInvalidateTime.DEFAULT.valueOf()) {
    cacheData.put(url, data, time);
}