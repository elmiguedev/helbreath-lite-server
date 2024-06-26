import { randomUUID } from "crypto";
import { Position } from "../domain/entities/generic/Position";
import { Size } from "../domain/entities/generic/Size";

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

const getDistanceBetween = (position: Position, target: Position) => {
  return Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.y - target.y, 2));
}

const isOverlapping = (entityPosition: Position, entitySize: Size, targetPosition: Position, targetSize: Size): boolean => {
  const entityRightEdge = entityPosition.x + (entitySize.width / 2);
  const entityLeftEdge = entityPosition.x - (entitySize.width / 2);
  const entityTopEdge = entityPosition.y - (entitySize.height / 2);
  const entityBottomEdge = entityPosition.y + (entitySize.height / 2);

  const targetRightEdge = targetPosition.x + (targetSize.width / 2);
  const targetLeftEdge = targetPosition.x - (targetSize.width / 2);
  const targetTopEdge = targetPosition.y - (targetSize.height / 2);
  const targetBottomEdge = targetPosition.y + (targetSize.height / 2);

  // const targetRightEdge = targetPosition.x + (targetSize.width);
  // const targetLeftEdge = targetPosition.x;
  // const targetTopEdge = targetPosition.y;
  // const targetBottomEdge = targetPosition.y + (targetSize.height);


  const horizontalOverlap = entityLeftEdge < targetLeftEdge && entityRightEdge < targetLeftEdge ? false : entityRightEdge > targetRightEdge && entityLeftEdge > targetRightEdge ? false : true;

  const verticalOverlap = entityTopEdge < targetTopEdge && entityBottomEdge < targetTopEdge ? false : entityBottomEdge > targetBottomEdge && entityTopEdge > targetBottomEdge ? false : true;

  return horizontalOverlap && verticalOverlap;
}

const xor = (a: boolean, b: boolean) => {
  return (a && !b) || (!a && b);
}

const getRandomId = () => {
  return randomUUID();
}

const fixProbability = (probability: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, probability));
}

const getIntegerBetween = (min: number, max: number) => {
  return Math.floor(getRandomBetween(min, max));
}

export const MathUtils = {
  getRandomBetween,
  getIntegerBetween,
  lerp,
  constantLerp,
  getDistanceBetween,
  isOverlapping,
  xor,
  getRandomId,
  fixProbability
}