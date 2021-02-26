import queueService from '../../services/queue';
const Queue = require('bull');

jest.mock('bull', () => {
  return jest.fn().mockImplementation((name) => {
    const mockProcess = jest.fn();
    return {name, process: mockProcess};
  });
});

describe('Services - Queue Service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should register a new queue', async () => {
    queueService.registerQueue('newQueue');
    expect(queueService.getQueue('newQueue')).toBeDefined();
  });

  test('should register a job', async () => {
    const job = jest.fn();
    const queue = queueService.getQueue('newQueue');
    queue.process = jest.fn();
    expect(queueService.registerJob('newQueue', job)).not.toThrow;
    expect(queue.process).toHaveBeenCalledTimes(1);
  });

  test('should run a job', async () => {
    const queue = queueService.getQueue('newQueue');
    queue.add = jest.fn().mockImplementationOnce(() => Promise.resolve());
    const data = { foo: 'bar' };
    expect(await queueService.addJob('newQueue', data)).not.toThrow;
    expect(queue.add).toHaveBeenCalledTimes(1);
    expect(queue.add).toHaveBeenCalledWith(data);
  });

  describe('patientInviteEmail', () => {
    test('should register a `patientInviteEmail` queue', async () => {
      expect(queueService.getQueue('patientInviteEmail')).toBeDefined();
    });
  });

});