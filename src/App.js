import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { useCreategraph } from "./hooks/useCreategraph";
import { useDijkstraAlgorithm } from "./hooks/useDijkstraAlgorithm";
import pGhostImg from "./assets/purple_ghost.png";
import rGhostImg from "./assets/red_ghost.png";
import packmanImg from "./assets/packman.png";
const App = () => {
  const dimension = Math.min(window.innerWidth, window.innerHeight);
  const bSize = Math.floor(dimension / 26);

  const initialGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const [grid, setGrid] = useState(initialGrid);
  const [pacMan, setPacMan] = useState({ x: 1, y: 1 });
  const [redGhost, setRedGhost] = useState({ x: 19, y: 1 });
  const [purpleGhost, setPurpleGhost] = useState({ x: 10, y: 11 });
  useEffect(()=>{
    console.log(pacMan.x,pacMan.y,redGhost,purpleGhost);
    if (
      (pacMan.x === redGhost.x && pacMan.y === redGhost.y) ||
      (pacMan.x === purpleGhost.x && pacMan.y === purpleGhost.y)
    ) {
      setGameOver(true);
    }
  },[pacMan,redGhost,purpleGhost]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false); // Track game over state
  const [redGhostPath, setRedGhostPath] = useState([]);
  const [purpleGhostPath, setPurpleGhostPath] = useState([]);

  const dijkstraAlgorithm = useDijkstraAlgorithm();

  // Keypress handler for movement
  const movePacMan = (direction) => {
    const { x, y } = pacMan;
    let newX = x;
    let newY = y;

    if (direction === "ArrowUp" && grid[y - 1][x] !== 1) newY--;
    if (direction === "ArrowDown" && grid[y + 1][x] !== 1) newY++;
    if (direction === "ArrowLeft" && grid[y][x - 1] !== 1) newX--;
    if (direction === "ArrowRight" && grid[y][x + 1] !== 1) newX++;

    if (grid[newY][newX] === 2) {
      const newGrid = [...grid];
      newGrid[newY][newX] = 0;
      setGrid(newGrid);
      setScore(score + 1);
    }

    setPacMan({ x: newX, y: newY });

    // Check collision with ghosts
  };

  const handleKeyDown = (event) => {
    if (event.repeat) return; // Ignore repeated keydown events
    movePacMan(event.key);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pacMan, grid]);

  useEffect(() => {
    const allFoodEaten = grid.flat().every((cell) => cell !== 2);
    if (allFoodEaten) {
      setGrid(initialGrid);
    }
  }, [grid]);

  useEffect(() => {
    const path = dijkstraAlgorithm(grid, pacMan, redGhost, purpleGhost.y, purpleGhost.x);
    setRedGhostPath(path);

    const purplePath = dijkstraAlgorithm(grid, pacMan, purpleGhost, redGhost.y, redGhost.x);
    setPurpleGhostPath(purplePath);
  }, [pacMan]);

  const positionRef = useRef({ x: redGhost.x, y: redGhost.y });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    let index = 0;
    if (redGhostPath.length > 0) {
      const newPosition = redGhostPath[index];
      positionRef.current = { x: newPosition[0], y: newPosition[1] };
      setRedGhost({ x: newPosition[1], y: newPosition[0] });
      index++;
    }

    intervalRef.current = setInterval(() => {
      if (index >= redGhostPath.length) {
        clearInterval(intervalRef.current);
        return;
      }

      const newPosition = redGhostPath[index];
      positionRef.current = { x: newPosition[0], y: newPosition[1] };
      setRedGhost({ x: newPosition[1], y: newPosition[0] });
      index++;
    }, 400);
  }, [redGhostPath]);

  const positionRefPurple = useRef({ x: purpleGhost.x, y: purpleGhost.y });
  const intervalRefPurple = useRef(null);

  useEffect(() => {
    if (intervalRefPurple.current) {
      clearInterval(intervalRefPurple.current);
      intervalRefPurple.current = null;
    }

    let index = 0;
    if (purpleGhostPath.length > 0) {
      const newPosition = purpleGhostPath[index];
      positionRefPurple.current = { x: newPosition[0], y: newPosition[1] };
      setPurpleGhost({ x: newPosition[1], y: newPosition[0] });
      index++;
    }

    intervalRefPurple.current = setInterval(() => {
      if (index >= purpleGhostPath.length) {
        clearInterval(intervalRefPurple.current);
        return;
      }

      const newPosition = purpleGhostPath[index];
      positionRefPurple.current = { x: newPosition[0], y: newPosition[1] };
      setPurpleGhost({ x: newPosition[1], y: newPosition[0] });
      index++;
    }, 400);
  }, [purpleGhostPath]);

  const restartGame = () => {
    setGrid(initialGrid);
    setPacMan({ x: 1, y: 1 });
    setRedGhost({ x: 19, y: 1 });
    setPurpleGhost({ x: 10, y: 11 });
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center bg-[conic-gradient(var(--tw-gradient-stops))] from-[#4f46e5] via-[#818cf8] to-[#c7d2fe] w-full h-screen">
      <div className=" mt-4 flex flex-col sm:flex-row items-center sm:gap-16 mb-6">
        <h1 className="text-2xl font-bold">Pac-Man Game</h1>
        <h2 className="text-xl font-bold">Score: {score}</h2>
      </div>
      <div className="flex flex-col md:flex-row">
      <div
        className="grid gap-0 border-2 border-black rounded-sm"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, ${bSize}px)`,
          gridTemplateRows: `repeat(${grid.length}, ${bSize}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-[${bSize}px] h-[${bSize}px] ${
                cell === 1
                  ? "bg-blue-200 rounded-sm  border-[1px] sm:border-2 border-blue-500"
                  : cell === 2
                  ? "bg-black"
                  : "bg-black"
              } flex items-center justify-center relative`}
            >
              {cell === 2 && <div className="absolute w-1 h-1 bg-red-300 rounded-full"></div>}
              {pacMan.x === colIndex && pacMan.y === rowIndex && (
                 <div className="z-20 w-3/4 h-3/4  rounded-full"><img  className="w-full" src={packmanImg}></img></div>
              )}
              {redGhost.x === colIndex && redGhost.y === rowIndex && (
                 <div className="z-20 w-3/4 h-3/4  rounded-full"><img  className="w-full" src={rGhostImg}></img></div>
              )}
              {purpleGhost.x === colIndex && purpleGhost.y === rowIndex && (
                <div className="z-20 w-3/4 h-3/4  rounded-full"><img  className="w-full" src={pGhostImg}></img></div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="md:ml-10 md:mt-10">
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="bg-gray-300 p-2 text-2xl rounded-lg"
          onClick={() => movePacMan("ArrowUp")}
        >
          ⬆️
        </button>
      </div>
      <div className="flex justify-center mt-2 space-x-2">
        <button
          className="bg-gray-300 p-2 text-2xl rounded-lg"
          onClick={() => movePacMan("ArrowLeft")}
        >
          ⬅️
        </button>
        <button
          className="bg-gray-300 p-2 text-2xl rounded-lg"
          onClick={() => movePacMan("ArrowDown")}
        >
          ⬇️
        </button>
        <button
          className="bg-gray-300 p-2 text-2xl rounded-lg"
          onClick={() => movePacMan("ArrowRight")}
        >
          ➡️
        </button>
      </div>
      </div>
      </div>
      {gameOver && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
              onClick={restartGame}
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
