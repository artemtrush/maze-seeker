/* eslint-disable more/no-duplicated-chains */

// Node structure:
// { id, value }

export default class MinHeap {
    constructor(nodesList) {
        this.buildHeap(nodesList);
    }

    // O (n)
    buildHeap(nodesList) {
        this._heap = nodesList;
        this._nodesIndexesById = {};

        this._heap.forEach((node, index) => this._nodesIndexesById[node.id] = index);

        const startIdx = this._getParentIdx(this._heap.length - 1);

        for (let i = startIdx; i >= 0; i--) {
            this._siftDown(i);
        }
    }

    // O (1)
    isEmpty() {
        return this._heap.length === 0;
    }

    // O (1)
    peek() {
        if (!this._heap.length) return undefined;

        return this._heap[0];
    }

    // O (log n)
    remove() {
        if (!this._heap.length) return undefined;

        this._swap(0, this._heap.length - 1);

        const nodeWithMinValue = this._heap.pop();

        delete this._nodesIndexesById[nodeWithMinValue.id];

        if (this._heap.length) {
            this._siftDown(0);
        }

        return nodeWithMinValue;
    }

    // O (log n)
    insert(node) {
        this._heap.push(node);

        this._nodesIndexesById[node.id] = this._heap.length - 1;

        this._siftUp(this._heap.length - 1);
    }

    // O (log n)
    recalculate(nodeId) {
        // Try to sift in both directions because of unknown value change
        this._siftDown(this._nodesIndexesById[nodeId]);
        this._siftUp(this._nodesIndexesById[nodeId]);
    }

    // O (1)
    has(nodeId) {
        return nodeId in this._nodesIndexesById;
    }

    _getNodeValue(idx) {
        return this._heap[idx].value;
    }

    _siftDown(idx) {
        const firstChildIdx = this._getFirstChildIdx(idx);
        const secondChildIdx = this._getSecondChildIdx(idx);

        let smallerIdx = firstChildIdx;

        if (
            secondChildIdx !== -1 &&
            (firstChildIdx === -1 || this._getNodeValue(secondChildIdx) < this._getNodeValue(firstChildIdx))
        ) {
            smallerIdx = secondChildIdx;
        }

        if (smallerIdx !== -1 && this._getNodeValue(idx) > this._getNodeValue(smallerIdx)) {
            this._swap(idx, smallerIdx);
            this._siftDown(smallerIdx);
        }
    }

    _siftUp(idx) {
        const parentIdx = this._getParentIdx(idx);

        if (parentIdx === -1) {
            return;
        }

        if (this._getNodeValue(idx) < this._getNodeValue(parentIdx)) {
            this._swap(idx, parentIdx);
            this._siftUp(parentIdx);
        }
    }

    _getParentIdx(idx) {
        const parentIdx = Math.floor((idx - 1) / 2);

        if (parentIdx < 0) {
            return -1;
        }

        return parentIdx;
    }

    _getFirstChildIdx(idx) {
        const childIdx = idx * 2 + 1;

        if (childIdx >= this._heap.length) {
            return -1;
        }

        return childIdx;
    }

    _getSecondChildIdx(idx) {
        const childIdx = idx * 2 + 2;

        if (childIdx >= this._heap.length) {
            return -1;
        }

        return childIdx;
    }

    _swap(i, j) {
        // Swap indexes
        this._nodesIndexesById[this._heap[i].id] = j;
        this._nodesIndexesById[this._heap[j].id] = i;

        // Swap nodes
        const tmp = this._heap[i];

        this._heap[i] = this._heap[j];
        this._heap[j] = tmp;
    }
}

