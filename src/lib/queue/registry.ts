/**
 * Registre des jobs de la file de tâches
 */

export interface JobHandler {
  name: string;
  handler: (payload: Record<string, unknown>) => Promise<void>;
  maxRetries?: number;
  retryDelay?: number; // en secondes
}

const jobRegistry = new Map<string, JobHandler>();

export function registerJob(job: JobHandler): void {
  jobRegistry.set(job.name, job);
}

export function getJob(name: string): JobHandler | undefined {
  return jobRegistry.get(name);
}

export function getAllJobs(): JobHandler[] {
  return Array.from(jobRegistry.values());
}
