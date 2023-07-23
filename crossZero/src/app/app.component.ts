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
  gameStatus = 'Game Pending ..';

  humanMove(gridNumber: number) { //Only this function will be used to make Human Move.    

    if (this.turn !== this.huPlayer) return
    this.makeMove(gridNumber,this.huPlayer); //Human makes the move

    if(this.gameOver) return  //If game is not yet over then AI makes the move
    let aiMove = this.bestSpot();
    this.makeMove(aiMove,this.aiPlayer);  
  }

  makeMove(gridNumber:number,player:string){
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
    let emptyCells:number[] = [];
    this.grid.forEach((element,index)=>{
      if(element == '') emptyCells.push(index)
    })
    return emptyCells;
  }

  bestSpot() {
    return this.minimax(this.aiPlayer).index;
  }

  minimax(player:string) {
    let availSpots = this.emptySquares();

    if (this.checkWin(this.huPlayer)) {
      return { index:-1,score: -10 };
    } else if (this.checkWin(this.aiPlayer)) {
      return { index:-1,score: 10 };
    } else if (availSpots.length === 0) {
      return { index:-1,score: 0 };
    }
    let moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      let move = {"index":0,"score":0};
      //move.index = this.grid[availSpots[i]];
      move.index = availSpots[i];
      this.grid[availSpots[i]] = player;

      if (player == this.aiPlayer) {
        var result = this.minimax(this.huPlayer);
        move.score = result.score;
      } else {
        var result = this.minimax(this.aiPlayer);
        move.score = result.score;
      }

      this.grid[availSpots[i]] = "";

      moves.push(move);
    }

    let bestMove:number = 0;
    if (player === this.aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
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

    return moves[bestMove];
  }

}
