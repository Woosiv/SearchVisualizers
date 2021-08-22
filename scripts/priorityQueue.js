class PriorityQueue {

    // Elements will be stored in format of [element, value]
    constructor () {
        this.heap = [];
    }

    push(element) {
        this.heap.push(element);
        this.heapUp(this.heap.length-1);
    }

    heapUp(index) {
        let parentIndex = Math.floor((index-1)/2);
        // Check if they are in correct order
        if (this.heap[index]> this.heap[parentIndex]) {
            let temp = this.heap[parentIndex];
            this.heap[parentIndex] = this.heap[index];
            this.heap[index] = temp;
            this.heapUp(parentIndex);
        }
    }

    pop() {
        let min = this.heap[0];
        if(this.heap.length != 1) {
            this.heap[0] = this.heap.pop();
            this.heapDown(0);
        }
        else {
            this.heap.pop();
        }
        return min;
    }

    heapDown(index) {
        let length = this.heap.length;
        let left = 2*index+1;
        let right = 2*index+2;
        let smallerIndex = null;
        // Take the smallest child
        if (left < length) {
            smallerIndex = left;
        }
        if (right < length && this.heap[right][1] < this.heap[smallerIndex][1]) {
            smallerIndex = right;
        }
        
        // check if the smallest child is smaller than the parent
        if (this.heap[smallerIndex] < this.heap[index]) {
            let temp = this.heap[smallerIndex];
            this.heap[smallerIndex] = this.heap[index];
            this.heap[index] = temp;
            this.heapDown(smallerIndex);
        }
    }

    delete(index) {
        let deleted = this.heap[index][1];
        this.heap[index] = this.heap.pop();
        if (this.heap[index][1] < deleted) {
            this.heapUp(index);
        }
        else if (this.heap[index][1] > deleted) {
            this.heapDown(index);
        }
    }
}

let pq = new PriorityQueue();
pq.heap = [11, 5, 8, 3, 4];
pq.push(15);
console.log(pq.heap);
pq.heap = [1];
console.log(pq.pop())
console.log(pq.heap)