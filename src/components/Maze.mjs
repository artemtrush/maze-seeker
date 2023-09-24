/* eslint-disable no-param-reassign */
import { MAZE_MAX_SIZE, CELLS, VIEW_SCOPE_SIZE, VIEW_SCOPE_MARGIN, DIRECTIONS } from '../constants.mjs';
import { isEqualPos, movePosDown, movePosLeft, movePosRight, movePosToDirection, movePosUp } from '../utils/positions.mjs';
import Field from './Field.mjs';

export default class Maze {
    constructor() {
        // Create larger field by default to don't care about edges
        this._field = new Field({
            width        : (MAZE_MAX_SIZE + VIEW_SCOPE_SIZE) * 2,
            height       : (MAZE_MAX_SIZE + VIEW_SCOPE_SIZE) * 2,
            initialValue : CELLS.UNKNOWN
        });

        const centerPos = {
            x : Math.floor(this._field.getWidth() / 2),
            y : Math.floor(this._field.getHeight() / 2)
        };

        this.setPlayerPos(centerPos);

        this._startPos = centerPos;
        this._goalPos = null;
    }

    get(pos) {
        return this._field.get(pos);
    }

    set(pos, value) {
        this._field.set(pos, value);
    }

    isGoalFound() {
        return Boolean(this._goalPos);
    }

    getStartPos() {
        return this._startPos;
    }

    getGoalPos() {
        return this._goalPos;
    }

    getPlayerPos() {
        return this._playerPos;
    }

    setPlayerPos(pos) {
        const currentValue = this._field.get(pos);
        const isInitialSetup = !this._playerPos;

        if (currentValue !== CELLS.EMPTY && !isInitialSetup) {
            throw new Error(`Trying to set player to invalid position [${currentValue}]!`);
        }

        // Reset old postion
        if (this._playerPos) {
            this._field.set(this._playerPos, CELLS.EMPTY);
        }

        this._playerPos = pos;
        this._field.set(pos, CELLS.PLAYER);
    }

    movePlayer(path) {
        let pos = this.getPlayerPos();

        for (const direction of path) {
            pos = movePosToDirection(pos, direction);
        }

        this.setPlayerPos(pos);
    }

    extendKnowledge(viewScope) {
        const iterator = viewScope.getViewIterator();
        const playerPos = this.getPlayerPos();

        let containsNewEdge = false;

        for (const { offsetX, offsetY, value } of iterator) {
            const x = playerPos.x + offsetX;
            const y = playerPos.y + offsetY;
            const pos = { x, y };

            if (this._field.get(pos) === value) {
                continue;
            }

            this._field.set(pos, value);

            if (value === CELLS.GOAL) {
                this._goalPos = pos;
            } else if (value === CELLS.EDGE) {
                containsNewEdge = true;
            }
        }

        if (containsNewEdge) {
            // this._extendEdgesAroundPlayer();
        }
    }

    estimatePosPotentialKnowldedge(pos) {
        const topX = pos.x - VIEW_SCOPE_MARGIN;
        const topY = pos.y - VIEW_SCOPE_MARGIN;

        let unknownCells = 0;

        for (let x = topX; x < topX + VIEW_SCOPE_SIZE; x++) {
            for (let y = topY; y < topY + VIEW_SCOPE_SIZE; y++) {
                if (this._field.get({ x, y }) === CELLS.UNKNOWN) {
                    unknownCells++;
                }
            }
        }

        return unknownCells;
    }

    _extendEdgesAroundPlayer() {
        // Helpers for fill not only edge line but also possible view scope
        // To don't care about unknown cells behind the edge
        const fillLeftVerticalEdge = (edgeX) => {
            for (let x = edgeX; x >= edgeX - VIEW_SCOPE_MARGIN; x--) {
                for (let y = 0; y < this._field.getHeight(); y++) {
                    this._field.set({ x, y }, CELLS.EDGE);
                }
            }
        };

        const fillRightVerticalEdge = (edgeX) => {
            for (let x = edgeX; x <= edgeX + VIEW_SCOPE_MARGIN; x++) {
                for (let y = 0; y < this._field.getHeight(); y++) {
                    this._field.set({ x, y }, CELLS.EDGE);
                }
            }
        };

        const fillUpHorisontalEdge = (edgeY) => {
            for (let y = edgeY; y >= edgeY - VIEW_SCOPE_MARGIN; y--) {
                for (let x = 0; x < this._field.getWidth(); x++) {
                    this._field.set({ x, y }, CELLS.EDGE);
                }
            }
        };

        const fillDownHorisontalEdge = (edgeY) => {
            for (let y = edgeY; y <= edgeY + VIEW_SCOPE_MARGIN; y++) {
                for (let x = 0; x < this._field.getWidth(); x++) {
                    this._field.set({ x, y }, CELLS.EDGE);
                }
            }
        };

        // Go in all directions and check for edges
        const playerPos = this.getPlayerPos();

        for (let i = 0, pos = playerPos; i <= VIEW_SCOPE_MARGIN; i++, pos = movePosUp(pos)) {
            if (this._field.get(pos) === CELLS.EDGE) {
                fillUpHorisontalEdge(pos.y);
                break;
            }
        }

        for (let i = 0, pos = playerPos; i <= VIEW_SCOPE_MARGIN; i++, pos = movePosDown(pos)) {
            if (this._field.get(pos) === CELLS.EDGE) {
                fillDownHorisontalEdge(pos.y);
                break;
            }
        }

        for (let i = 0, pos = playerPos; i <= VIEW_SCOPE_MARGIN; i++, pos = movePosLeft(pos)) {
            if (this._field.get(pos) === CELLS.EDGE) {
                fillLeftVerticalEdge(pos.x);
                break;
            }
        }

        for (let i = 0, pos = playerPos; i <= VIEW_SCOPE_MARGIN; i++, pos = movePosRight(pos)) {
            if (this._field.get(pos) === CELLS.EDGE) {
                fillRightVerticalEdge(pos.x);
                break;
            }
        }
    }

    // Additional methods

    getValidNeighborsForPos(pos, order = [ DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.RIGHT, DIRECTIONS.LEFT ]) {
        const neighbors = [];

        for (const direction of order) {
            neighbors.push(movePosToDirection(pos, direction));
        }

        return neighbors.filter(neighbor => this.isValidPos(neighbor));
    }

    isValidPos(pos) {
        const value = this._field.get(pos);

        return value === CELLS.EMPTY || value === CELLS.PLAYER || value === CELLS.GOAL;
    }

    debug() {
        this._field.debug();
    }
}

