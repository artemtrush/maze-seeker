import { DIRECTIONS } from '../constants.mjs';
import { getDirectionByPosDiff, hashPos } from '../utils/positions.mjs';
import BasePathFinder from './BasePathFinder.mjs';

export default class DepthFirstPathFinder extends BasePathFinder {
    findPathToBestExplorePoint(sourcePos) {
        const queue = [];
        const visitedNodes = new Map();
        const startNode = this._buildQueueNode({ nodePos: sourcePos });

        queue.push(startNode);
        visitedNodes.set(startNode.id, true);

        let bestNode;

        while (queue.length) {
            const node = queue.pop();
            const knowledge = this._maze.estimatePosPotentialKnowldedge(node.pos);

            if (knowledge > 0) {
                bestNode = node;
                break;
            }

            const neighbors = this._maze.getValidNeighborsForPos(node.pos, [
                DIRECTIONS.LEFT,
                DIRECTIONS.DOWN,
                DIRECTIONS.RIGHT,
                DIRECTIONS.UP
            ]);

            // neighbors.reverse();

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
            return this._retracePathFromFinalNode(bestNode);
        }

        return null;
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

