import printArray from '../utils/printArray.mjs';

export default class Field {
    constructor({ width, height, initialValue = null }) {
        const field = [];

        for (let i = 0; i < height; i++) {
            const row = new Array(width).fill(initialValue);

            field.push(row);
        }

        this._field = field;
    }

    getWidth() {
        return this._field[0].length;
    }

    getHeight() {
        return this._field.length;
    }

    get({ x, y }) {
        return this._field[y][x];
    }

    set({ x, y }, value) {
        this._field[y][x] = value;
    }

    debug() {
        printArray(this._field);
    }
}
