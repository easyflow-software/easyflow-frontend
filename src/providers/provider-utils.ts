export const emitUnboundError = <T>(): T => {
  /* eslint no-console: ["warn", {allow: ["error", "trace"]}] */
  console.error('Missing Context Provider');
  console.trace();
  return undefined as unknown as T;
};
