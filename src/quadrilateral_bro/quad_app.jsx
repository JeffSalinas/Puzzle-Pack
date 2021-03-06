import Axios from 'axios';
import { NavLink } from "react-router-dom";
import React, {useEffect, useState} from 'react';
import MobileButtons from './components/MobileButtons.jsx';
import moment from 'moment';
import PandaRace from './components/PandaRace.jsx';
import Password from './components/password.jsx';
import Popup from './components/popup.jsx';
import Row from './components/row.jsx';
import levels from './components/Levels.js';
const levelArray = Object.keys(levels);

const App = () => {
    const [ attempt, setAttempt ] = useState(0);
    const [ boardLocation, setBoardLocation ] = useState({ row: 0, col: 0 });
    const [ boardView, setBoardView ] = useState([]);
    const [ brocation, setBrocation ] = useState({ row: 0, col: 0 });
    const [ broRight, setBroRight ] = useState(true);
    const [ doorLocation, setDoorLocation ] = useState({ row: 0, col: 0 });
    const [ fullBoard, setFullBoard ] = useState([]);
    const [ highScore, setHighScore ] = useState([[{ name: 'Jeff', time: '2:01' }], [{ name: 'Jeff', time: '2:01' }]]);
    const [ keyTracker, setKeyTracker ] = useState(true);
    const [ level, setLevel ] = useState(0);
    const [ pandaScreen, setPandaScreen ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ pswdScreen, setPswdScreen ] = useState(true);
    const [ playingRace, setPlayingRace ] = useState(false);
    const [ raceName, setRaceName ] = useState('');
    const [ shiftDown, setShiftDown ] = useState(false);
    const [ start, setStart ] = useState(true);
    const [ startTime, setStartTime ] = useState('')
    const [ time, setTime ] = useState(['0', '00']);
    const [ viewLocation, setViewLocation ] = useState({ row: 0, col: 0 });
    const [ isMobile, setIsMobile ] = useState(window.innerWidth <= 825);
    var tick;
    
    useEffect (() => {
        getData();
    }, []);

    useEffect (() => {
        window.addEventListener("resize", resetMobile);

        return () => {
            window.removeEventListener("resize", resetMobile);
        }
    }, []);

    useEffect (() => {
        if (playingRace && level === 4) {
            clearTimeout(tick);
            setTimeout(() => {
                setTime([time[0], time[1]]);
            })

            let newTime = Number(time[1]);
            newTime += Number(time[0]) * 60
    
            Axios.post('http://18.191.252.157/user', {
                userName: raceName,
                seconds: newTime
            })
            .then(() => {
                getData();
            });
        }
    }, [level]);

    useEffect (() => {
        if (keyTracker) {
            document.addEventListener("keydown", move);
        
            return () => {
                document.removeEventListener("keydown", move);
            }
        } else if (attempt >= 2) {
            setPswdScreen(false);
            setKeyTracker(true);
        }
    });

    useEffect (() => {
        let inputField = document.getElementById('password_input');
        inputField.addEventListener('click', changeTracker);

        return () => {
            inputField.removeEventListener('click', changeTracker);
        }
    }, []);

    useEffect (() => {
        if (pandaScreen) {
            let nameField = document.getElementById('name_input');
            nameField.addEventListener('click', changeTracker);
    
            return () => {
                nameField.removeEventListener('click', changeTracker);
            }
        }
    }, [pandaScreen]);

    useEffect(() => {
        document.addEventListener("click", trackerOn);

        return () => {
            document.removeEventListener("click", trackerOn);
        }
    }, [keyTracker]);

    useEffect(() => {
        document.addEventListener("keyup", shift);

        return () => {
            document.removeEventListener("keyup", shift);
        }
    });

    useEffect(() => {
        mountLevel();
    }, [level]);

    useEffect(() => {
        findBro();
    }, [start]);

    useEffect(() => {
        if (!start) {
            checkWin();
            syncView();
        }
    }, [brocation, fullBoard]);

    useEffect(() => {

        if (playingRace && level < 4) {
            tick = setTimeout(() => {
                let seconds = moment(new Date()).diff(startTime, 'seconds');
                let min = Math.floor(seconds / 60).toString();
                seconds = (seconds % 60).toString();
    
                if (seconds.length === 1) {
                    seconds = '0' + seconds;
                }
    
                if (min === "NaN") {
                    min = '0';
                } 
                
                if (seconds === 'NaN') {
                    seconds = '00';
                }
    
                setTime([min, seconds])
            }, 1000)
        }
    }, [time, startTime]);

    const getData = () => {
        Axios.get('http://18.191.252.157/users')
        .then(({ data }) => {
            let top3 = [];

            for (let i = 0; i < 3; i++) {
                top3.push(data[i]);
            }

            setHighScore([data, top3]);
        })
    };

    const resetMobile = () => {
        setIsMobile(window.innerWidth <= 825);
    };

    const submitRaceName = (event) => {
        event.preventDefault();

        setStartTime(moment(new Date()));
        setPlayingRace(true);
        setStart(false);
        setPandaScreen(false);
        setKeyTracker(true);
    };

    const changeTracker = (event) => {
        event.preventDefault();

        setKeyTracker(false);
    };

    const trackerOn = (event) => {
        event.preventDefault();

        setKeyTracker(true);
    };

    const submitPassword = (e) => {
        e.preventDefault();

        for (let lvl = 0; lvl < levelArray.length; lvl++) {
            if (levels[levelArray[lvl]].password === password) {
                setPassword('Kubernetes!');

                setKeyTracker(true);
                setTimeout(() => {
                    setLevel(lvl);
                    setPswdScreen(false);
                }, 500)
                return;
            }
        }

        setAttempt(attempt + 1);
        setPassword('');
    };

    const shift = (event) => {
        event.preventDefault();
        if (event.shiftKey === false && shiftDown === true) {
            let newView = [];

            for (let i = boardLocation.row; i < boardLocation.row + 12; i++) {
                newView.push(fullBoard[i].slice(boardLocation.col, boardLocation.col + 18));
            }

            setShiftDown(false);
            setBoardView(newView);
        }
    };
    
    const mountLevel = () => {
        let newFullBoard = (() => {
            let matrixCopy = [];
            for (let i = 0; i < levels[levelArray[level]].board.length; i++) {
                let row = [];
                for (let j = 0; j < levels[levelArray[level]].board[i].length; j++) {
                    row.push(levels[levelArray[level]].board[i][j]);
                }
                matrixCopy.push(row);
            }
            return matrixCopy;
        })()

        let newBoard = [];
        for (let i = newFullBoard.length - 12; i < newFullBoard.length; i++) {
            newBoard.push(newFullBoard[i].slice(-18));
        }

        let location = {
            row: newFullBoard.length -12,
            col: newFullBoard[newFullBoard.length - 12].length - 18
        }

        setBoardLocation(location);
        setFullBoard(newFullBoard);
        setBoardView(newBoard);
        setStart(true);
    };

    const syncView = () => {
        let newView = [];
        for (let i = boardLocation.row; i < boardLocation.row + 12; i++) {
            newView.push(fullBoard[i].slice(boardLocation.col, boardLocation.col + 18));
        }

        setBoardView(newView);
    };

    const findBro = () => {
        for (let row = 0; row < fullBoard.length; row++) {
            for (let col = 0; col < fullBoard[row].length; col++) {
                if (fullBoard[row][col] === './images/dudeRight.png' || fullBoard[row][col] === './images/dudeLeft.png'){
                    let direction = fullBoard[row][col] === './images/dudeRight.png';
                    let newBrocation = {
                        row: row,
                        col: col
                    };

                    setBrocation(newBrocation);
                    setBroRight(direction);
                }
                if (fullBoard[row][col] === './images/door.png'){
                    let newDoorLocation = {
                        row: row,
                        col: col
                    };

                    setDoorLocation(newDoorLocation);
                }
            }
        }
    };

    const broDirection = (boolean) => {
        setBroRight(boolean);
        let newBoard = fullBoard.slice();
        boolean ? newBoard[brocation.row][brocation.col] = './images/dudeRight.png' : 
            newBoard[brocation.row][brocation.col] = './images/dudeLeft.png';
        
        setFullBoard(newBoard);
    };

/* //////////////////////  MOVE  ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////*/
    const move = (event) => {
        event.preventDefault();
        let newBoard = fullBoard.slice();

        if (pswdScreen) {
            if (start) {
                setPswdScreen(false);
                setPandaScreen(true);
            }
            return;
        }

        if (pandaScreen) {
            if (start) {
                setPandaScreen(false);
            }

            if (playingRace) {
                setStart(false);
            }

            return;
        }
        
        if (start) {
            setStart(false);
        }

        if (!playingRace && start) {
            setStart(false);
            return;
        } 


        if (event.key === 'r') {
            mountLevel();
            return;
        }

        if (event.shiftKey === true) {
            moveView(event);
            return;
        } else if (event.key === 'ArrowLeft') {
            if (broRight) {
                broDirection(false);
            }
            
            //if left is empty or door, and block on head, and higher than 2nd to last row.
            if ((newBoard[brocation.row][brocation.col - 1] === './images/empty.png' ||
                newBoard[brocation.row][brocation.col - 1] === './images/door.png') &&
                newBoard[brocation.row - 1][brocation.col] === './images/block.png') {
                    
                // if left/down space empty, fall down
                if (newBoard[brocation.row + 1][brocation.col - 1] === './images/empty.png') {
                    let newBrocation = {
                        col: brocation.col - 1
                    }
                    
                    for (let i = brocation.row + 2; i < newBoard.length; i++) {
                        if (newBoard[i][brocation.col - 1] === './images/block.png' ||
                            newBoard[i][brocation.col - 1] === './images/brick.png') {
                            newBoard[i - 1][brocation.col - 1] = './images/dudeLeft.png';
                            newBrocation.row = i - 1;
                            break;
                        }
                    }
                    newBoard[newBrocation.row - 1][newBrocation.col] = './images/block.png';
                    newBoard[brocation.row - 1][brocation.col] = './images/empty.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png';

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }

                    if (brocation.col - 1 <= boardLocation.col + 8 && 
                        boardLocation.col !== 0) {
                        newBoardLocation.col--;
                    }

                    setBoardLocation(newBoardLocation);
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);

                //moves but doesn't fall
                } else {
                    newBoard[brocation.row][brocation.col - 1] = './images/dudeLeft.png'
                    newBoard[brocation.row - 1][brocation.col - 1] = './images/block.png'
                    newBoard[brocation.row][brocation.col] = './images/empty.png'
                    newBoard[brocation.row - 1][brocation.col] = './images/empty.png'

                    let newBrocation = {
                        row: brocation.row,
                        col: brocation.col - 1
                    }

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }

                    if (brocation.col - 1 <= boardLocation.col + 8 &&
                        boardLocation.col !== 0) {
                        newBoardLocation.col--;
                    }

                    setBoardLocation(newBoardLocation);
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);
                }
                //if left space is empty or a door, and no block is above. 
            } else if (newBoard[brocation.row][brocation.col - 1] === './images/empty.png' ||
                newBoard[brocation.row][brocation.col - 1] === './images/door.png') {
                    // if left/down space empty, fall down
                if (newBoard[brocation.row + 1][brocation.col - 1] === './images/empty.png') {
                    let newBrocation = {
                        col: brocation.col - 1
                    }
                    
                    for (let i = brocation.row + 2; i < newBoard.length; i++) {
                        if (newBoard[i][brocation.col - 1] === './images/block.png' ||
                            newBoard[i][brocation.col - 1] === './images/brick.png') {
                            newBoard[i - 1][brocation.col - 1] = './images/dudeLeft.png';
                            newBrocation.row = i - 1;
                            break;
                        }
                    }

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }
                    if (brocation.col - 1 <= boardLocation.col + 8 &&
                        boardLocation.col !== 0) {

                        newBoardLocation.col--;
                    }

                    newBoard[brocation.row][brocation.col] = './images/empty.png';

                    setBoardLocation(newBoardLocation);
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);

                } else {
                    newBoard[brocation.row][brocation.col - 1] = './images/dudeLeft.png'
                    newBoard[brocation.row][brocation.col] = './images/empty.png'

                    let newBrocation = {
                        row: brocation.row,
                        col: brocation.col - 1
                    }

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }
                    if (brocation.col - 1 <= boardLocation.col + 8 &&
                        boardLocation.col !== 0) {
                        newBoardLocation.col--;
                    }

                    setBoardLocation(newBoardLocation);
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);

                    }
                }
            } else if (event.key === 'ArrowRight') {
            if (!broRight) {
                broDirection(true);
            }

                //if right empty, or door and carrying block, move both right
            if ((newBoard[brocation.row][brocation.col + 1] === './images/empty.png' || 
                newBoard[brocation.row][brocation.col + 1] === './images/door.png') && 
                newBoard[brocation.row - 1][brocation.col] === './images/block.png') {
                
    
                // if left/down space empty, fall down
                if (newBoard[brocation.row + 1][brocation.col + 1] === './images/empty.png') {
                    let newBrocation = {
                        col: brocation.col + 1
                    };

                    for (let i = brocation.row + 2; i < newBoard.length; i++) {
                        if (newBoard[i][brocation.col + 1] === './images/brick.png' || 
                            newBoard[i][brocation.col + 1] === './images/block.png') {
                            newBoard[i - 1][brocation.col + 1] = './images/dudeRight.png';
                            newBrocation.row = i - 1;
                            break;
                        }
                    }
                    newBoard[newBrocation.row - 1][newBrocation.col] = './images/block.png';
                    newBoard[brocation.row - 1][brocation.col] = './images/empty.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png';

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    };
                    if (brocation.col + 1 >= boardLocation.col + 9 &&
                        boardLocation.col + 17 !== fullBoard[0].length - 1) {
                        newBoardLocation.col++;
                    }

                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);

                    //moves but doesn't fall
                } else {
                    newBoard[brocation.row][brocation.col + 1] = './images/dudeRight.png';
                    newBoard[brocation.row - 1][brocation.col + 1] = './images/block.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png';
                    newBoard[brocation.row - 1][brocation.col] = './images/empty.png';

                    let newBrocation = {
                        row: brocation.row,
                        col: brocation.col + 1
                    };

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    };
                    if (brocation.col + 1 >= boardLocation.col + 9 &&
                        boardLocation.col + 17 !== fullBoard[0].length - 1) {
                        newBoardLocation.col++;
                    }

                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);
                }
      
                //if right empty or door, move bro
            } else if (newBoard[brocation.row][brocation.col + 1] === './images/empty.png' ||
                newBoard[brocation.row][brocation.col + 1] === './images/door.png') {
                
                // if row/down space empty, fall down
                if (newBoard[brocation.row + 1][brocation.col + 1] === './images/empty.png') {
                    let newBrocation = {
                        col: brocation.col + 1
                    };

                    for (let i = brocation.row + 2; i < newBoard.length; i++) {
                        if (newBoard[i][brocation.col + 1] === './images/brick.png' ||
                            newBoard[i][brocation.col + 1] === './images/block.png') {
                            newBoard[i - 1][brocation.col + 1] = './images/dudeRight.png';
                            newBrocation.row = i - 1;
                            break;
                        }
                    }
                    newBoard[brocation.row][brocation.col] = './images/empty.png';

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    };
                    if (brocation.col + 1 >= boardLocation.col + 9 &&
                        boardLocation.col + 17 !== fullBoard[0].length - 1) {
                        newBoardLocation.col++;
                    }

                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);

                } else {
                    newBoard[brocation.row][brocation.col + 1] = './images/dudeRight.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png';
                    let newBrocation = {
                        row: brocation.row,
                        col: brocation.col + 1
                    };

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    };
                    if (brocation.col + 1 >= boardLocation.col + 9 &&
                        boardLocation.col + 17 !== fullBoard[0].length - 1) {
                        newBoardLocation.col++;
                    }
                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);
                }
            } 
        } else if (event.key === 'ArrowUp') {
            if (broRight) {
                let rightBlock = newBoard[brocation.row][brocation.col + 1] === './images/brick.png' ||
                    newBoard[brocation.row][brocation.col + 1] === './images/block.png';
                let rightUpEmpty = newBoard[brocation.row - 1][brocation.col + 1] === './images/empty.png' || newBoard[brocation.row - 1][brocation.col + 1] === './images/door.png';
                let holdingBlock = newBoard[brocation.row - 1][brocation.col] === './images/block.png';

                //if block on right, empty space above, and block above, move up
                if (rightBlock && rightUpEmpty && holdingBlock) { 
                    newBoard[brocation.row - 1][brocation.col + 1] = './images/dudeRight.png';
                    newBoard[brocation.row - 2][brocation.col + 1] = './images/block.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png'
                    newBoard[brocation.row - 1][brocation.col] = './images/empty.png'
                    let newBrocation = {
                        row: brocation.row - 1,
                        col: brocation.col + 1
                    }

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }
                    if (brocation.col + 1 >= boardLocation.col + 9 &&
                        boardLocation.col + 17 !== fullBoard[0].length - 1) {
                        newBoardLocation.col++;
                    }

                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);
                //if block on right and empty space or door above, move up
                } else if (rightBlock && rightUpEmpty) {
                    newBoard[brocation.row - 1][brocation.col + 1] = './images/dudeRight.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png'
                    let newBrocation = {
                        row: brocation.row - 1,
                        col: brocation.col + 1
                    }

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }
                    if (brocation.col + 1 >= boardLocation.col + 9 &&
                        boardLocation.col + 17 !== fullBoard[0].length - 1) {
                        newBoardLocation.col++;
                    }

                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);
                }
            } else if (!broRight) {
                let leftBlock = newBoard[brocation.row][brocation.col - 1] === './images/brick.png' ||
                    newBoard[brocation.row][brocation.col - 1] === './images/block.png';
                let leftUpEmpty = newBoard[brocation.row - 1][brocation.col - 1] === './images/empty.png' || newBoard[brocation.row - 1][brocation.col - 1] === './images/door.png';
                let holdingBlock = newBoard[brocation.row - 1][brocation.col] === './images/block.png';

                //if block on left, empty space above, and block above, move up
                if (leftBlock && leftUpEmpty && holdingBlock) {
                    newBoard[brocation.row - 1][brocation.col - 1] = './images/dudeLeft.png';
                    newBoard[brocation.row - 2][brocation.col - 1] = './images/block.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png'
                    newBoard[brocation.row - 1][brocation.col] = './images/empty.png'
                    let newBrocation = {
                        row: brocation.row - 1,
                        col: brocation.col - 1
                    }

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }
                    if (brocation.col - 1 <= boardLocation.col + 8 &&
                        boardLocation.col !== 0) {
                        newBoardLocation.col--;
                    }

                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);
                    //if block on left and empty space above, move up
                } else if (leftBlock && leftUpEmpty) {
                    newBoard[brocation.row - 1][brocation.col - 1] = './images/dudeLeft.png';
                    newBoard[brocation.row][brocation.col] = './images/empty.png'
                    let newBrocation = {
                        row: brocation.row - 1,
                        col: brocation.col - 1
                    }

                    let newBoardLocation = {
                        row: boardLocation.row,
                        col: boardLocation.col
                    }
                    if (brocation.col - 1 <= boardLocation.col + 8 &&
                        boardLocation.col !== 0) {
                        newBoardLocation.col--;
                    }

                    setBoardLocation(newBoardLocation)
                    setFullBoard(newBoard);
                    setBrocation(newBrocation);
                }
            }
        } else if (event.key === 'ArrowDown') {
            if (broRight) {
                //if block on right and nothing on top || on top of block pick up
                if (newBoard[brocation.row][brocation.col + 1] === './images/block.png' &&
                    newBoard[brocation.row - 1][brocation.col] === './images/empty.png' &&
                    newBoard[brocation.row - 1][brocation.col + 1] === './images/empty.png') {
                    newBoard[brocation.row - 1][brocation.col] = './images/block.png'
                    newBoard[brocation.row][brocation.col + 1] = './images/empty.png'
                    setFullBoard(newBoard);
                    //if block on top, and nothing on right, put down
                } else if (newBoard[brocation.row - 1][brocation.col] === './images/block.png') {
                    //if brick, block, or door in the way, dont put down
                    if (newBoard[brocation.row][brocation.col + 1] === './images/brick.png' ||
                    newBoard[brocation.row][brocation.col + 1] === './images/block.png' ||
                    newBoard[brocation.row][brocation.col + 1] === './images/door.png') {
                        //place on ledge if space is empty
                        if (newBoard[brocation.row - 1][brocation.col + 1] === './images/empty.png') {
                            newBoard[brocation.row - 1][brocation.col + 1] = './images/block.png';
                            newBoard[brocation.row - 1][brocation.col] = './images/empty.png';
                            setFullBoard(newBoard);
                        }
                        return;
                    }
                    let blockLocation = {
                        col: brocation.col + 1
                    }

                    for (let i = brocation.row; i < newBoard.length; i++) {
                        if (newBoard[i][brocation.col + 1] !== './images/empty.png') {
                            blockLocation.row = i - 1;
                            break;
                        }
                    }
                    newBoard[brocation.row - 1][brocation.col] = './images/empty.png';

                    newBoard[blockLocation.row][blockLocation.col] = './images/block.png'

                    setFullBoard(newBoard);
                }
                //if block on left and nothing on top || on block, pick up
            } else if (newBoard[brocation.row][brocation.col - 1] === './images/block.png' &&
                newBoard[brocation.row - 1][brocation.col] === './images/empty.png' &&
                newBoard[brocation.row - 1][brocation.col - 1] === './images/empty.png') {
                newBoard[brocation.row - 1][brocation.col] = './images/block.png'
                newBoard[brocation.row][brocation.col - 1] = './images/empty.png'
                setFullBoard(newBoard);

                //if block on top, and nothing on left, put down
            } else if (newBoard[brocation.row - 1][brocation.col] === './images/block.png') {
                
                if (newBoard[brocation.row][brocation.col - 1] === './images/brick.png' ||
                    newBoard[brocation.row][brocation.col - 1] === './images/block.png' ||
                    newBoard[brocation.row][brocation.col - 1] === './images/door.png') {
                    //place on ledge if space is empty
                    if (newBoard[brocation.row - 1][brocation.col - 1] === './images/empty.png') {
                        newBoard[brocation.row - 1][brocation.col - 1] = './images/block.png';
                        newBoard[brocation.row - 1][brocation.col] = './images/empty.png';
                        setFullBoard(newBoard);
                    }
                    return;
                }
                let blockLocation = {
                    col: brocation.col - 1
                };

                for (let i = brocation.row; i < newBoard.length; i++) {
                    if (newBoard[i][brocation.col - 1] !== './images/empty.png') {
                        blockLocation.row = i - 1;
                        break;
                    }
                }
                newBoard[brocation.row - 1][brocation.col] = './images/empty.png';

                newBoard[blockLocation.row][blockLocation.col] = './images/block.png'

                setFullBoard(newBoard);

            }
        } else {
            return;
        }
    };

