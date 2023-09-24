import { DIRECTIONS } from '../constants.mjs';
import ViewScope from './ViewScope.mjs';

export default class PlayerAdapter {
    constructor(sourcePlayer) {
        this._player = sourcePlayer;
        this._internalActionsCount = 0;
    }

    move(path) {
        for (const direction of path) {
            switch (direction) {
                case DIRECTIONS.UP:
                    this.up();
                    break;
                case DIRECTIONS.DOWN:
                    this.down();
                    break;
                case DIRECTIONS.LEFT:
                    this.left();
                    break;
                case DIRECTIONS.RIGHT:
                    this.right();
                    break;
                default:
                    throw new Error(`Unknown direction [${direction}]`);
            }
        }
    }

    up() {
        this._internalActionsCount++;
        this._player.up();
    }

    down() {
        this._internalActionsCount++;
        this._player.down();
    }

    left() {
        this._internalActionsCount++;
        this._player.left();
    }

    right() {
        this._internalActionsCount++;
        this._player.right();
    }

    lookAround() {
        this._internalActionsCount++;

        const info = this._player.lookAround();

        return new ViewScope(info);
    }

    getActionsCount() {
        return this._internalActionsCount;
    }

    debug() {
        console.log('PLAYER ACTIONS COUNT:', { count: this._internalActionsCount });
    }
}
