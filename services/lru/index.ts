import LRUAdapter from './adapters/lru';

class LRUCache {
  adapter: any;

  constructor(adapter, options) {
    this.setAdapter(adapter, options);
  }

  setAdapter(adapter, options) {
    this.adapter = new adapter(options);
  }

  getAdapter() {
    return this.adapter;
  }

  set(key, value) {
    this.adapter.set(key, value);
    return value;
  }

  get(key) {
    return this.adapter.get(key);
  }
}

const LRUCacheService = new LRUCache(LRUAdapter, {
  max: 500,
  length: (n: any) => n.length,
  dispose: (n: any) => n.close(),
  maxAge: 1000 * 60 * 5,
});

export default LRUCacheService;
