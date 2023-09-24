import { CELLS, DIRECTIONS } from '../constants.mjs';
import BreadFirstPathFinder from '../path-finding/BreadFirstPathFinder.mjs';
import { hashPos, movePosToDirection } from '../utils/positions.mjs';
import BaseStrategy from './BaseStrategy.mjs';

export default class MainStrategy extends BaseStrategy {
    constructor(args) {
        super(args);

        this._breadFirstPathFinder = new BreadFirstPathFinder({ maze: this._maze });
        this._posMeta = {};
    }

    run() {
        while (true) {
            // Exploring maze
            const viewScope = this._player.lookAround();

            this._maze.extendKnowledge(viewScope);

            // Success case of finding path
            if (this._maze.isGoalFound()) {
                const result = this._breadFirstPathFinder.findShortestPath(
                    this._maze.getStartPos(),
                    this._maze.getGoalPos()
                );

                if (result) {
                    return result;
                }
            }

            // Move to the next explore point
            const pathToPoint = this._pickNextExplorePoint();

            this._player.move(pathToPoint);
            this._maze.movePlayer(pathToPoint);
        }
    }

    _pickNextExplorePoint() {
        let pos = this._maze.getPlayerPos();
        const fullPath = [];

        const directionsOrder = [ DIRECTIONS.DOWN, DIRECTIONS.RIGHT, DIRECTIONS.UP, DIRECTIONS.LEFT ];
        let directionIdx = 0;

        while (true) {
            const direction = directionsOrder[directionIdx];

            const { path, reached, lastPos } = this._walkIntoDirectionUntil(pos, direction, ({ nextValue }) => {
                return nextValue === CELLS.UNKNOWN;
            });

            pos = lastPos;
            fullPath.push(...path);

            if (reached) {
                return fullPath;
            }

            directionIdx++;

            if (directionIdx === directionsOrder.length) {
                directionIdx = 0;
            }
        }

        this._maze.debug();

        throw new Error('Something went wrong with path-finding!');
    }

    _isCrossing(pos) {

    }

    _walkIntoDirectionUntil(startPos, direction, untilCallback) {
        let pos = startPos;
        const path = [];

        while (true) {
            const nextPos = movePosToDirection(pos, direction);
            const nextValue = this._maze.get(nextPos);
            const nextPosId = hashPos(nextPos);

            if (nextValue === CELLS.WALL || nextValue === CELLS.EDGE) {
                return { path, reached: false, lastPos: pos };
            }

            if (untilCallback({ id: nextPosId, nextPos, nextValue })) {
                return { path, reached: true, lastPos: pos };
            }

            path.push(direction);
            pos = nextPos;
        }
    }
}
