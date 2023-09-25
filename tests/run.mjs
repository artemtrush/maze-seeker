/* eslint-disable no-unused-vars */
import seek from '../src/main.mjs';
// import seek from '../dist/seeker.mjs';

import Player from './Player.mjs';
import ExampleMap from './maps/ExampleMap.mjs';
import MapGenerator from './maps/MapGenerator.mjs';

const TEST_WIDTH = 100;
const TEST_HEIGHT = 100;
const TEST_ITERATIONS = process.env.DEBUG ? 0 : 30;

function testMap(map, startX, startY) {
    const player = new Player(map, startY, startX);
    const meta = {};

    seek(player, meta);

    return meta;
}

// Example
const exampleResult = testMap(ExampleMap, 1, 8);

console.log('EXAMPLE RESULT', exampleResult);

// Generated tests
const mapGenerator = new MapGenerator({ width: TEST_WIDTH, height: TEST_HEIGHT });
const results = [];

for (let i = 0; i < TEST_ITERATIONS; i++) {
    const { map, playerPos } = mapGenerator.generate();

    const result = testMap(map, playerPos.x, playerPos.y);

    results.push(result);
}

if (TEST_ITERATIONS) {
    const sum = results.reduce((acc, item) => acc + item.actionsCount, 0);
    const avg = sum / results.length;

    console.log('RANDOM RESULT', { actionsCount: avg });
}
