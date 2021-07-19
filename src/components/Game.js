import React, { Component } from 'react';
import Cell from './Cell';

const CELL_SIZE = 20;

const wrem = window.innerWidth % CELL_SIZE;
const hrem = window.innerHeight % CELL_SIZE;

const WIDTH = window.innerWidth - wrem;
const HEIGHT = window.innerHeight - hrem - (2 * 20);

export default class Game extends Component {
    constructor() {
        super();
        this.rows = HEIGHT / CELL_SIZE;
        this.cols = WIDTH / CELL_SIZE;
        this.board = this.makeEmptyBoard();
    }

    state = {
        cells: [], 
        interval: 50, 
        isRunning: false, 
    }

    runGame = () => { 
        this.setState({ isRunning: true });
        this.runIteration();
    }

    stopGame = () => { 
        this.setState({ isRunning: false}); 

        window.clearTimeout(this.timeoutHandler);
        this.timeoutHandler = null;
        
    }

    handleIntervalChange = (event) => { this.setState({ interval: event.target.value }); }

    runIteration() {
        let newBoard = this.makeEmptyBoard();
        
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });
        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }    

    makeEmptyBoard() {
        let board = [];

        for (let y = 0; y < this.rows; y++) {
            board[y] = []

            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }

        return board;
    }

    makeCells() {
        let cells = [];

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({x, y})
                }
            }
        }

        return cells;
    }

    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop
        };
    }

    handleClick = (event) => {
        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;

        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
        }

        this.setState({ cells: this.makeCells() });
    }

    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells() });
    }

    handleRandom = () => {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                Math.random() >= 0.5 ? this.board[y][x] = true : this.board[y][x] = false;                               
            }
        }

        this.setState({ cells: this.makeCells() });
    }

    showRules = () => {
        const modal = document.getElementById('rules-modal');
        modal.style.display = "block";
    }

    hideRules = (e) => {
        const modal = document.getElementById('rules-modal');
        modal.style.display = "none";
    }

    render() {
        const { cells, interval, isRunning } = this.state;

        return (
            <div>
                <div className='controls'>
                    <h1>Conway's Game of Life</h1>
                    Update every <input value={interval} onChange={this.handleIntervalChange}/> msec 
                    {isRunning ? 
                        <button className='button' onClick={this.stopGame}>Stop</button> : <button className='button' onClick={this.runGame}>Run</button>
                    }
                    <button className='button' onClick={this.handleClear}>Clear</button>
                    <button className='button' onClick={this.handleRandom}>Random</button>
                    <button id='btn-modal' className='button' onClick={this.showRules}>Rules</button>
                    <div id='rules-modal' className='modal'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <span className='close' onClick={this.hideRules}>&times;</span>
                                <h2>Rules of Conway's Game of Life</h2>
                            </div>
                            <div className='modal-body'>
                                <ol>
                                    <li>Any live cell with fewer than two neighbors dies, as if caused by underpopulation.</li>
                                    <li>Any live cell with two or three live neighbors lives on to the next generation.</li>
                                    <li>Any live cell with more than three live neighbors dies, as if by overpopulation.</li>
                                    <li>Any dead cell with exactly three live neighbors becomes a live celll, as if by reproduction.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div 
                    className='board'
                    style={{width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                    onClick={this.handleClick}
                    ref={(n) => {this.boardRef = n; }}
                >
                    {cells.map(cell => (
                        <Cell x={cell.x} y={cell.y} CELL_SIZE={CELL_SIZE} key={`${cell.x}, ${cell.y}`} />
                    ))}
                </div>


            </div>
        )
    }
}

