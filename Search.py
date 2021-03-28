import numpy as np
import timeit
import time
from collections import deque
import heapq
grid = np.array([1,1])
start = (1,1)
end = (100,100)
low = 1
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
        global low
        low = input("Enter the lower bound cost of the grid: ")
        while not low.isdigit() and (low.isdigit() and int(low) <= 0):
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
        grid = np.ones((x,y))
    grid[end] = 0
    
# Finds surrounding indices with the given position
def surroundIndices(pos, visited=None, omni=False) -> list:
    # If the search decides to not remembered visited nodes
    if visited == None:
        visited = set()
    bounds = grid.shape
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

# Returns the path found via breadth first search by default but can be toggled for depth first  
def firstSearch(breadth = True) -> list:
    startTime = time.perf_counter()
    queue = deque([start])
    # [0] holds parents, [1] holds cost
    parents = {start : (tuple(), 0)}
    visited = set()
    while queue:
        #print(queue)
        curr = queue.popleft() 
        # time.sleep(2)
        pos = (curr[0], curr[1])
        if pos == end:
            path = list(parents[pos][0]) + [pos]
            # visitedArray = np.array([list(x) for x in visited])
            # visitedGrid = np.zeros_like(grid)
            # visitedGrid[visitedArray[:,0], visitedArray[:,1]] = 1
            # print(visitedGrid)
            #print(len(visited))
            #print(path)
            print(f'Breadth First found a path in {time.perf_counter()-startTime:.4f}') if breadth else print(f'Depth First found a path in {time.perf_counter()-startTime:.4f}')
            return path
        elif pos not in visited:
            visited.add(pos)
            for x in surroundIndices(pos, visited):
                # Check for duplicates
                if x in queue:
                    #print('Proc\'d')
                    # If the cost in the current is higher than the new found cost
                    # remove its current queue position and update the best parent path.
                    if parents[(x[0], x[1])][1] > parents[pos][1] + grid[x[0], x[1]]:
                        queue.remove(x)
                        parents[(x[0], x[1])] = (parents[pos][0] + (pos,),parents[pos][1] + grid[x[0], x[1]])
                        queue.append(x)
                else:
                    parents[(x[0], x[1])] = (parents[pos][0] + (pos,), parents[pos][1] + grid[x[0], x[1]])
                    queue.append(x) if breadth else queue.appendleft(x)
                    
                
            #indices = [(x, curr) for x in surroundIndices(pos, grid.shape, visited)]
            #queue.extend(indices) if breadth else queue.extendleft(indices)
        
    return None

# Returns a path found via the A-star search algorithm
def A_starSearch(omni=False):
    startTime = time.perf_counter()
    priority = [(grid[start], start, None)]
    parents = {}
    visited = set()
    while priority:
        # print(priority)
        cost, pos, parent = heapq.heappop(priority)
        if pos == end:
            path = []
            while parent:
                path = [pos] + path
                pos = parent
                parent = parents[parent]
            path = [pos] + path
            # visitedArray = np.array([list(x) for x in visited])
            # visitedGrid = np.zeros_like(grid)
            # visitedGrid[visitedArray[:,0], visitedArray[:,1]] = 1
            # print(visitedGrid)
            print(f'A-star found a path in {time.perf_counter()-startTime:.4f}')
            return path
        elif pos not in visited:
            visited.add(pos)
            parents[pos] = parent
            #print(pos, 'is the current position')
            for x in surroundIndices(pos):
                #print(x, grid[x[0], x[1]], grid[x[0], x[1]] + (abs(x[0]-end[0]) + abs(x[1]-end[1]))*low, (abs(x[0]-end[0]) + abs(x[1]-end[1]))*low/2)
                heapq.heappush(priority, (cost + grid[x[0], x[1]] + (abs(x[0]-end[0]) + abs(x[1]-end[1]))*low, (x[0], x[1]), pos))

# Helper function to display path taken by a search
def printResult(search, pathFound, cost):
    # print(pathFound)
    res = np.zeros_like(grid)
    res[pathFound[:,0], pathFound[:,1]] = np.arange(1, len(pathFound)+1)
    print(f'Path for {search}')
    print(res)
    if cost:
        print(f'The path found by {search} has a cost of {np.sum(grid[pathFound[:,0], pathFound[:,1]])}')

            
if __name__ == '__main__':
    # print('Random', timeit.timeit('numpy.random.randint(0, 20, (10,10))',setup = 'import numpy', number = 1))
    # print('Zeroes', timeit.timeit('numpy.zeros((10,10))', setup = 'import numpy', number = 1))
    # Ask the user for cost or basic tree search
    # test = np.random.randint(0, 10, (3,3))
    # print(test)
    # print(test[(1,1)])
    cost = input("Would you like to do cost based search or just a basic search? (Cost/Basic): ").lower()
    while cost not in ['cost', 'basic']:
        print("Please enter cost or basic.")
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
    printResult('Breadth First Search', np.array(firstSearch()), cost)
    printResult('Depth First Search', np.array(firstSearch(False)), cost)
    printResult('A-Star Search', np.array(A_starSearch()), cost) 
    


