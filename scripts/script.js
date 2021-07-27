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

// class PriorityQueue {
//   constructor() {
//     this.heap = []
//   }
// }

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
      child.className = 'item';
      child.id = `${x},${y}`;
      child.onclick = function() {
        childOnClick(x, y);
      };
      container.append(child);

      /* Keep a local version of the grid square
        stored in the grid. */
      grid[x][y] = [1, child];
    }
  }

  // Resets start and end values
  start = null;
  end = null;

  // console.table(grid);
}

// Function added to children within the grid
function childOnClick(x, y) {
  let val = grid[x][y][1];
  if (start === null) {
    start = [x, y];
    startItem = val;
    val.classList.toggle('start');
  }
  else if(end === null) {
    // If the clicked point is the same as the start, ignore it
    console.log(start[0], start[1])
    if (!(x == start[0] && y == start[1])) {
      end = [x, y];
      endItem = val;
      val.classList.toggle('end');
    }
  }
  else if (val.classList.contains('active'))  {
    grid[x][y] = 1;
    val.classList.remove('active');
  }
  else {
    grid[x][y] = 0; 
    val.classList.toggle('active');
  }
}

function pathFind() {
  if (!start && !end) {
    console.error('The current grid does not have a start or end and cannot path find.')
    return;
  }
  let queue = new Queue();
  let visited = [`${start[0]},${start[1]}`];
  // Push into queue with format [coordinate, parents]
  queue.push([start, []]);
  while(!queue.isEmpty()) {
    // queue.toString();
    let curr = queue.dequeue();
    let nearby = nearbyCoords(curr[0]);
    for (let x = 0; x < nearby.length; x++) {
      // First check if element is the end
      let ele = nearby[x];
      if (ele[0] === end[0] && ele[1] === end[1]) {
        // Make a copy of the path
        let path = curr[1].map((x) => x);
        path.push(curr[0]);
        activatePath(path);
        visualizeExplored(visited);
        return;
      }
      // Else add into queue
      else {
        let eleString = `${ele[0]},${ele[1]}`;
        if (!visited.includes(eleString)) {
          visited.push(eleString);
          let path = curr[1].map((x) => x);
          path.push(curr[0]);
          queue.push([ele, path]);
        }
      }
    }
  }
}

// TODO Implement A* search
function starSearch() {
  if (!start && !end) {
    console.log('failed')
    return;
  }
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
function activatePath(path) {
  
  let [startRGB, endRGB] = getRGBValues();
  let [gradR, gradG, gradB] = generateGradient(path.length, startRGB, endRGB);
  
  // console.log(rtran, gtran, btran); 

  path.forEach((element, index) => {
    if (element[0] === start[0] && element[1] === start[1]){
      
    }
    else {
      let tile = grid[element[0]][element[1]][1];
      tile.classList.toggle('path');
      // console.log(`rgb(${startRGB[0] + rtran*index}, ${startRGB[1] + gtran*index}, ${startRGB[2] + btran*index})`)
      tile.style.backgroundColor = `rgb(${startRGB[0] + gradR*index}, ${startRGB[1] + gradG*index}, ${startRGB[2] + gradB*index})`
      index++;
    }
  })
}

// Function that visualizes the explored grids
function visualizeExplored(explored) {
  explored.forEach((element, index) => {
    element = element.split(',');
    element.forEach((ele, index) => element[index] = parseInt(ele));
    let tile = grid[element[0]][element[1]][1];
    if (!tile.classList.contains('path') && !tile.classList.contains('start') && !tile.classList.contains('end')) {
      tile.classList.toggle('explored');
      let x = Math.abs(element[0] - start[0]);
      let y = Math.abs(element[1] - start[1]);
      
      tile.style.animationDelay = `${(x+y)*250}ms`
      console.log(`${(x+y)*250}ms`)
    }
  })
}

// Helper function to find nearby grid coordinates
function nearbyCoords(coords) {
  let result = [];
  // Up
  if (coords[0]-1 >= 0) {
    if (grid[coords[0]-1][coords[1]]) {
      result.push([coords[0]-1, coords[1]]);
    }
  }
  // Right
  if (coords[1]+1 < grid[0].length) {
    if (grid[coords[0]][coords[1]+1]) {
      result.push([coords[0], coords[1]+1]);
    }
  }
  // Down
  if (coords[0]+1 < grid.length) {
    if (grid[coords[0]+1][coords[1]]) {
      result.push([coords[0]+1, coords[1]]);
    }
  }
  // Left
  if (coords[1]-1 >= 0) {
    if (grid[coords[0]][coords[1]-1]) {
      result.push([coords[0], coords[1]-1]);
    }
  }
  return result;
}

let start = null;
let startItem;
let end = null;
let endItem;
let grid = [];
let dim;
submitValues();