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

export interface Overlapping {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}
const isOverlapping = (entityPosition: Position, entitySize: Size, targetPosition: Position, targetSize: Size): Overlapping | undefined => {
  if (entityPosition.x < targetPosition.x + targetSize.width &&
    entityPosition.x + entitySize.width > targetPosition.x &&
    entityPosition.y < targetPosition.y + targetSize.height &&
    entityPosition.y + entitySize.height > targetPosition.y
  ) {
    const overlapping: Overlapping = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }
    if (entityPosition.x + entitySize.width > targetPosition.x && (entityPosition.x + entitySize.width - targetPosition.x < targetSize.width)) overlapping.right = true;
    if (entityPosition.x < targetPosition.x + targetSize.width && (targetPosition.x + targetSize.width - entityPosition.x < targetSize.width)) overlapping.left = true;
    if (entityPosition.y + entitySize.height > targetPosition.y && (entityPosition.y + entitySize.height - targetPosition.y < targetSize.height)) overlapping.bottom = true;
    if (entityPosition.y < targetPosition.y + targetSize.height && (targetPosition.y + targetSize.height - entityPosition.y < targetSize.height)) overlapping.top = true;
    return overlapping;
  }
  return undefined;
}

export const xor = (a: boolean, b: boolean) => {
  return (a && !b) || (!a && b);
}

export const MathUtils = {
  getRandomBetween,
  lerp,
  constantLerp,
  getDistanceBetween,
  isOverlapping,
  xor
}