/* ///////////////////////  VIEW   ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////*/

    const moveView = (event) => {
        if (!shiftDown) {
            let location = {
                row: boardLocation.row,
                col: boardLocation.col
            };
            
            setViewLocation(location)
        }
        
        if (event.key === 'ArrowLeft') {
            if (viewLocation.col === 0) {
                return;
            }

            let location = {
                row: viewLocation.row,
                col: viewLocation.col - 1
            };
            let newView = [];

            for (let i = viewLocation.row; i < viewLocation.row + 12; i++) {
                newView.push(fullBoard[i].slice(viewLocation.col - 1, viewLocation.col + 17));
            }

            setBoardView(newView);
            setViewLocation(location);
            setShiftDown(true);

        } else if (event.key === 'ArrowRight') {
            if (viewLocation.col + 17 === fullBoard[0].length - 1) {
                return;
            }
            let location = {
                row: viewLocation.row,
                col: viewLocation.col + 1
            };
            let newView = [];

            for (let i = viewLocation.row; i < viewLocation.row + 12; i++) {
                newView.push(fullBoard[i].slice(viewLocation.col + 1, viewLocation.col + 19));
            }

            setBoardView(newView);
            setViewLocation(location);
            setShiftDown(true);

        } 
        else if (event.key === 'ArrowUp') {
            if (viewLocation.row === 0) {
                return;
            }
            let location = {
                row: viewLocation.row - 1,
                col: viewLocation.col
            };
            let newView = [];

            for (let i = viewLocation.row - 1; i < viewLocation.row + 11; i++) {
                newView.push(fullBoard[i].slice(viewLocation.col, viewLocation.col + 18));
            }

            setBoardView(newView);
            setViewLocation(location);
            setShiftDown(true);

        } else if (event.key === 'ArrowDown') {
            if (viewLocation.row + 11 === fullBoard.length - 1) {
                return;
            }
            let location = {
                row: viewLocation.row + 1,
                col: viewLocation.col
            }

            let newView = [];

            for (let i = viewLocation.row + 1; i < viewLocation.row + 13; i++) {
                newView.push(fullBoard[i].slice(viewLocation.col, viewLocation.col + 18));
            }

            setBoardView(newView);
            setViewLocation(location);
            setShiftDown(true);
        }
    };

    const checkWin = () => {
        if (brocation.row === doorLocation.row && brocation.col === doorLocation.col) {
            setLevel(level + 1)
        }
    };

    return (
        <div className="main-container">
            <div className="shift-placeholder"></div>
            <div className="viewPort" >
                <div id="quadGameBoard">
                    {pswdScreen && <Password password={password} setPassword={(e) => setPassword(e.target.value)} submitPassword={submitPassword}/>}
                    {pandaScreen && <PandaRace submitRaceName={submitRaceName} setRaceName={(e) => setRaceName(e.target.value)} raceName={raceName} highScore={highScore[1]}/>}
                    {start && !pandaScreen && !playingRace && <Popup currentlvl={level + 1} level={levels[levelArray[level]]} />}
                    {boardView.map((row, i) => {
                        return (
                            <Row 
                                row={row}
                                rowIndex={i}
                                key={i}
                            />
                        );
                    })}
                </div>
                <div id="home_container">
                    {level === 4 ? <p id="timer_display">The End</p> : <p id="timer_display">{'Lvl: ' + (level + 1)}</p>}
                    {playingRace && <p id="timer_display">{'Timer ' + time[0] + ':' + time[1]}</p>}
                    <NavLink to='/'>
                        <button id="homebutton">Home</button>
                    </NavLink>
                </div>
                {level === 4 ? 
                <div style={{width: '334px', margin: '0 50px'}}>
                    <div className="highScoreListItemContainer">
                        <p className="highScoreListName" style={{ fontWeight: 'bold', width: '100%', textAlign: 'left', fontSize: '20px' }}>The Great Panda Race High Scores:</p>
                        <p className="highScoreListName" style={{ fontWeight: 'bold' }}>Name:</p>
                        <p className="highScoreListTime" style={{ fontWeight: 'bold' }}>Time:</p>
                    </div>
                    {highScore[0].map((el, index) => {
                        return (
                            <div key={index} className="highScoreListItemContainer">
                                <p className="highScoreListName">{[index + 1].toString() + '. ' + el.name}</p>
                                <p className="highScoreListTime">{el.time}</p>
                            </div>
                        );
                    })}
                </div>
                : <div style={{ width: '414px', margin: '0 0 0 20px' }}>
                    <p className="instructTitles">Objective:</p>
                    <ul>
                        <li>
                            Move Quadrilateral Bro to the door to complete each level
                        </li>
                        <li>
                            Keep track of the lvl password to skip ahead after refresh
                        </li>
                    </ul>
                    <p className="instructTitles">The Great Panda Race:</p>
                    <ul>
                        <li>
                            An optional gameplay feature that lets users race against <br></br> 
                            previous players 
                        </li>
                        <li>
                            Watch the timer and race through 4 levels
                        </li>
                        <li>
                            Enter your name and press <strong>Enter</strong> to play
                        </li>
                    </ul>

                    <p className="instructTitles">Controls:</p>
                    <ul>
                        <li>Use <strong>Left/Right</strong> arrow keys to move left or right. These <br></br> 
                            keys will only turn Quadrilateral Bro if he is trapped in a <br></br>
                            space with no open position to the left or right
                        </li>
                        <li>Use <strong>Down</strong> arrow key to lift or place a block up or down <br></br>
                            You can stack block objects two blocks high
                        </li>
                        <li>
                            Use <strong>Up</strong> arrow key to step up one level
                        </li>
                        <li>
                            Use <strong>Shift</strong> + <strong>Arrow Keys</strong> look ahead and explore the level
                        </li>
                        <li>
                            Use <strong>R</strong> key to restart the current level
                        </li>
                    </ul>
                </div>}
            </div>
            <div className="mobile-buttons-placeholder"></div>
            {isMobile && <MobileButtons shiftDown={shiftDown} setShiftDown={setShiftDown}/>}
        </div>
    );
};

export default App;