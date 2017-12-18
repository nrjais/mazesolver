let MazeSolver = function(maze,start,end){
  this.maze = maze;
  this.start = start;
  this.end = end;
  this.prevPosition = [start[0]-1,start[1]];
  this.pathStack = [];
  this.path = [start];
  this.posNotChanged = true;
}

MazeSolver.prototype.solve = function(pathUpdater){
  let currentPos = this.start;
  while(!areEqualLists(currentPos,this.end)){
    let nextMove = this.getNextPossibleMove(currentPos);
    if(this.posNotChanged)
      this.prevPosition = currentPos;
    currentPos = nextMove;
    this.path.push(nextMove);
    pathUpdater && pathUpdater(this.path.slice(),!this.posNotChanged);
  };
  return this.path;
}

let areEqualLists = function(firstList,secondList){
  return firstList.length == secondList.length
  && firstList.every((element,index)=>secondList[index]==element);
};

let getAllMoves = function(currentPos,prevPosition){
  let directions = [[-1,0],[0,1],[0,-1],[1,0]];
  let allMoves = directions.map((dir)=>{
    return currentPos.map((pos,i)=>pos + dir[i]);
  });

  return allMoves.filter((move)=>
    !areEqualLists(move,prevPosition));
}

let getOpenMoves = function(maze,moves){
  return moves.filter(move=>{
    return maze[move[0]][move[1]] == 1;
  });
};

MazeSolver.prototype.getMovesFromLastChange = function(openMoves){
  let lastPos = this.pathStack.slice(-1)[0];
  if(lastPos.openMoves.length < 2){
    this.pathStack.pop();
  }
  this.path.splice(lastPos.pathIndex);
  this.posNotChanged = false;
  this.prevPosition = lastPos.prevPosition;
  return lastPos.openMoves.pop();
}

MazeSolver.prototype.saveCurrentState = function(currentPos,openMoves){
  let currentState = {
    pathIndex : this.path.length,
    prevPosition : currentPos,
    openMoves : openMoves
  }
  this.pathStack.push(currentState);
}

MazeSolver.prototype.getNextPossibleMove = function(currentPos){
  let moves = getAllMoves(currentPos,this.prevPosition);
  let openMoves = getOpenMoves(this.maze,moves);
  let move = 0;

  this.posNotChanged = true;
  if(openMoves.length == 0){
    move = this.getMovesFromLastChange(openMoves);
  }else if(openMoves.length == 1){
    move = openMoves.pop();
  } else {
    this.saveCurrentState(currentPos,openMoves);
    move = openMoves.pop();
  }
  return move;
}
