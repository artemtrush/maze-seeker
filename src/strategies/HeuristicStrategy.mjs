import BreadFirstPathFinder from '../path-finding/BreadFirstPathFinder.mjs';
import AStarPathFinder from '../path-finding/AStarPathFinder.mjs';
import { CELLS, DIRECTIONS, MAZE_MAX_SIZE } from '../constants.mjs';
import { movePosToDirection } from '../utils/positions.mjs';
import BaseStrategy from './BaseStrategy.mjs';

export default class HeuristicStrategy extends BaseStrategy {
    constructor(args) {
        super(args);

        this._aStarPathFinder = new AStarPathFinder({ maze: this._maze });
        this._breadFirstPathFinder = new BreadFirstPathFinder({ maze: this._maze });
    }

    run() {
        let heuristicStep = 0;
        let heuristicTargetPos = this._buildHeuristicTargetPosByStep(heuristicStep);
        let heuristicEnabled = true;

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

                this._maze.debugMeta();

                if (result) {
                    return result;
                }
            }

            // Increment step if near edge
            if (heuristicEnabled && this._checkIfEndOfStepReached(heuristicStep)) {
                heuristicStep++;
                heuristicTargetPos = this._buildHeuristicTargetPosByStep(heuristicStep);

                if (!heuristicTargetPos) {
                    heuristicEnabled = true;
                }
            }

            let pathToPoint;
            const playerPos = this._maze.getPlayerPos();

            if (this._maze.isGoalFound()) {
                pathToPoint = this._aStarPathFinder.findShortestPath(playerPos, this._maze.getGoalPos(), {
                    exitOnFrontier : true
                });
            } else if (heuristicEnabled) {
                pathToPoint = this._aStarPathFinder.findShortestPath(playerPos, heuristicTargetPos, {
                    exitOnFrontier : true
                    // euclideanDistance : true
                });
            } else {
                // pathToPoint = this._breadFirstPathFinder.findPathToBestExplorePoint(playerPos, {
                //     exitOnFrontier : true
                // });

                pathToPoint = this._breadFirstPathFinder.findPathToBestExplorePoint(playerPos, {
                    exitOnMinKnowledge : true,
                    minKnowledge       : 6
                });

                if (!pathToPoint) {
                    pathToPoint = this._breadFirstPathFinder.findPathToBestExplorePoint(playerPos, {
                        exitOnMinKnowledge : true,
                        minKnowledge       : 1
                    });
                }
            }

            if (!pathToPoint) {
                throw new Error('Something went wrong');
            }

            this._player.move(pathToPoint);
            this._maze.movePlayer(pathToPoint);
        }
    }

    _buildHeuristicTargetPosByStep(step) {
        let directions;

        switch (step) {
            case 0:
                directions = [ DIRECTIONS.UP, DIRECTIONS.RIGHT ];
                break;
            case 1:
                directions = [ DIRECTIONS.DOWN, DIRECTIONS.RIGHT ];
                break;
            case 2:
                directions = [ DIRECTIONS.DOWN, DIRECTIONS.LEFT ];
                break;
            // case 3:
            //     directions = [ DIRECTIONS.UP ];
            //     break;
            default:
                return null;
        }

        return this._buildHeuristicTargetPos(directions);
    }

    _checkIfEndOfStepReached(step) {
        switch (step) {
            case 0:
                return (
                    this._checkIfPlayerSeeEdgeInDirection(DIRECTIONS.UP) &&
                    this._checkIfPlayerSeeEdgeInDirection(DIRECTIONS.RIGHT)
                );
            case 1:
                return (
                    this._checkIfPlayerSeeEdgeInDirection(DIRECTIONS.DOWN) &&
                    this._checkIfPlayerSeeEdgeInDirection(DIRECTIONS.RIGHT)
                );
            case 2:
                return (
                    this._checkIfPlayerSeeEdgeInDirection(DIRECTIONS.DOWN) &&
                    this._checkIfPlayerSeeEdgeInDirection(DIRECTIONS.LEFT)
                );
            // case 3:
            //     return (
            //         this._checkIfPlayerSeeEdgeInDirection(DIRECTIONS.UP)
            //     );
            default:
                throw new Error('Invalid step');
        }
    }

    _checkIfPlayerSeeEdgeInDirection(direction) {
        let pos = this._maze.getPlayerPos();

        while (true) {
            const posValue = this._maze.get(pos);

            if (posValue === CELLS.EDGE) return true;
            if (posValue === CELLS.UNKNOWN) return false;

            pos = movePosToDirection(pos, direction);
        }
    }

    _buildHeuristicTargetPos(directions) {
        let pos = this._maze.getPlayerPos();

        for (let i = 0; i < MAZE_MAX_SIZE; i++) {
            for (const direction of directions) {
                pos = movePosToDirection(pos, direction);
            }
        }

        return pos;
    }
}
