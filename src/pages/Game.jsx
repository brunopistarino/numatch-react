import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import Cell from "../components/Cell";
import Timer from "../components/Timer";
import Modal from "../components/Modal";

import { ReactComponent as MenuIcon } from "../icons/menu-01.svg";

function Game({ rows, cols, couples }) {
  const [matrix, setMatrix] = useState([]);
  const [flippedCells, setFlippedCells] = useState([]);
  const [moves, setMoves] = useState(0);
  const [restart, setRestart] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [time, setTime] = useState(0);

  const handleClick = (row, col) => {
    if (flippedCells.length === 2) {
      return;
    }
    if (flippedCells[0]?.row === row && flippedCells[0]?.col === col) {
      return;
    }
    const newMatrix = [...matrix];
    newMatrix[row][col].isFlipped = true;
    setMatrix(newMatrix);
    setFlippedCells([...flippedCells, { row, col }]);
  };

  const handleTime = (time) => {
    setTime(time);
  };

  // prove if selected cells match
  useEffect(() => {
    if (flippedCells.length === 2) {
      const [firstCell, secondCell] = flippedCells;
      if (
        matrix[firstCell.row][firstCell.col].value ===
        matrix[secondCell.row][secondCell.col].value
      ) {
        matrix[firstCell.row][firstCell.col].isMatched = true;
        matrix[secondCell.row][secondCell.col].isMatched = true;
        setFlippedCells([]);
        checkIfWon();
      } else {
        setTimeout(function () {
          setFlippedCells([]);
        }, 700);
      }
      setMoves(moves + 1);
    }
  }, [flippedCells]);

  const checkIfWon = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!matrix[i][j].isMatched) {
          return;
        }
      }
    }

    setIsFinished(true);
  };

  const handleReset = () => {
    setFlippedCells([]);
    setMoves(0);
    setMenuOpen(false);
    setStopTimer(false);
    setRestart(!restart);
  };

  const handleOpenMenu = () => {
    setMenuOpen(true);
    setStopTimer(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setStopTimer(false);
  };

  useEffect(() => {
    if (isFinished) {
      setStopTimer(true);
    }
  }, [isFinished]);

  // load matrix with couples of numbers that didn't repeat
  useEffect(() => {
    const mat = [];
    const numbers = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        let number = Math.floor(Math.random() * couples) + 1;
        while (countInArray(numbers, number) >= 2) {
          number = Math.floor(Math.random() * couples) + 1;
        }
        numbers.push(number);
        row.push({ value: number, isFlipped: false, isMatched: false });
      }
      mat.push(row);
    }
    setMatrix(mat);

    // ckeck for a number that appears only once
    for (let i = 0; i < numbers.length; i++) {
      if (countInArray(numbers, numbers[i]) === 1) {
        // search for the cell with the number and make it matched
        for (let j = 0; j < rows; j++) {
          for (let k = 0; k < cols; k++) {
            if (mat[j][k].value === numbers[i]) {
              mat[j][k].isMatched = true;
              setMatrix(mat);
              break;
            }
          }
        }
      }
    }
  }, [restart]);

  function countInArray(array, number) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === number) {
        count++;
      }
    }
    return count;
  }

  return (
    <>
      <Modal show={isFinished || menuOpen}>
        {menuOpen && (
          <div className="modal-menu">
            <Link to="#" className="clk-btn" onClick={handleReset}>
              Restart
            </Link>
            <Link to="/" className="clk-btn">
              New Game
            </Link>
            <Link to="#" className="clk-btn" onClick={handleCloseMenu}>
              Resume Game
            </Link>
          </div>
        )}
        {isFinished && (
          <div className="modal-finished">
            <h1>You won!</h1>
            <div className="data-container">
              <div className="data-field">
                <p>Time</p>
                <h2>{time}</h2>
              </div>
              <div className="data-field">
                <p>Moves</p>
                <h2>{moves}</h2>
              </div>
            </div>
            <Link to="/" className="clk-btn" onClick={handleReset}>
              New Game
            </Link>
          </div>
        )}
      </Modal>
      <div id="game-view">
        {!rows || !cols ? <Navigate to="/" /> : null}

        <header>
          <h1>numatch</h1>
          <div className="buttons">
            <Link className="button clk-btn" to="#" onClick={handleReset}>
              Restart
            </Link>
            <Link className="button clk-btn" to="/">
              New Game
            </Link>
            <Link className="menu-btn clk-btn" to="#" onClick={handleOpenMenu}>
              <MenuIcon />
            </Link>
          </div>
        </header>

        <main>
          <div
            className={`game-board ${couples >= 10 ? "big" : "small"}`}
            style={{ gridTemplateColumns: `repeat(${rows}, 1fr)` }}
          >
            {matrix.map((row, i) => (
              <>
                {row.map((cell, j) => (
                  <Cell
                    key={j}
                    isMatched={cell.isMatched}
                    value={cell.value}
                    onClick={handleClick}
                    row={i}
                    col={j}
                    isFlipped={flippedCells.some(
                      (flippedCell) =>
                        flippedCell.row === i && flippedCell.col === j
                    )}
                  />
                ))}
              </>
            ))}
          </div>
        </main>

        <footer>
          <div className="data-field">
            <p>Time</p>
            <Timer restart={restart} stop={stopTimer} update={handleTime} />
          </div>
          <div className="data-field">
            <p>Moves</p>
            <h2>{moves}</h2>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Game;
