import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.winner ? 'square-highlight' : null}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winningSquares = this.props.winningSquares;
    const winner = winningSquares.includes(i);

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={winner}
      />
    );
  }

  render() {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3*i + j));
      }
      items.push(<div className="board-row">{squares}</div>);
    }

    return (
      <div>
        {items}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: {
          col: null,
          row: null
        }
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAscending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const location = {
      col: Math.floor(i / 3),
      row: i % 3
    };
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  setSorting(sorting) {
    this.setState({
      sortAscending: !this.state.sortAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ` (${step.location.col + 1}, ${step.location.row + 1})` :
        'Go to game start';
      return (
        <li key={move} className={this.state.stepNumber === move ? 'text-bold' : null}>
          <button 
            className={this.state.stepNumber === move ? 'text-bold' : null}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.sortAscending) {
      moves.reverse();
    }

    let status;
    let winningSquares = [];
    if (winner) {
      status = winner === 'Tie' ? "It's a tie!" : 'Winner: ' + winner;
      winningSquares = calculateWinner(current.squares, true);
      console.log(winningSquares);
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let sort = this.state.sortAscending ? "Sort descending" : "Sort ascending";

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={(sort) => this.setSorting(sort)}>{sort}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares, winner = false) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return winner ? [a, b, c] : squares[a];
    }
  }

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return null;
    }
  }

  return 'Tie';
}