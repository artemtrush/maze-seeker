import nmg from 'node-maze-generator';

export default class MapGenerator {
    constructor({ width, height }) {
        this._width = width;
        this._height = height;
    }

    generate() {
        const gridWidth = this._width;
        const gridHeight = this._height;

        const generator = new nmg.generators.maze({}, { width: gridWidth, height: gridHeight });
        const field = [];

        for (let y = 0; y < gridHeight; y++) {
            const row = [];

            for (let x = 0; x < gridWidth; x++) {
                const cell = generator.data.grid.cells[0][y][x];
                const symbol = cell.blocked ? 'W' : 'E';

                row.push(symbol);
            }

            field.push(row);
        }

        let playerPos;

        // Set player to top left corner
        for (let y = 0, abort = false; y < gridHeight && !abort; y++) {
            for (let x = 0; x < gridWidth && !abort; x++) {
                if (field[y][x] === 'E') {
                    playerPos = { x, y };
                    abort = true;
                }
            }
        }

        // Set goal to bottom right corner
        for (let y = gridHeight - 1, abort = false; y >= 0 && !abort; y--) {
            for (let x = gridWidth - 1; x >= 0 && !abort; x--) {
                if (field[y][x] === 'E') {
                    field[y][x] = 'G';
                    abort = true;
                }
            }
        }

        return { map: field, playerPos };
    }
}
