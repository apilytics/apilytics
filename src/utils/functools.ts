// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tryTwice = async <F extends (...args: any) => any>(
  func: F,
  ...args: Parameters<F>
): Promise<ReturnType<F>> => {
  try {
    return await func(...args);
  } catch (e) {
    return func(...args);
  }
};
