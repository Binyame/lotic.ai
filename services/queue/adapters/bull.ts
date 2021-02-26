import Queue from 'bull';

class BullAdapter {
  options: any;

  constructor(options) {
    this.options = options;
  }

  registerQueue(name) {
    return new Queue(name, this.options);
  }

  registerJob(queue, job, concurrency = 1) {
    queue.process(concurrency, job);

    if (queue.on) {
      queue
        .on('error', function (error) {
          // An error occured.
          console.log('error', error);
        })
        .on('waiting', function (jobId) {
          // A Job is waiting to be processed as soon as a worker is idling.
          console.log('waiting');
        })
        .on('active', function (job, jobPromise) {
          // A job has started. You can use `jobPromise.cancel()`` to abort it.
          console.log('active');
        })
        .on('stalled', function (job) {
          // A job has been marked as stalled. This is useful for debugging job
          // workers that crash or pause the event loop.
        })
        .on('progress', function (job, progress) {
          console.log(`Job ${job.id} is ${progress * 100}% ready!`);
        })
        .on('completed', function (job, result) {
          // A job successfully completed with a `result`.
          console.log('Completed', result);
        })
        .on('failed', function (job, err) {
          // A job failed with reason `err`!
          console.log('FAILED', err);
        })
        .on('paused', function () {
          // The queue has been paused.
        })
        .on('resumed', function (job) {
          // The queue has been resumed.
        })
        .on('cleaned', function (jobs, type) {
          // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
          // jobs, and `type` is the type of jobs cleaned.
        })
        .on('drained', function () {
          // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
        })
        .on('removed', function (job) {
          // A job successfully removed.
        });
    }
  }

  addJob(queue, data) {
    return queue.add(data);
  }
}

export default BullAdapter;
