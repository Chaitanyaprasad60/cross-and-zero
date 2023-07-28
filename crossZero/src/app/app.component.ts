import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'crossZero';
  grid = ['', '', '', '', '', '', '', '', '']
  winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]
  huPlayer = 'X'
  aiPlayer = 'O'
  turn = this.huPlayer;
  gameOver = false;
  gameStatus = 'Game On ..';
  randonness = 0.1;
  depth = 7;

  humanMove(gridNumber: number) { //Only this function will be used to make Human Move.    

    if (this.turn !== this.huPlayer) return
    if(this.grid[gridNumber]!='') return
    this.makeMove(gridNumber, this.huPlayer); //Human makes the move
    setTimeout(()=>{
      if(Math.random() < this.randonness){
        this.randomMove()
      }
      else{
        this.bestMove()
      }    
    },900)    

  }
  resetGame() {
    this.gameStatus = "Game On ..."
    this.turn = this.huPlayer;
    this.gameOver = false;
    this.grid = ['', '', '', '', '', '', '', '', ''];    
  }

  randomMove(){
   
    let availSpots = this.emptySquares(); 
    if(availSpots.length == 0) return  
    let randomSpot = availSpots[Math.floor((Math.random() * (availSpots.length-1)))];
    console.log(randomSpot,availSpots)
    this.makeMove(randomSpot, this.aiPlayer);
  }

  computerFirst() {    
    this.resetGame();
    this.turn = this.aiPlayer;
    this.bestMove();

  }

  makeMove(gridNumber: number, player: string) {
    if (this.gameOver) return
    this.grid[gridNumber] = player;
    let result = this.checkWin(player); //Check for winner after every move

    if (result) {
      this.gameOver = true;
      this.gameStatus = result.player == this.huPlayer ? "You Win!!!" : "You Lose...";
    }
    else if (this.emptySquares().length == 0) {  //Check for game Tie
      this.gameOver = true;
      this.gameStatus = "It's a Tie";
    }
    else {
      this.turn = this.turn == this.aiPlayer ? this.huPlayer : this.aiPlayer;
    }
  }

  checkWin(player: String) {
    let plays = this.grid.reduce((a: number[], e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of this.winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  }

  emptySquares() {
    let emptyCells: number[] = [];
    this.grid.forEach((element, index) => {
      if (element == '') emptyCells.push(index)
    })
    return emptyCells;
  }

  bestMove() {
      if (this.gameOver) return  //If game is not yet over then AI makes the move
      let aiMove = this.minimax(this.aiPlayer).index;
      this.makeMove(aiMove, this.aiPlayer);  
  }

  minimax(player: string,depth=this.depth) {
    let availSpots = this.emptySquares();

    if (this.checkWin(this.huPlayer)) {
      return { index: -1, score: -10 };
    } else if (this.checkWin(this.aiPlayer)) {
      return { index: -1, score: 10 };
    } else if (availSpots.length === 0) {
      return { index: -1, score: 0 };
    }

    if (depth == 0) return { index: -1, score: 0 };
    let moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      let move = { "index": 0, "score": 0 };
      //move.index = this.grid[availSpots[i]];
      move.index = availSpots[i];
      this.grid[availSpots[i]] = player;

      if (player == this.aiPlayer) {
        var result = this.minimax(this.huPlayer,depth-1);
        move.score = result.score;
      } else {
        var result = this.minimax(this.aiPlayer,depth-1);
        move.score = result.score;
      }

      this.grid[availSpots[i]] = "";

      moves.push(move);
    }

    let bestMove: number = 0;
    let bestMoveArray:number[] = []; 
    if (player === this.aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }

      if(depth == this.depth) {
        moves.forEach((element,index)=>{
          if(element.score == bestScore) bestMoveArray.push(index)
        })
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
   
    if(depth==this.depth){
      return moves[this.randomInArray(bestMoveArray)];
    }
    return moves[bestMove];
  }

  private randomInArray(arr:number[]) {   //Get a elemet at random from the given array
    return arr[(Math.floor(Math.random() * arr.length))] | 0 ;
  }

}
