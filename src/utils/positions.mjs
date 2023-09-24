import { DIRECTIONS } from '../constants.mjs';

export function hashPos({ x, y }) {
    return `${x}_${y}`;
}

export function movePosUp({ x, y }) {
    return { x, y: y - 1 };
}

export function movePosDown({ x, y }) {
    return { x, y: y + 1 };
}

export function movePosRight({ x, y }) {
    return { x: x + 1, y };
}

export function movePosLeft({ x, y }) {
    return { x: x - 1, y };
}

export function getDirectionByPosDiff(fromPos, toPos) {
    if (isEqualPos(movePosUp(fromPos), toPos)) {
        return DIRECTIONS.UP;
    }

    if (isEqualPos(movePosDown(fromPos), toPos)) {
        return DIRECTIONS.DOWN;
    }

    if (isEqualPos(movePosRight(fromPos), toPos)) {
        return DIRECTIONS.RIGHT;
    }

    if (isEqualPos(movePosLeft(fromPos), toPos)) {
        return DIRECTIONS.LEFT;
    }
}

export function movePosToDirection(pos, direction) {
    switch (direction) {
        case DIRECTIONS.UP:
            return movePosUp(pos);
        case DIRECTIONS.DOWN:
            return movePosDown(pos);
        case DIRECTIONS.RIGHT:
            return movePosRight(pos);
        case DIRECTIONS.LEFT:
            return movePosLeft(pos);
        default:
            throw new Error(`Unknown direction [${direction}]`);
    }
}

export function isEqualPos(firstPos, secondPos) {
    return firstPos.x === secondPos.x && firstPos.y === secondPos.y;
}

export function calculateManhattanDistance(firstPos, secondPos) {
    return Math.abs(firstPos.x - secondPos.x) + Math.abs(firstPos.y - secondPos.y);
}
