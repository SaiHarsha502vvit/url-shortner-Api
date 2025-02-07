import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const setCache = (key, value) => {
    cache.set(key, value);
};

const getCache = (key) => {
    return cache.get(key);
};

const delCache = (key) => {
    cache.del(key);
};

const flushCache = () => {
    cache.flushAll();
};

export { setCache, getCache, delCache, flushCache };