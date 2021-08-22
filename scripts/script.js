// import Queue from './script2.js';

let container = document.getElementById('container');
// A queue data structure for BFS
class Queue {
  constructor() {
    this.queue = {};
    this.head = 0;
    this.tail = 0;
  }
  push(item) {
    this.queue[this.tail++] = item;
  }
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    let res = this.queue[this.head];
    delete this.queue[this.head++];
    return res;
  }
  isEmpty() {
    return this.head === this.tail;
  }
  toString() {
    let temp = this.head;
    while(temp !== this.tail) {
      console.log(this.queue[temp++]);
    }
  }
}
// A heap-based priority queue for A* search
class PriorityQueue {

  // Elements will be stored in format of [element, value]
  constructor () {
      this.heap = [];
  }
  
  isEmpty() {
    return this.heap.length == 0;
  }

  push(element) {
      this.heap.push(element);
      if (this.heap.length == 1) {
        return;
      }
      this.heapUp(this.heap.length-1);
  }

  heapUp(index) {
      let parentIndex = Math.floor((index-1)/2);
      if (parentIndex < 0) {
        return;
      }
      console.log(parentIndex)
      console.log('Values of parent and child')
      console.log(this.heap[index][1])
      console.log(this.heap[parentIndex][1])
      // Check if they are in correct order
      if (this.heap[index][1] < this.heap[parentIndex][1]) {
          console.log('swapped')
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
      if (smallerIndex == null) {
        return;
      }
      // check if the smallest child is smaller than the parent
      if (this.heap[smallerIndex][1] < this.heap[index][1]) {
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

// Resets the grid as well as updating grid dimensions
function submitValues() { 
  // Removes all previous children of the grid
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  dim = parseInt(document.getElementById('dim').value);
  container.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${dim}, 1fr)`;

  // Initalize grid for pathfind as well as the html GUI
  grid = new Array(dim);
  for (let x = 0; x < dim; x++) {
    grid[x] = new Array(dim);

    for (let y = 0; y < dim; y++) {
      let child = document.createElement('div');
      child.className = 'item none';
      child.id = `${x},${y}`;
      child.onclick = function() {
        childOnClick(x, y);
      };
      container.append(child);
      child.style.setProperty('--grid-pos', x + y);
      /* Keep a local version of the grid square
        stored in the grid. */
      grid[x][y] = [1, child];
    }
  }

  // Resets state values
  start = null;
  end = null;
  exploredRecord = [];
  pathRecord = [];
}

// Function added to children within the grid
function childOnClick(x, y) {
  // console.log(grid[x][y]);
  let child = grid[x][y][1];
  // child.style.backgroundColor = '';
  // val.style.animationDelay = '0ms';
  let classes = child.classList;
  if (start === null) {
    start = [x, y];
    startItem = child;
    changeClass(child, 'start');
  }
  else if(end === null) {
    // If the clicked point is the same as the start, ignore it
    if (!(x == start[0] && y == start[1])) {
      end = [x, y];
      endItem = child;
      changeClass(child, 'end');
    }
  }
  else if (classes[1] === 'none')  {
    grid[x][y][0] = 0;
    changeClass(child, 'wall');
  }
  // Untoggle the current tile
  else {
    grid[x][y][0] = 1;
    switch (classes[1]) {
      case 'start':
        start = null;
        startItem = null;
        break;
      case 'end':
        end = null;
        endItem = null;
        break;
    } 
    child.style.setProperty('--grid-pos', 0);
    changeClass(child, 'none');
  }
}

function pathFind() {
  if (!start || !end) {
    console.error
    ('The current grid does not have a start or end and cannot path find.')
    return;
  }
  let queue = new Queue();
  let visited = [`${start[0]},${start[1]}`];
  // Push into queue with format [coordinate, parents]
  queue.push([start, []]);
  while(!queue.isEmpty()) {
    let [curr, parents] = queue.dequeue();
    let nearby = nearbyCoords(curr);
    for (let x = 0; x < nearby.length; x++) {
      let coords = nearby[x];
      
      // If element reached is the end
      if (coords[0] === end[0] && coords[1] === end[1]) {
        // Make a copy of the path
        let parentsCopy = parents.map((x) => x);
        parentsCopy.push(curr);
        activatePath(parentsCopy, `${parentsCopy.length*250}ms`);
        visualizeExplored(visited);
        // console.table(grid);
        return;
      }
      // Else add into queue
      else {
        let eleString = `${coords[0]},${coords[1]}`;
        if (!visited.includes(eleString)) {
          visited.push(eleString);
          let parentsCopy = parents.map((x) => x);
          parentsCopy.push(curr);
          
          queue.push([coords, parentsCopy]);
        }
      }
    }
  }
}

function heuristic(pos) {
  return Math.abs(pos[0] - end[0]) + Math.abs(pos[1] - end[1]);
}

/* Utilizes A* search to find a path
   from the start and end
*/
function starSearch() {
  if (!start || !end) {
    console.log('failed')
    return;
  }

  let pq = new PriorityQueue();
  pq.push([start, 0]);
  let cameFrom = grid.map(x=> x.map(y=> null));

  let gScore = grid.map(x=> x.map(y=> Infinity));
  gScore[start[0]][start[1]] = 0;

  let fScore = grid.map(x=> x.map(y=> Infinity));
  fScore[start[0]][start[1]] = heuristic(start);

  let visited = [`${start[0]},${start[1]}`];

  while(!pq.isEmpty()) {
    let [curr, value] = pq.pop();
    let nearby = nearbyCoords(curr);
    let tempScore = gScore[curr[0]][curr[1]] + 1;
    for (let x = 0; x < nearby.length; x++) {
      let coords = nearby[x];
      if (coords[0] === end[0] && coords[1] === end[1]) {
        // Make a copy of the path
        console.log('found ending?')
        let path = [curr];
        while(cameFrom[path[0][0]][path[0][1]]) {
          path.unshift(cameFrom[path[0][0]][path[0][1]]);
        }
        activatePath(path, `${path.length*250}ms`);
        visualizeExplored(visited);
        // console.table(grid);
        return;
      }
      
      if (tempScore < gScore[coords[0]][coords[1]]) {
        cameFrom[coords[0]][coords[1]] = curr;
        gScore[coords[0]][coords[1]] = tempScore;
        fScore[coords[0]][coords[1]] = gScore[coords[0]][coords[1]] + heuristic(coords);
        console.log(fScore[coords[0]][coords[1]])
        pq.push([coords, fScore[coords[0]][coords[1]]])
        console.table(pq.heap)
      }

      if (!visited.includes(`${coords[0]},${coords[1]}`)) {
        visited.push(`${coords[0]},${coords[1]}`)
      } 

      // console.table(gScore);
      // console.table(fScore)
    }
  }
  console.log('ended')


}

// Generate a gradient from start to end based on the length of the path
function generateGradient(len, startRGB, endRGB) {
  let rtran = (endRGB[0] - startRGB[0])/len;
  let gtran = (endRGB[1] - startRGB[1])/len;
  let btran = (endRGB[2] - startRGB[2])/len;
  return [rtran, gtran, btran, startRGB[0], startRGB[1], startRGB[2]];
}

/* Helper function that grabs the RGB values of the start and end tiles
  and converts them to array format
*/
function getRGBValues() {
  let startRGB = window.getComputedStyle(startItem).backgroundColor;
  startRGB = startRGB.slice(4, -1).split(', ');
  startRGB.forEach((element, index) => startRGB[index] = parseInt(element));
  let endRGB = window.getComputedStyle(endItem).backgroundColor;
  endRGB = endRGB.slice(4, -1).split(', ');
  endRGB.forEach((element, index) => endRGB[index] = parseInt(element));

  return [startRGB, endRGB];
}

// Activate CSS to visualize path 
function activatePath(path, delay) {

  // Removes previous path if needed
  if(pathRecord.length) {
    pathRecord.forEach((coords) => {
      let child = grid[coords[0]][coords[1]][1];
      if (child.classList[1] === 'path'){
        changeClass(child, 'none');
      }
    })
  }
  
  let [startRGB, endRGB] = getRGBValues();
  let [gradR, gradG, gradB] = generateGradient(path.length, startRGB, endRGB);

  path.forEach((element, index) => {
    if (element[0] === start[0] && element[1] === start[1]){
      
    }
    else {
      let child = grid[element[0]][element[1]][1];
      changeClass(child, 'path', '#ac945a')
      child.style.setProperty('--custom-color', 
      `rgb(${startRGB[0] + gradR*index},
           ${startRGB[1] + gradG*index},
           ${startRGB[2] + gradB*index})`)
      child.style.setProperty('--explore-delay', delay);
      child.style.setProperty('--index', index);
    }
  })
  pathRecord = path.map((x) => x);
}

// Function that visualizes the explored grids
function visualizeExplored(explored) {
  // Resets previous explored if needed
  if(exploredRecord.length) {
    console.log('Existing explored found, removing', exploredRecord.length)
    console.table(exploredRecord)
    exploredRecord.forEach((coords) => {
      coords = coords.split(',');
      coords.forEach((coord, index) => coords[index] = parseInt(coord));
      let child = grid[coords[0]][coords[1]][1];
      if (child.classList[1] === 'explored'){
        console.log('removing', coords)
        changeClass(child, 'none');
      }
    })
  }

  explored.forEach((coords, index) => {
    coords = coords.split(',');
    coords.forEach((coord, index) => coords[index] = parseInt(coord));
    let child = grid[coords[0]][coords[1]][1];
    let classes = child.classList;
    if (classes[1] === 'none') {
      let x = Math.abs(coords[0] - start[0]);
      let y = Math.abs(coords[1] - start[1]);
      
      child.style.setProperty('--explored-pos', `${(x+y)}`);
      changeClass(child, 'explored')
    }
  })
  exploredRecord = explored.map((x) => x);
  console.table(exploredRecord);
}

// Helper function to find nearby grid coordinates
function nearbyCoords(coords) {
  let result = [];
  // Up
  if (coords[0]-1 >= 0) {
    if (grid[coords[0]-1][coords[1]][0]) {
      result.push([coords[0]-1, coords[1]]);
    }
  }
  // Right
  if (coords[1]+1 < grid[0].length) {
    if (grid[coords[0]][coords[1]+1][0]) {
      result.push([coords[0], coords[1]+1]);
    }
  }
  // Down
  if (coords[0]+1 < grid.length) {
    if (grid[coords[0]+1][coords[1]][0]) {
      result.push([coords[0]+1, coords[1]]);
    }
  }
  // Left
  if (coords[1]-1 >= 0) {
    if (grid[coords[0]][coords[1]-1][0]) {
      result.push([coords[0], coords[1]-1]);
    }
  }
  return result;
}

/* Helper function that updates the class of a grid position
and resets the animation so that it plays properly */
function changeClass(child, className, color) {
  if (color) {
    child.style.setProperty('--previous-color', color);
  }
  else {
    child.style.setProperty('--previous-color', 
      window.getComputedStyle(child).backgroundColor);
  }
  child.classList.replace(child.classList[1], className);
  child.style.animation = 'none';
  if(child.classList[1] !== 'path') {
    child.style.setProperty('--custom-color', '')
  }
  setTimeout(function() {
    child.style.animation = '';
  }, 20);
}

let start = null;
let startItem;
let end = null;
let endItem;
let grid = [];
let dim;
let pathRecord = [];
let exploredRecord = [];
submitValues();
