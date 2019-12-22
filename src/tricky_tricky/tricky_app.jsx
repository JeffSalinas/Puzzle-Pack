import React, {Component} from 'react';
import { NavLink } from "react-router-dom";
import levels from './components/Levels';
import Row from './components/row.jsx';
import Popup from './components/popup.jsx';
import Out from './components/out.jsx';
import Password from './components/password.jsx';
const levelArray = Object.keys(levels);

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            start: true,
            level: 0,
            boardView: [],
            selectTop: { 
                row: 1,
                col: 0
            },
            move: 0,
            pswdScreen: true,
            lastPasswordKey: '',
            outOfMoves: false,
            booyah: true
        };
        this.routeKeydown = this.routeKeydown.bind(this)
    }

    componentDidMount() {
        this.mountLevel()
        document.addEventListener("keydown", this.routeKeydown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.routeKeydown);
    }

    routeKeydown(event) {
        if (event.target.nodeName == 'INPUT') {
            this.passwordHandler(event);
            return;
        }
        this.move(event)
    }

    passwordHandler(event) {
        if (event.key === 'Enter') {

            for (let lvl = 0; lvl < levelArray.length; lvl++) {
                if (levels[levelArray[lvl]].password === event.target.value) {
                    event.target.value = 'Kubernetes!'

                    setTimeout(() => {
                        this.setState(() => {
                            return {level: lvl, pswdScreen: false}
                        });

                        this.mountLevel();

                    }, 500)
                    return;
                }
            }

            if (this.state.lastPasswordKey === 'Enter') {
                this.move(event);
            }

            event.target.value = ''
            this.setState(() => {
               return {lastPasswordKey: 'Enter'};
            });
        } else {
            return;
        }
    }

    mountLevel() {
        let newBoard = []

        for (let i = 0; i < levels[levelArray[this.state.level]].board.length; i++) {
            let row = [];
            for (let j = 0; j < levels[levelArray[this.state.level]].board[i].length; j++) {
                row.push(levels[levelArray[this.state.level]].board[i][j]);
            }
            newBoard.push(row);
        }

        this.setState({ boardView: newBoard}, () => this.setSelector());
    }

    setSelector() {
        let newSelect = {
            row: 0,
            col: 0
        }
        for (let r = 0; r < 4; r++) {
            if (this.state.boardView[r][0] !== './img/empty.png') {
                newSelect.row = r;
                break;
            }
        }

        this.setState({ selectTop: newSelect});
    }

    move(event) {
        if (this.state.pswdScreen) {
            if (this.state.start) {
                this.setState(() => { return { pswdScreen: false}; });
            }
            return;
        }
        if (this.state.start) {
            if (this.state.start) {
                this.setState(() => { return { start: false, booyah: true  }; });
            }
            if (event.key === 'Enter') {
                return;
            }
        }
        let currentMove = this.state.move;

        let newSelect = {
            row: this.state.selectTop.row,
            col: this.state.selectTop.col
        }


        if (event.key === 'ArrowLeft') {
            if (newSelect.col === 0) {
                return;
            }
            newSelect.col = newSelect.col - 1

        } else if (event.key === 'ArrowRight') {
            if (newSelect.col === 9) {
                return;
            }
            newSelect.col = newSelect.col + 1
            
        } else if (event.key === 'ArrowDown') {
            if (newSelect.row === 4) {
                return;
            }
            newSelect.row = newSelect.row + 1

        } else if (event.key === 'ArrowUp') {
            if (newSelect.row === 0) {
                return;
            }
            newSelect.row = newSelect.row - 1
        } else if (event.key === 'Enter') {
            currentMove++;
            this.swapBlocks();
        } else {
            return
        }

        this.setState(() => {
            return {selectTop: newSelect, move: currentMove}
        });
    };
    
    swapBlocks() {
        let row = this.state.selectTop.row;
        let col = this.state.selectTop.col;
        let newBoard = this.state.boardView.map(array => {
            return array.slice();
        });
        let temp = newBoard[row][col];

        newBoard[row][col] = newBoard[row + 1][col]
        newBoard[row + 1][col] = temp;

        this.setState({ boardView: newBoard }, () => this.shiftLeft());
    };

    shiftLeft() {
        let newBoard = this.state.boardView.map(array => {
            return array.slice();
        });
        
        newBoard.forEach((rowArray, rowIndex) => {
            let empty = [];
            for (let col = 0; col < rowArray.length; col++) {
                if (rowArray[col] === './img/empty.png') {
                    empty.push(col);
                }
                if (rowArray[col] === './img/black.png') {
                    newBoard[rowIndex][col] = './img/empty.png';
                    empty.push(col);
                }
            }
            empty.reverse();
            empty.forEach(colIndex => {
                newBoard[rowIndex].push(newBoard[rowIndex].splice(colIndex,1)[0]);
            });

        });
    
        this.setState({ boardView: newBoard }, () => {
            setTimeout(() => { this.checkMatches(); }, 350);
        });
    }

    checkMatches() {
        let newBoard = this.state.boardView.map(array => {
            return array.slice();
        });

        let change = false;
////////////////////////////////////////////////////////////////
////////////////////////  CHECK ROWS   /////////////////////////

        this.state.boardView.forEach((rowArray, rowIndex) => {
            let count = {
                './img/box.png': 0,
                './img/dot.png': 0,
                './img/dots.png': 0,
                './img/four_box.png': 0,
                './img/smiley.png': 0
            }
            let prevBlock = '';

            for (let col = 0; col < rowArray.length; col++) {
                if (rowArray[col] === './img/empty.png' || rowArray[col] !== prevBlock) {
                    count['./img/box.png'] = 0;
                    count['./img/dot.png'] = 0;
                    count['./img/dots.png'] = 0;
                    count['./img/four_box.png'] = 0;
                    count['./img/smiley.png'] = 0 ;
                }
                if (rowArray[col] === './img/empty.png') {
                    continue;
                }


                prevBlock = rowArray[col];
                count[rowArray[col]]++;
                
                if (count[rowArray[col]] === 3) {
                    newBoard[rowIndex][col] = './img/black.png';
                    newBoard[rowIndex][col - 1] = './img/black.png';
                    newBoard[rowIndex][col - 2] = './img/black.png';
                    change = true;
                } else if (count[rowArray[col]] > 3) {
                    newBoard[rowIndex][col] = './img/black.png';
                }
            }
        });

////////////////////////////////////////////////////////////////
////////////////////////  CHECK COLUMNS   /////////////////////////
        for (let col = 0; col < this.state.boardView[0].length; col++) {
            let count = {
                './img/box.png': 0,
                './img/dot.png': 0,
                './img/dots.png': 0,
                './img/four_box.png': 0,
                './img/smiley.png': 0
            }
            let prevBlock = '';

            for (let row = 0; row < this.state.boardView.length; row++) {
                if (this.state.boardView[row][col] === './img/empty.png' || this.state.boardView[row][col] !== prevBlock) {
                    count['./img/box.png'] = 0;
                    count['./img/dot.png'] = 0;
                    count['./img/dots.png'] = 0;
                    count['./img/four_box.png'] = 0;
                    count['./img/smiley.png'] = 0;
                }
                if (this.state.boardView[row][col] === './img/empty.png') {
                    continue;
                }

                prevBlock = this.state.boardView[row][col];
                count[this.state.boardView[row][col]]++;

                if (count[this.state.boardView[row][col]] === 3) {
                    newBoard[row][col] = './img/black.png';
                    newBoard[row - 1][col] = './img/black.png';
                    newBoard[row - 2][col] = './img/black.png';
                    change = true;
                } else if (count[this.state.boardView[row][col]] > 3) {
                    newBoard[row][col] = './img/black.png';
                }
            }
        }


        if (change) {
            this.setState({ boardView: newBoard}, () => {
                setTimeout(() => this.shiftLeft(), 400);
                
            });
        } else {
            this.checkCompete();
        }
    };

    checkCompete() {
        let newBoard = this.state.boardView.map(array => {
            return array.slice();
        });
        let win = true;

        newBoard = newBoard.flat()
        for (let block of newBoard) {
            if (block !== './img/empty.png') {
                win = false;
            }
        }

        if (win) {
            if (this.state.level === 24) {
                window.location.href='/';
                return;
            }
            this.setState({ level: this.state.level + 1, start: true, move: 0 }, () => this.mountLevel());

            return;
        } else if (this.state.move >= levels[levelArray[this.state.level]].moves) {
            this.setState({ move: 0, start: true, outOfMoves: true, booyah: false }, () => {
                setTimeout(() => {
                    this.setState({ outOfMoves: false }, () => { 
                        this.mountLevel();
                    });
                }, 900);
            });
        }
        return;
    }

    render() {

        return (
            <div className="viewPort">
                <div id="container">
                    { this.state.start ? <Popup level={levels[levelArray[this.state.level]]} currentlvl={this.state.level + 1}/> : null }
                    {this.state.outOfMoves ? <Out /> : null }
                    {this.state.pswdScreen ? <Password />: null}
                    <div id="gameBoard">
                        {this.state.boardView.map((row, index) => {
                            return (
                                <Row
                                    selectTop={this.state.selectTop}
                                    row={row}
                                    rowIndex = { index }
                                    key = { index }
                                />
                            )
                        })}
                    </div>
                    {this.state.level < 8 ? 
                    <p id="booyah" style={{
                        fontSize: `${this.state.level * 2}px`, margin: `-${this.state.level - 5}px 0` }}>
                            {this.state.start && this.state.level && this.state.booyah !== 0 ? 'booyah!' : null}
                    </p> : 
                        this.state.level >= 8 && this.state.level < 15  ? 
                        <p id="booyah" style={{
                            fontSize: `${this.state.level * 2}px`, margin: `-${this.state.level - 5}px 0`
                        }}>
                                {this.state.start && this.state.booyah ? 'BOOYAH!!' : null}
                            </p> : this.state.level >= 15 && this.state.level < 22 ? 
                            <p id="booyah" style={{
                                fontSize: `${this.state.level * 2}px`, margin: `-${this.state.level - 5}px 0`, fontWeight: 'bold'
                            }}>
                                    {this.state.start && this.state.booyah ? 'BOOOOYAH!!!!!' : null}
                                </p> :  <p id="booyah" style={{
                                    fontSize: `${this.state.level * 3}px`, margin: `-${this.state.level - 5}px 0`, fontWeight: 'bold'
                                }}>
                                    {this.state.start && this.state.booyah ? 'BOOOOYAH!!!!!' : null}
                                </p>
                    }

                    <div id="bottomSpace"></div>
                </div>
                <div id="home_container">
                    <NavLink to='/'>    
                        <button id="homebutton">Home</button>
                    </NavLink>
                </div>

                <p className="instructTitles">Objective:</p> 
                <ul>
                    <li>Clear each block to complete each level</li>
                    <li>Line up 3 or more blocks of the same variety to clear blocks</li>
                    <li>Be careful! You have a limited number of moves for each level</li>
                </ul>
                <p className="instructTitles">Controls:</p>
                <ul>
                    <li>Use <strong>Arrow Keys</strong> to move selector</li>
                    <li>Use <strong>Enter</strong> to swap the blocks in the selector window</li>
                </ul>
            </div>
        )
    }
}

export default App;