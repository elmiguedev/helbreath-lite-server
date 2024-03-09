"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathUtils = void 0;
var crypto_1 = require("crypto");
var getRandomBetween = function (min, max) {
    return Math.random() * (max - min) + min;
};
var lerp = function (a, b, n) {
    return (1 - n) * a + n * b;
};
var constantLerp = function (currentX, currentY, targetX, targetY, maxSpeed) {
    var dx = targetX - currentX;
    var dy = targetY - currentY;
    // Calcular la distancia total
    var distance = Math.sqrt(dx * dx + dy * dy);
    // Calcular la velocidad proporcional a la distancia
    var speed = Math.min(maxSpeed, distance);
    // Calcular los incrementos para x e y
    var incrementX = (dx / distance) * speed;
    var incrementY = (dy / distance) * speed;
    // Calcular y devolver la nueva posición
    var newX = currentX + incrementX;
    var newY = currentY + incrementY;
    return { x: newX, y: newY };
};
var getDistanceBetween = function (position, target) {
    return Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.y - target.y, 2));
};
var isOverlapping = function (entityPosition, entitySize, targetPosition, targetSize) {
    return entityPosition.x < targetPosition.x + targetSize.width &&
        entityPosition.x + entitySize.width > targetPosition.x &&
        entityPosition.y < targetPosition.y + targetSize.height &&
        entityPosition.y + entitySize.height > targetPosition.y;
};
var xor = function (a, b) {
    return (a && !b) || (!a && b);
};
var getRandomId = function () {
    return (0, crypto_1.randomUUID)();
};
var fixProbability = function (probability, min, max) {
    return Math.max(min, Math.min(max, probability));
};
var getIntegerBetween = function (min, max) {
    return Math.floor(getRandomBetween(min, max));
};
exports.MathUtils = {
    getRandomBetween: getRandomBetween,
    getIntegerBetween: getIntegerBetween,
    lerp: lerp,
    constantLerp: constantLerp,
    getDistanceBetween: getDistanceBetween,
    isOverlapping: isOverlapping,
    xor: xor,
    getRandomId: getRandomId,
    fixProbability: fixProbability
};
