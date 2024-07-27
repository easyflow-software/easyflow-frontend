export const emitUnboundError = <T>(): T => {
  console.error('Missing Context Provider');
  console.trace();
  return undefined as unknown as T;
};
