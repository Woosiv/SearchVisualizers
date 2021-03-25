import numpy as np
import timeit
grid = None
start = (0,0)
end = (0,0)

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
        
        high = input(f"Enter the upper bound cost of the grid (Must be greater than {low}): ")
        while not high.isdigit() or (high.isdigit() and int(high) <= low):
            high = input(f"Enter the upper bound cost of the grid: (Must be greater than {low}): ")
        high = int(high)
    
    global grid
    if cost:
        grid = np.random.randint(low, high, (x,y))
    else:
        grid = np.zeros((x,y))
    
if __name__ == '__main__':
    # print('Random', timeit.timeit('numpy.random.randint(0, 20, (10,10))',setup = 'import numpy', number = 1))
    # print('Zeroes', timeit.timeit('numpy.zeros((10,10))', setup = 'import numpy', number = 1))
    cost = input("Would you like to do cost based search or just a basic search? (Cost/Basic): ").lower()
    while cost not in ['cost', 'basic']:
        # print(cost)
        # print(cost != 'cost' or cost != 'basic')
        cost = input("Would you like to do cost based search or just a basic search? (Cost/Basic): ").lower()
    if cost == 'cost':
        cost = True
    else:
        cost = False 
    init_grid(cost)
    print(grid)
