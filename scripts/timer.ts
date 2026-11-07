let startTime: number | undefined;

export function start(tip: string): void {
  console.log(`\ninfo: ${tip}`);
  startTime = performance.now();
}

export function end(tip: string): void {
  if (!startTime) throw Error;
  console.log(`\n✔ ${tip} in ${Math.round(performance.now() - startTime)}ms`);
}
