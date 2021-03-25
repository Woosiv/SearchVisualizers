import numpy as np
import timeit
import time
from collections import deque
grid = np.array([1,1])
start = [1,1]
end = [9,9]

# Initializes the initial grid for the search methods, based off if its 
# a cost based search or basic search
def init_grid(cost = True):
    x = input("Enter the width of the grid (Must be greater than 0): ")
    while not x.isdigit() or x == '0':
        x = input("Enter the width of the grid (Must be greater than 0): ")
    x = int(x)
    
    y = input("Enter the height of the grid (Must be greater than 0): ")
    while not y.isdigit() or y == '0':
        y = input("Enter the height of the grid (Must be greater than 0): ")
    y = int(y)
    if cost:
        low = input("Enter the lower bound cost of the grid: ")
        while not low.isdigit():
            low = input("Enter the lower bound cost of the grid: ")
        low = int(low)
        
        # Makes sure the upper bound is greater than the lower bound
        high = input(f"Enter the upper bound cost of the grid (Must be greater than {low}): ")
        while not high.isdigit() or (high.isdigit() and int(high) <= low):
            high = input(f"Enter the upper bound cost of the grid: (Must be greater than {low}): ")
        high = int(high)
    

    global grid
    if cost:
        grid = np.random.randint(low, high, (x,y))
    else:
        grid = np.zeros((x,y))
    
# Finds surrounding indices with the given position
def surroundIndices(pos, bounds, visited=None, omni=True) -> list:
    # If the search decides to not remembered visited nodes
    if visited == None:
        visited = set()
    
    res = []
    # Top left
    #print(pos)
    if omni and pos[0] != 0 and pos[1] != 0 and (pos[0]-1, pos[1]-1) not in visited:
        res.append([pos[0]-1, pos[1]-1])
        #visited.add((pos[0]-1, pos[1]-1))
    # Top
    if pos[0] != 0 and (pos[0]-1, pos[1]) not in visited:
        res.append([pos[0]-1, pos[1]])
        #visited.add((pos[0]-1, pos[1]))
    # Top Right
    if omni and pos[0] != 0 and pos[1] != bounds[1]-1 and (pos[0]-1, pos[1]+1) not in visited:
        res.append([pos[0]-1, pos[1]+1])
        #visited.add((pos[0]-1, pos[1]+1))
    # Right
    if pos[1] != bounds[1]-1 and (pos[0], pos[1]+1) not in visited:
        res.append([pos[0], pos[1]+1])
        #visited.add((pos[0], pos[1]+1))
    # Bottom Right
    if omni and pos[0] != bounds[0]-1 and pos[1] != bounds[1]-1 and (pos[0]+1, pos[1]+1) not in visited:
        res.append([pos[0]+1, pos[1]+1])
        #visited.add((pos[0]+1, pos[1]+1))
    # Bottom
    if pos[0] != bounds[0]-1 and (pos[0]+1, pos[1]) not in visited:
        res.append([pos[0]+1, pos[1]])
        #visited.add((pos[0]+1, pos[1]))
    # Bottom Left
    if omni and pos[0] != bounds[0]-1 and pos[1] != 0 and (pos[0]+1, pos[1]-1) not in visited:
        res.append([pos[0]+1, pos[1]-1])
        #visited.add((pos[0]+1, pos[1]-1))
    # Left
    if pos[1] != 0 and (pos[0], pos[1]-1) not in visited:
        res.append([pos[0], pos[1]-1])
        #visited.add((pos[0], pos[1]-1))
    
    return res

# Returns the path found via breadth first search    
def breadthFirst() -> list:
    #global grid
    # position, parent
    queue = deque([(start, None)])
    visited = set()
    while queue:
        curr = queue.popleft()
        pos = curr[0]
        if (pos[0], pos[1]) not in visited:
            if pos == end:
                # Build the path
                path = []
                while curr[1]:
                    #print(path)
                    path = [curr[0]] + path
                    curr = curr[1]
                path = [start] + path
                # visitedArray = np.array([list(x) for x in visited])
                # visitedGrid = np.zeros_like(grid)
                # visitedGrid[visitedArray[:,0], visitedArray[:,1]] = 1
                #print(visitedGrid)
                #print(len(visited))
                return path
            visited.add((pos[0], pos[1]))
            bounds = grid.shape
            indices = [(x, curr) for x in surroundIndices(pos, bounds, visited, False)]
            queue.extend(indices)
        
        
    return None

            
if __name__ == '__main__':
    # print('Random', timeit.timeit('numpy.random.randint(0, 20, (10,10))',setup = 'import numpy', number = 1))
    # print('Zeroes', timeit.timeit('numpy.zeros((10,10))', setup = 'import numpy', number = 1))
    # Ask the user for cost or basic tree search
    cost = input("Would you like to do cost based search or just a basic search? (Cost/Basic): ").lower()
    while cost not in ['cost', 'basic']:
        cost = input("Would you like to do cost based search or just a basic search? (Cost/Basic): ").lower()
    if cost == 'cost':
        cost = True
    else:
        cost = False
    # Call function to init the grid 
    init_grid(cost)
    print(surroundIndices([0,0], grid.shape))
    #assert False
    print("Starting grid")
    print(grid)
    path = np.array(breadthFirst())
    res = np.zeros_like(grid)
    res[path[:,0], path[:,1]] = np.arange(1, len(path)+1)
    print('Path for breadth first search')
    print(res)
    if cost:
        print(f'The path found by BFS has a cost of {np.sum(grid[path[:,0], path[:,1]])}')
    


