// A queue data structure for BFS
class queue {
    constructor() {
      this.queue = {};
      this.head = 0;
      this.tail = 0;
    }
    
    push(item) {
      this.queue[this.tail++] = item;
    }
    
    dequeue() {
      if (this.head === this.tail) {
        return null;
      }
      let res = this.queue[head];
      delete this.queue[head++];
      return res;
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
    
    let dim = document.getElementById('dim').value;
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
  }
  
  // Function added to children within the grid
  function childOnClick(x, y) {
    let val = document.getElementById(`${x},${y}`);
    if (start === null) {
      start = `${x},${y}`;
      val.classList.toggle('start');
    }
    else if(end === null && `${x},${y}` !== start) {
      end = `${x},${y}`;
      val.classList.toggle('end');
    }
    else if (val.classList.contains('active'))  {
      val.classList.remove('active');
    }
    else { 
      val.classList.toggle('active');
    }
  }
  
  function pathFind() {
    
  }
  
  let start = null;
  let end = null;
  let grid;
  submitValues();