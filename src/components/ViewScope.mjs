import { CELLS, VIEW_SCOPE_MARGIN, VIEW_SCOPE_SIZE } from '../constants.mjs';
import printArray from '../utils/printArray.mjs';

export default class ViewScope {
    constructor(scopeInfo) {
        this._scopeInfo = scopeInfo;
    }

    getViewIterator() {
        const scopeInfo = this._scopeInfo;
        const parseCellValue = this._parseCellValue;

        let i = 0;
        let j = 0;

        const iterator = {
            next() {
                if (i === VIEW_SCOPE_SIZE) {
                    return { done: true };
                }

                const point = {
                    offsetX : j - VIEW_SCOPE_MARGIN,
                    offsetY : i - VIEW_SCOPE_MARGIN,
                    value   : parseCellValue(scopeInfo[i][j])
                };

                j++;

                if (j === VIEW_SCOPE_SIZE) {
                    j = 0;
                    i++;
                }

                return { value: point, done: false };
            },
            [Symbol.iterator]() {
                return this;
            }
        };

        return iterator;
    }

    _parseCellValue(sourceValue) {
        switch (sourceValue) {
            case null:
                return CELLS.EDGE;
            case 'W':
                return CELLS.WALL;
            case 'E':
                return CELLS.EMPTY;
            case 'P':
                return CELLS.PLAYER;
            case 'G':
                return CELLS.GOAL;
            default:
                throw new Error(`Unknown cell value [${sourceValue}]`);
        }
    }

    debug() {
        printArray(this._scopeInfo);
    }
}
