import { DIRECTIONS } from '../constants.mjs';
import { getDirectionByPosDiff, hashPos, isEqualPos } from '../utils/positions.mjs';
import BasePathFinder from './BasePathFinder.mjs';

export default class BreadFirstPathFinder extends BasePathFinder {
    findShortestPath(sourcePos, targetPos) {
        const queue = [];
        const visitedNodes = new Map();
        const startNode = this._buildQueueNode({ nodePos: sourcePos });

        queue.push(startNode);
        visitedNodes.set(startNode.id, true);

        let finalNode;

        while (queue.length) {
            const node = queue.shift();

            if (isEqualPos(node.pos, targetPos)) {
                finalNode = node;
                break;
            }

            const neighbors = this._maze.getValidNeighborsForPos(node.pos);

            for (const neighborPos of neighbors) {
                const neighborNodeId = hashPos(neighborPos);

                if (visitedNodes.has(neighborNodeId)) {
                    continue;
                }

                const neighborNode = this._buildQueueNode({ nodePos: neighborPos, prevNode: node });

                queue.push(neighborNode);
                visitedNodes.set(neighborNodeId, true);
            }
        }

        if (finalNode) {
            return this._retracePathFromFinalNode(finalNode);
        }

        return null;
    }


    findPathToBestExplorePoint(sourcePos, minKnowledge) {
        const queue = [];
        const visitedNodes = new Map();
        const startNode = this._buildQueueNode({ nodePos: sourcePos });

        queue.push(startNode);
        visitedNodes.set(startNode.id, true);

        let bestNode;

        while (queue.length) {
            const node = queue.shift();
            const knowledge = this._maze.estimatePosPotentialKnowldedge(node.pos);

            if (knowledge >= minKnowledge) {
                // node.knowledge = knowledge;

                bestNode = node;
                break;

                // if (this._isBetterExplorePoint(node, bestNode)) {
                //     bestNode = node;
                // }

                // if (bestNode.distFromStart >= 2) {
                //     break;
                // }
            }

            // const neighbors = this._maze.getValidNeighborsForPos(node.pos, [
            //     DIRECTIONS.DOWN,
            //     DIRECTIONS.RIGHT,
            //     DIRECTIONS.UP,
            //     DIRECTIONS.LEFT
            // ]);

            const order = [ DIRECTIONS.DOWN, DIRECTIONS.RIGHT, DIRECTIONS.UP, DIRECTIONS.LEFT ];

            // if (this._lastUsedDirection === DIRECTIONS.LEFT) {
            //     order = [ DIRECTIONS.LEFT, DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN ];
            // } else if (this._lastUsedDirection === DIRECTIONS.UP) {
            //     order = [ DIRECTIONS.UP, DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT ];
            // } else if (this._lastUsedDirection === DIRECTIONS.RIGHT) {
            //     order = [ DIRECTIONS.RIGHT, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.UP ];
            // }

            const neighbors = this._maze.getValidNeighborsForPos(node.pos, order);

            for (const neighborPos of neighbors) {
                const neighborNodeId = hashPos(neighborPos);

                if (visitedNodes.has(neighborNodeId)) {
                    continue;
                }

                const neighborNode = this._buildQueueNode({ nodePos: neighborPos, prevNode: node });

                queue.push(neighborNode);
                visitedNodes.set(neighborNodeId, true);
            }
        }

        if (bestNode) {
            const path = this._retracePathFromFinalNode(bestNode);

            this._lastUsedDirection = path[0];

            return path;
        }


        return null;
    }

    _isBetterExplorePoint(node, bestNode) {
        if (!bestNode) {
            return true;
        }

        if (node.knowledge >= bestNode.knowledge * 1.5) {
            return true;
        }

        // if (node.distFromStart === bestNode.distFromStart) {


        //     return false;
        // }

        // if (node.distFromStart < bestNode.distFromStart) {
        //     if (node.knowledge >= bestNode.knowledge) {
        //         return true;
        //     }

        //     return false;
        // }

        // if (node.distFromStart > bestNode.distFromStart) {
        //     if (node.knowledge > bestNode.knowledge + ) {
        //         return true;
        //     }

        //     return false;
        // }

        return false;
    }

    _buildQueueNode({ nodePos, prevNode = null }) {
        const distFromStart = prevNode ? prevNode.distFromStart + 1 : 0;

        const node = {
            distFromStart,
            prevNode,
            pos : nodePos
        };

        return node;
    }

    _retracePathFromFinalNode(finalNode) {
        const path = [];

        let node = finalNode;

        while (node.prevNode) {
            const direction = getDirectionByPosDiff(node.prevNode.pos, node.pos);

            path.push(direction);

            node = node.prevNode;
        }

        return path.reverse();
    }
}

