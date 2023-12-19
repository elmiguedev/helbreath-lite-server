const getRandomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

const lerp = (a: number, b: number, n: number) => {
  return (1 - n) * a + n * b
}

export const MathUtils = {
  getRandomBetween,
  lerp
}