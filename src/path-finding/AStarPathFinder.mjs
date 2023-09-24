import MinHeap from '../utils/MinHeap.mjs';
import { calculateManhattanDistance, getDirectionByPosDiff, hashPos, isEqualPos } from '../utils/positions.mjs';
import BasePathFinder from './BasePathFinder.mjs';

export default class AStarPathFinder extends BasePathFinder {
    findShortestPath(sourcePos, targetPos) {
        const startNode = this._buildHeapNode({ nodePos: sourcePos, targetPos });
        let finalNode;

        const heap = new MinHeap([ startNode ]);
        const visitedNodes = new Map();

        visitedNodes.set(startNode.id, startNode);

        while (!heap.isEmpty()) {
            const node = heap.remove();

            if (isEqualPos(node.pos, targetPos)) {
                finalNode = node;
                break;
            }

            const neighbors = this._maze.getValidNeighborsForPos(node.pos);

            for (const neighborPos of neighbors) {
                const neighborNode = this._buildHeapNode({ nodePos: neighborPos, targetPos, prevNode: node });

                // In case when node was already handled previously
                if (visitedNodes.has(neighborNode.id)) {
                    const existingNode = visitedNodes.get(neighborNode.id);

                    // Ignore if existing distance is smaller
                    if (existingNode.distFromStart <= neighborNode.distFromStart) {
                        continue;
                    }

                    // Update existing node values in place
                    existingNode.distFromStart = neighborNode.distFromStart;
                    existingNode.prevNode = neighborNode.prevNode;
                    existingNode.value = neighborNode.value;
                } else {
                    visitedNodes.set(neighborNode.id, neighborNode);
                }

                if (heap.has(neighborNode.id)) {
                    heap.recalculate(neighborNode.id);
                } else {
                    heap.insert(neighborNode);
                }
            }
        }

        if (finalNode) {
            return this._retracePathFromFinalNode(finalNode);
        }

        return null;
    }

    _buildHeapNode({ nodePos, targetPos, prevNode = null }) {
        const distFromStart = prevNode ? prevNode.distFromStart + 1 : 0;
        const distFromEnd = calculateManhattanDistance(nodePos, targetPos);
        const totalScore = distFromStart + distFromEnd;

        const node = {
            id    : hashPos(nodePos),
            distFromStart,
            distFromEnd,
            prevNode,
            pos   : nodePos,
            value : totalScore
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

