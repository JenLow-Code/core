declare module 'cloudflare:workers' {
  export abstract class WorkerEntrypoint<Env> {
    protected env: Env;
    protected ctx: import('../core/platform').ExecutionContext;
  }
}
