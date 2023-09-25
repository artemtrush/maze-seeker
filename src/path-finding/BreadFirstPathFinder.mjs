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


    findPathToBestExplorePoint(sourcePos, passedOptions = {}) {
        const options = {
            exit            : 'frontier',
            minKnowledge    : 1,
            directionsOrder : [ DIRECTIONS.DOWN, DIRECTIONS.RIGHT, DIRECTIONS.UP, DIRECTIONS.LEFT ],
            ...passedOptions
        };

        const queue = [];
        const visitedNodes = new Map();
        const startNode = this._buildQueueNode({ nodePos: sourcePos });

        queue.push(startNode);
        visitedNodes.set(startNode.id, true);

        let bestNode;

        while (queue.length) {
            const node = queue.shift();

            if (options.exit === 'knowledge') {
                const knowledge = this._maze.estimatePosPotentialKnowldedge(node.pos);

                if (knowledge >= options.minKnowledge) {
                    bestNode = node;
                    break;
                }
            }

            if (options.exit === 'frontier') {
                if (this._maze.isFrontier(node.pos)) {
                    bestNode = node;
                    break;
                }
            }

            const neighbors = this._maze.getValidNeighborsForPos(node.pos, options.directionsOrder);

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
