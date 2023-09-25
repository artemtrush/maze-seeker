/* eslint-disable no-param-reassign */
import Maze from './components/Maze.mjs';
import PlayerAdapter from './components/PlayerAdapter.mjs';
import Strategy from './strategies/KnowledgeStrategy.mjs';

export default function seek(sourcePlayer, meta = {}) {
    const player = new PlayerAdapter(sourcePlayer);
    const maze = new Maze();

    const strategy = new Strategy({ maze, player });

    const path = strategy.run();

    meta.actionsCount = player.getActionsCount();
    meta.pathLength = path.length;

    if (process.env.DEBUG) {
        maze.debugMeta();
    }

    return [];
}
