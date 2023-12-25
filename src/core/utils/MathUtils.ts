const getRandomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

const lerp = (a: number, b: number, n: number) => {
  return (1 - n) * a + n * b
}

const constantLerp = (currentX: number, currentY: number, targetX: number, targetY: number, maxSpeed: number) => {
  const dx = targetX - currentX;
  const dy = targetY - currentY;

  // Calcular la distancia total
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calcular la velocidad proporcional a la distancia
  const speed = Math.min(maxSpeed, distance);

  // Calcular los incrementos para x e y
  const incrementX = (dx / distance) * speed;
  const incrementY = (dy / distance) * speed;

  // Calcular y devolver la nueva posición
  const newX = currentX + incrementX;
  const newY = currentY + incrementY;

  return { x: newX, y: newY };
};

export const MathUtils = {
  getRandomBetween,
  lerp,
  constantLerp
}