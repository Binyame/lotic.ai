import { find } from 'lodash';

import BullAdapter from './adapters/bull';

import config from '../../config/config';

import * as jobList from './jobs';

export class QueueService {
  adapter: BullAdapter;
  queues: any;

  constructor(adapter) {
    if (!adapter) {
      throw new Error('Must provide an adapter');
    }
    this.adapter = adapter;
    this.queues = [];

    this.registerDefaultQueues();
  }

  registerDefaultQueues() {
    for (const _j of Object.values(jobList)) {
      this.registerQueue(_j.queue);
    }
  }

  registerQueue(name) {
    const queue = this.adapter.registerQueue(name);
    this.queues.push(queue);
  }

  startJobs() {
    for (const _j of Object.values(jobList)) {
      this.registerJob(_j.queue, _j.job, _j.concurrency);
    }
  }

  getQueue(name) {
    const queue = find(this.queues, (q) => q.name === name);

    if (!queue) {
      throw new Error(`Queue ${name} could not be found`);
    }

    return queue;
  }

  registerJob(queueName, job, concurrency = 1) {
    const queue = this.getQueue(queueName);
    this.adapter.registerJob(queue, job, concurrency);
  }

  async addJob(queueName, data) {
    const queue = this.getQueue(queueName);
    await this.adapter.addJob(queue, data);
  }
}

const service = new QueueService(
  new BullAdapter({
    redis: config.redis.default.url || {
      host: config.redis.default.host,
      port: config.redis.default.port,
      password: config.redis.default.password,
    },
  })
);

export default service;
