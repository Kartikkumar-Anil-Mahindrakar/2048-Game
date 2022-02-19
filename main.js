var leftKeyEnabled = true;
var rightKeyEnabled = true;
var upKeyEnabled = true;
var downKeyEnabled = true;
const score = document.getElementById('score');
const move = document.getElementById('move');
const backdrop = document.getElementById('backdrop');
const scoreBoard = document.getElementById('scoreBoard');

const colors = {
  '': '#E0E0DF',
  2: '#FFF8DC',
  4: '#FFEBCD',
  8: '#FFE4C4',
  16: '#FFDEAD',
  32: '#F5DEB3',
  64: '#DEB887',
  128: '#D2B48C',
  256: '#BC8F8F',
  512: '#F4A460',
  1024: '#DAA520',
  2048: '#CD853F',
};

toggleBackdropHandler = () => {
  backdrop.classList.add('visible');
};



class MainBoard{
  TrafficResolver(
    arrowDirection,
    leftMerging,
    rightMerging,
    topMerging,
    bottomMerging
  ) {
    if (arrowDirection === 'left') {
      if (leftMerging) {
        this.countEmptyBoxes();
      } else {
        // console.log('removed left Event Listener');
        leftKeyEnabled = false;
      }
      if ((rightMerging || this.blankBoxLenght > 0) && !rightKeyEnabled) {
        rightKeyEnabled = true;
        // console.log('added right Event Listener');
      } else if ((topMerging || this.blankBoxLenght > 0) && !upKeyEnabled) {
        upKeyEnabled = true;
        // console.log('added up Event Listener');
      } else if (
        (bottomMerging || this.blankBoxLenght > 0) &&
        !downKeyEnabled
      ) {
        downKeyEnabled = true;
        // console.log('added down Event Listener');
      }
    } else if (arrowDirection === 'right') {
      if (rightMerging) {
        this.countEmptyBoxes();
      } else {
        // console.log('removed right Event Listener');
        rightKeyEnabled = false;
      }
      if ((leftMerging || this.blankBoxLenght > 0) && !leftKeyEnabled) {
        leftKeyEnabled = true;
        // console.log('added left Event Listener');
      } else if ((topMerging || this.blankBoxLenght > 0) && !upKeyEnabled) {
        upKeyEnabled = true;
        // console.log('added up Event Listener');
      } else if (
        (bottomMerging || this.blankBoxLenght > 0) &&
        !downKeyEnabled
      ) {
        downKeyEnabled = true;
        // console.log('added down Event Listener');
      }
    } else if (arrowDirection === 'top') {
      if (topMerging) {
        this.countEmptyBoxes();
      } else {
        // console.log('removed up event Listener');
        upKeyEnabled = false;
      }
      if ((leftMerging || this.blankBoxLenght > 0) && !leftKeyEnabled) {
        leftKeyEnabled = true;
        // console.log('added left Event Listener');
      } else if (
        (rightMerging || this.blankBoxLenght > 0) &&
        !rightKeyEnabled
      ) {
        rightKeyEnabled = true;
        // console.log('added right Event Listener');
      } else if (
        (bottomMerging || this.blankBoxLenght > 0) &&
        !downKeyEnabled
      ) {
        downKeyEnabled = true;
        // console.log('added down Event Listener');
      }
    } else {
      if (bottomMerging) {
        this.countEmptyBoxes();
      } else {
        // console.log('removed down event Listener');
        downKeyEnabled = false;
      }
      if ((leftMerging || this.blankBoxLenght > 0) && !leftKeyEnabled) {
        leftKeyEnabled = true;
        // console.log('added left Event Listener');
      } else if (
        (rightMerging || this.blankBoxLenght > 0) &&
        !rightKeyEnabled
      ) {
        rightKeyEnabled = true;
        // console.log('added right Event Listener');
      } else if ((topMerging || this.blankBoxLenght > 0) && !upKeyEnabled) {
        upKeyEnabled = true;
        // console.log('added up Event Listener');
      }
    }
    // console.log('left Merging :', leftMerging, 'right Merging :', rightMerging);
    // console.log('up Merging', topMerging, 'down Merging', bottomMerging);
    if (!leftMerging && !rightMerging && !topMerging && !bottomMerging) {
      toggleBackdropHandler();
      this.gameResultHandler('lost');
    }
  }

  renderBoardFromTop(index, temList) {
    let i = 0;
    for (let j = 0; j < this.tr_s.length; j++) {
      const td = this.tr_s[j].children[index];
      if (i < temList.length) {
        td.textContent = temList[i];
        i++;
      } else {
        td.textContent = '';
      }
    }
  }

  renderBoardFromBottom(index, temList) {
    let i = temList.length - 1;
    for (let j = this.tr_s.length - 1; j >= 0; j--) {
      const td = this.tr_s[j].children[index];
      if (i >= 0) {
        td.textContent = temList[i];
        i--;
      } else {
        td.textContent = '';
      }
    }
  }

  renderBoardFromLeft(tr, temList) {
    let i = 0;
    for (const td of tr.children) {
      if (i < temList.length) {
        td.textContent = temList[i];
        i++;
      } else {
        td.textContent = '';
      }
    }
  }

  renderBoardFromRight(tr, temList) {
    let i = temList.length - 1;
    for (let index = tr.children.length - 1; index >= 0; index--) {
      const element = tr.children[index];
      if (i >= 0) {
        element.textContent = temList[i];
        i--;
      } else {
        element.textContent = '';
      }
    }
  }

