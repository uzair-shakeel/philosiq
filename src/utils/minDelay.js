export default function minDelay(promise, ms = 1000) {
  return Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]).then(([value]) => value);
}
