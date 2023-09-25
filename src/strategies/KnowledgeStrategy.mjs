import { DIRECTIONS } from '../constants.mjs';
import BreadFirstPathFinder from '../path-finding/BreadFirstPathFinder.mjs';
import DepthFirstPathFinder from '../path-finding/DepthFirstPathFinder..mjs';
import BaseStrategy from './BaseStrategy.mjs';

export default class MainStrategy extends BaseStrategy {
    constructor(args) {
        super(args);

        this._depthFirstPathFinder = new DepthFirstPathFinder({ maze: this._maze });
        this._breadFirstPathFinder = new BreadFirstPathFinder({ maze: this._maze });
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
        const { DOWN, RIGHT, UP, LEFT } = DIRECTIONS;

        const directionsOrder = [ DOWN, RIGHT, UP, LEFT ];

        const playerPos = this._maze.getPlayerPos();

        const firstTry = this._breadFirstPathFinder.findPathToBestExplorePoint(playerPos, {
            exit         : 'knowledge',
            minKnowledge : 10,
            directionsOrder
        });

        if (firstTry) {
            return firstTry;
        }

        const secondTry = this._breadFirstPathFinder.findPathToBestExplorePoint(playerPos, {
            exit         : 'knowledge',
            minKnowledge : 1,
            directionsOrder
        });

        if (secondTry) {
            return secondTry;
        }

        throw new Error('Something went wrong with path-finding!');
    }
}
