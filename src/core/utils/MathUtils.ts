const getRandomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

// const lerp = (a: number, b: number, n: number) => {
//   return (1 - n) * a + n * b
// }

const lerp = (a: number, b: number, n: number, maxSpeed: number) => {
  let diff = b - a;
  if (diff > maxSpeed) {
    diff = maxSpeed;
  } else if (diff < -maxSpeed) {
    diff = -maxSpeed;
  }
  return a + diff * n;
}

export const MathUtils = {
  getRandomBetween,
  lerp
}