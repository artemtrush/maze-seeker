export default function getPermutations(array) {
    const permutations = [];

    const combine = (queue, currentArray) => {
        if (queue.empty() && currentArray.length) {
            permutations.push([ ...currentArray ]);

            return;
        }

        let iterations = queue.size();

        while (iterations--) {
            currentArray.push(queue.dequeue());

            combine(queue, currentArray);

            queue.enqueue(currentArray.pop());
        }
    };

    const fifoQueue = new FifoQueue(array);

    combine(fifoQueue, []);

    return permutations;
}

class FifoQueue {
    constructor(source = []) {
        this._array = [];

        source.forEach(value => this.enqueue(value));
    }

    empty() {
        return this._array.length === 0;
    }

    size() {
        return this._array.length;
    }

    enqueue(value) {
        this._array.unshift(value);
    }

    dequeue() {
        return this._array.pop();
    }
}
