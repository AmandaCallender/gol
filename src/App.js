import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";


const numRows = 30;
const numColumns = 50;
let generation = 0;


//operations for checking neighbors across the grid
const neighborOps = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const emptyGrid = () => {
  const rows = [];
  // creating the grid!
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numColumns), () => 0));
  }
  return rows;
};

function App() {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    return emptyGrid();
  });

  //This gives us our current value for the running state while being mutable
  const runningRef = useRef(running);
  runningRef.current = running;

  const runGame = useCallback(() => {
    //If we are not running, end the function.
    if (!runningRef.current) {
      return;
    }
    //Otherwise, call the function recursively to update the state

    
    generation++;

    setGrid((g) => {
      // the current grid is set to g
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColumns; j++) {
            //Figure out how many neighbors each cell has
            let neighbors = 0;
            neighborOps.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              //check the bounds of your grid to make sure you don't go above or below
              if (
                newI >= 0 &&
                newI < numRows &&
                newJ >= 0 &&
                newJ < numColumns
              ) {
                neighbors += g[newI][newJ];
              }
            });
            //if the current cell is dead, but has 3 neighbors it comes alive
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            } 
          }
        }
      });
    });

    setTimeout(runGame);
  }, []);

  return (
    <div className="page-container">
      <h1>The Game Of Life</h1>
      <div
        className="grid-display"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numColumns}, 20px`,
        }}
      >
        {/* This creates the grid by mapping over our rows. 
      I is the index of our rows, c is the index of our columns  */}
        {grid.map((rows, i) =>
          rows.map((col, c) => (
            <div
              key={`${i}-${c}`}
              //This sets the index of the clicked grid to 'alive'
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][c] = grid[i][c] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][c] ? "cyan" : undefined,
                border: "solid 1px purple",
              }}
            />
          ))
        )}
      </div>
      <div className="button-container">
        {/*changes the state to determine whether the game is running or not*/}
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runGame();
            }
          }}
        >
          <h2>Play / Pause</h2>
        </button>
        <button
          onClick={() => {
            generation = 0;
            setGrid(emptyGrid());
          }}
        >
          <h2>Erase</h2>
        </button>
        <button
          onClick={() => {
            
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numColumns), () =>
                  Math.random() > 0.8 ? 1 : 0
                )
              );
            }
            setGrid(rows);
          }}
        >
          <h2>Randomize</h2>
        </button>
      </div>
      <div className="description">
        <h2>Generation: {`${generation}`}</h2>
      </div>
      <div className="description">
        <div>
          <h2>The Rules</h2>
          <ul>
            <p>Any live cell with two or three live neighbours survives.</p>
            <p>
              Any dead cell with three live neighbours becomes a live cell.
            </p>
            <p>
              All other live cells die in the next generation. Similarly, all
              other dead cells stay dead.
            </p>
          </ul>
        </div>
      </div>
      <div className="description">
        <div>
          <h2>Instructions</h2>
          <ol>
            <li>Click on any cell to make it "alive".</li>
            <li>Click Play to see how your simulation plays out!</li>
            <p>
              Unsure of what configuration you want to simulate first? Try a basic line of 9 cells. You can also create a random simulation by pressing the Randomize button!
            </p>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;