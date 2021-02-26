export type QueueJobDefinitionType = {
  queue: string;
  concurrency: number;
  job: ({ data: any }) => Promise<void>;
};
