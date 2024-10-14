export interface ResolvedFreshConfig {
  build: {
    outDir: string;
  };
}

export interface Plugin<State = Record<string, unknown>> {
  name: string;
  buildStart?(config: ResolvedFreshConfig): Promise<void> | void;
}