  gameResultHandler = (result) => {
    document.removeEventListener('keydown', ArrowHandler);
    const resultDisplay = document.getElementById('result');
    resultDisplay.classList.add('visible');
    if (result === 'winner') {
      resultDisplay.innerHTML = `<h1>Winner</h1>`;
      resultDisplay.innerHTML += scoreBoard.innerHTML;
    } else {
      resultDisplay.innerHTML = `<h1>No More Moves Available</h1>`;
      resultDisplay.innerHTML += scoreBoard.innerHTML;
      resultDisplay.innerHTML += `<button id = "tryagain">Try Again</button>`;
      const tryAgainBtn = document.getElementById('tryagain');
  
      tryAgainBtn.addEventListener('click', () => {
        document.location.reload(true);
      });
    }
  };
}

class Board extends MainBoard{

  board = document.getElementById('board');
  tr_s = this.board.querySelectorAll('tr');
  blankBoxes = [];
  blankBoxLenght = 0;

  constructor(){
    super();
    this.countEmptyBoxes();
    this.countEmptyBoxes();
  }
  countEmptyBoxes() {
    for (const tr of this.tr_s) {
      for (const td of tr.children) {
        if (td.textContent === '') {
          this.blankBoxes.push(td);
          td.style.backgroundColor = colors[td.textContent];
        } else {
          td.style.backgroundColor = colors[parseInt(td.textContent)];
        }
      }
    }
    this.randomAddElement();
  }

  randomAddElement() {
    if (this.blankBoxes && this.blankBoxes.length > 0) {
      const randIndex = parseInt(Math.random() * this.blankBoxes.length);
      const td = this.blankBoxes[randIndex];
      td.textContent = 2;
      td.style.backgroundColor = colors[2];
      // console.log('added here :', td);
      this.blankBoxes = this.blankBoxes.filter((ele, idx) => {
        return idx !== randIndex;
      });
    }

    this.blankBoxLenght = this.blankBoxes.length;
    this.blankBoxes = [];
  }

  

  Merge(arrowDirection) {
    let leftMerging = false;
    let rightMerging = false;
    let topMerging = false;
    let bottomMerging = false;

    // this.listRow = [];
    // this.listCol = [];
    // console.log('called Merge');
    for (let i = 0; i < this.tr_s.length; i++) {
      let tr = this.tr_s[i];

      let temRowList = [];
      let temColList = [];
      let prevRowElement = 0;
      let prevColElement = 0;
      let space = 0;
      let reversespace = 0;
      let emptyBlockabove = 0;
      let emptyBlockBelow = 0;
      let reverseIndex = tr.children.length - 1;

      for (let j = 0; j < this.tr_s[i].children.length; j++) {
        //*****************************Row Merging************************************* */
        const tdRow = this.tr_s[i].children[j];
        if (tr.children[reverseIndex].textContent !== '') {
          if (reversespace > 0) {
            rightMerging = true;
          }
        } else {
          reversespace++;
        }
        if (tdRow.textContent !== '') {
          const num = parseInt(tdRow.textContent);
          if (num === 2048) {
            toggleBackdropHandler();
            this.gameResultHandler('winner');
          }
          if (space > 0) {
            leftMerging = true;
          }
          if (prevRowElement === 0) {
            prevRowElement = num;
          } else if (prevRowElement !== num) {
            temRowList.push(prevRowElement);
            prevRowElement = num;
          } else {
            leftMerging = true;
            rightMerging = true;
            temRowList.push(2 * prevRowElement);

            score.innerText = parseInt(score.innerHTML) + 2 * prevRowElement;
            prevRowElement = 0;
          }
        } else {
          space++;
        }

        //*****************************Column Merging************************************* */
        const tdCol = this.tr_s[j].children[i];
        if (this.tr_s[reverseIndex--].children[i].textContent !== '') {
          if (emptyBlockBelow > 0) {
            bottomMerging = true;
          }
        } else {
          emptyBlockBelow++;
        }
        if (tdCol.textContent !== '') {
          const num = parseInt(tdCol.textContent);
          if (emptyBlockabove) {
            topMerging = true;
          }
          if (prevColElement === 0) {
            prevColElement = num;
          } else if (prevColElement != num) {
            temColList.push(prevColElement);
            prevColElement = num;
          } else {
            topMerging = true;
            bottomMerging = true;
            temColList.push(2 * prevColElement);
            score.innerText = parseInt(score.innerHTML) + 2 * prevColElement;
            prevColElement = 0;
          }
        } else {
          emptyBlockabove++;
        }
      }
      if (prevRowElement !== 0) {
        temRowList.push(prevRowElement);
      }
      if (prevColElement != 0) {
        temColList.push(prevColElement);
      }
      if (arrowDirection === 'left') {
        this.renderBoardFromLeft(tr, temRowList);
      } else if (arrowDirection === 'right') {
        this.renderBoardFromRight(tr, temRowList);
      } else if (arrowDirection === 'top') {
        this.renderBoardFromTop(i, temColList);
      } else {
        this.renderBoardFromBottom(i, temColList);
      }

      // this.listRow.push(temRowList);
      // this.listCol.push(temColList);
    }

    this.TrafficResolver(
      arrowDirection,
      leftMerging,
      rightMerging,
      topMerging,
      bottomMerging
    );

    // console.log(this.list);
  }
 
}

const board = new Board();


ArrowHandler = (event) => {
  if (event.key === 'ArrowLeft' && leftKeyEnabled) {
    move.innerText = '⬅️';
    board.Merge('left');
  } else if (event.key === 'ArrowRight' && rightKeyEnabled) {
    board.Merge('right');
    move.innerText = '➡️';
  } else if (event.key === 'ArrowUp' && upKeyEnabled) {
    board.Merge('top');
    move.innerText = '⬆️';
  } else if (event.key === 'ArrowDown' && downKeyEnabled) {
    board.Merge('down');
    move.innerText = '⬇️';
  } else {
    move.innerText = '❌';
  }
};


document.addEventListener('keydown', ArrowHandler);
