export default function throttle(func, duration) {
  let lastCall = 0;
  return function (...args) {
    let now = Date.now();
    if (now - lastCall < duration * 1000) return;
    lastCall = now;
    return func.apply(this, args);
  };
}
