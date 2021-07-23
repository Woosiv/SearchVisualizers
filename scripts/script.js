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
  
  // Resets the grid as well as updating grid dimensions
  function submitValues() { 
    let container = document.getElementById('container');
    // console.log(container);
    // Removes all previous children of the grid
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    dim = parseInt(document.getElementById('dim').value);
    container.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${dim}, 1fr)`;
  
    for (let x = 0; x < dim; x++) {
      for (let y = 0; y < dim; y++) {
        let child = document.createElement('div');
        child.className = 'item';
        child.id = `${x},${y}`;
        child.onclick = function() {
          childOnClick(x, y);
        };
        container.append(child);  
      }
    }
    // Resets start and end values
    start = null;
    end = null;

    // Initalize grid for pathfind
    grid = new Array(dim);
    for (let x = 0; x < dim; x++) {
      grid[x] = new Array(dim);
      for (let y = 0; y < dim; y++) {
        grid[x][y] = 0;
      }
    }
    // console.table(grid);
  }
  
  // Function added to children within the grid
  function childOnClick(x, y) {
    let val = document.getElementById(`${x},${y}`);
    if (start === null) {
      start = [x, y];
      val.classList.toggle('start');
    }
    else if(end === null) {
      // If the clicked point is the same as the start, ignore it
      console.log(start[0], start[1])
      if (!(x == start[0] && y == start[1])) {
        end = [x, y];
        val.classList.toggle('end');
      }
    }
    else if (val.classList.contains('active'))  {
      val.classList.remove('active');
    }
    else { 
      val.classList.toggle('active');
    }
  }
  
  function pathFind() {
    if (!start && !end) {
      console.log('failed')
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
          // console.log('found ending')
          let path = curr[1].map((x) => x);
          path.push(curr[0]);
          activatePath(path);
          return;
        }
        // Else add into queue
        else {
          let eleString = `${ele[0]},${ele[1]}`;
          if (!visited.includes(eleString)) {
            visited.push(eleString);

            let path = curr[1].map((x) => x);
            path.push(curr[0]);
            // console.table(path);
            queue.push([ele, path]);
          }
        }
      }
    }
  }
  
  // Activate CSS to visualize path 
  function activatePath(path) {
    // console.log('Path')
    // console.table(path);
    path.forEach((element) => {
      if (element[0] === start[0] && element[1] === start[1]){
        
      }
      else {
        let tile = document.getElementById(`${element[0]},${element[1]}`)
        tile.classList.toggle('path');
      }
    })
  }

  // Helper function to find nearby grid coordinates
  function nearbyCoords(coords) {
    let result = [];

    // Up
    if (coords[0]-1 >= 0) {
      result.push([coords[0]-1, coords[1]]);
    }
    // Right
    if (coords[1]+1 < grid[0].length) {
      result.push([coords[0], coords[1]+1]);
    }
    // Down
    if (coords[0]+1 < grid.length) {
      result.push([coords[0]+1, coords[1]]);
    }
    // Left
    if (coords[1]-1 >= 0) {
      result.push([coords[0], coords[1]-1]);
    }

    return result;
  }

  let start = null;
  let end = null;
  let grid = [];
  let dim;
  submitValues();