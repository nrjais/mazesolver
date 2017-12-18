let table = [];
let maze = [
  [0,0,0,1,0,0,0],
  [0,0,0,1,1,1,0],
  [0,0,1,1,0,0,0],
  [0,1,1,0,0,0,0],
  [0,1,0,0,1,0,0],
  [0,1,1,1,1,0,0],
  [0,1,0,0,0,0,0]
];

let start = [0,3];
let end = [6,1];

let className = {
  0:'closed',
  1:'open'
};


function createRows(table,rows,cols) {
  for (let i = 0; i < rows; i++) {
    let row = table.insertRow();
    insertColumns(row,cols);
  }
}

function insertColumns(row, cols) {
  for (let i = 0; i < cols; i++) {
    let td = document.createElement('td');
    td.className += "block";
    row.appendChild(td);
  }
}


let fillTable = function(){
  table.forEach((row,rIndex)=>{
    row.forEach((block,cIndex)=>{
      let value = maze[rIndex][cIndex];
      block.className = className[value];
    });
  });
};

let lastPath = [];

let updateTable = function(path,pathChanged){
  if(pathChanged){
    let changedPosCount = lastPath.length - (path.length - 1);
    let changedPos = lastPath.slice(-changedPosCount);
    changedPos.forEach((pos)=>{
      table[pos[0]][pos[1]].className = 'open';
    });
  }
  let pos = path.slice(-1)[0];
    table[pos[0]][pos[1]].className = 'path';
  lastPath = path;
}

let time = 2;
let timeouts = [];
let interval = 0;

let startSolving = function(){
  let timeStart = new Date().getTime();
  let mazeSolver = new MazeSolver(maze,start,end);
  table[start[0]][start[1]].className = "path";
  mazeSolver.solve((path,posChanged)=>{
    interval += time;
    let timeout = setTimeout(()=>updateTable(path,posChanged),interval);
    timeouts.push(timeout);
  });
  let totalTime = new Date().getTime() - timeStart;
  console.log('Solved in :' + totalTime/1000);
};

let redraw = function(list,nstart,nend){
  table = [];
  interval = 0;
  lastPath = [];
  timeouts.forEach(clearTimeout);
  timeouts = [];
  start = nstart;
  maze = list;
  end = nend;
  init();
}

let init = function(){
  document.getElementById('redrawButton').onclick = getDataAndInit;
  let tableDoc = document.getElementById('maze');
  tableDoc.lastChild.remove();
  createRows(tableDoc,maze.length,maze[0].length);
  table.push(...tableDoc.rows);
  table = table.map(row=>[...row.children]);
  fillTable();
  startSolving()
}

let to2D = function(list,rows,cols){
  let list2D = [];
  for(let row = 0;row < rows; row++){
    let rowData = list.slice(0,cols);
    list = list.slice(cols);
    list2D.push(rowData)
  }
  return list2D;
}

let getDataAndInit = function(){
  let list = document.getElementById('mazearray').value.split(',').map(Number);
  let startValue = document.getElementById('start').value.split(',').map(Number);
  let endValue = document.getElementById('end').value.split(',').map(Number);
  let rows = +document.getElementById('rows').value;
  let cols = +document.getElementById('cols').value;
  list = to2D(list,rows,cols);
  redraw(list,startValue,endValue);
}

window.onload = init;
