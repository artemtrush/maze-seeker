export const DIRECTIONS = {
    LEFT  : 'LEFT',
    RIGHT : 'RIGHT',
    UP    : 'UP',
    DOWN  : 'DOWN'
};

export const CELLS = {
    EDGE    : '@',
    WALL    : 'W',
    EMPTY   : ' ',
    PLAYER  : 'P',
    GOAL    : 'G',
    UNKNOWN : '.'
};

export const MAZE_MAX_SIZE = process.env.DEBUG ? 25 : 1000;
export const VIEW_SCOPE_SIZE = 5;
export const VIEW_SCOPE_MARGIN = 2;
