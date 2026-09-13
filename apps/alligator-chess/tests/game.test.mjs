import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitialBoard, isValidMove, getAllPossibleMoves, applyMove, checkWinner, chooseComputerMove, otherPlayer} from '../src/lib/game.ts';

const board = rows => rows.map(row => [...row].map(cell => cell === 'm' ? 'monkey' : cell === 'a' ? 'alligator' : null));

test('initial game has three legal forward moves and no winner', () => {
  const initial = createInitialBoard();
  assert.equal(getAllPossibleMoves('monkey', initial).length, 3);
  assert.equal(checkWinner(initial, 'monkey'), null);
});
test('invalid coordinates and empty source squares cannot move or throw', () => {
  const initial = createInitialBoard();
  for (const coordinates of [[-1,0,0,0],[0,0,3,0],[3,0,2,0],[2,3,1,2],[1,0,2,0],[2,0,1.5,0]]) {
    assert.equal(isValidMove(...coordinates, initial), false);
  }
});
test('pieces advance into empty cells and capture only diagonally', () => {
  const state = board(['a..','.a.','mm.']);
  assert.equal(isValidMove(2,0,1,0,state),true);
  assert.equal(isValidMove(2,0,1,1,state),true);
  assert.equal(isValidMove(2,1,1,1,state),false);
  assert.equal(isValidMove(2,1,1,2,state),false);
  assert.equal(isValidMove(2,0,2,1,state),false);
});
test('moving does not mutate the previous board', () => {
  const initial=createInitialBoard();const snapshot=structuredClone(initial);
  const next=applyMove(initial,{from:[2,0],to:[1,0]});
  assert.deepEqual(initial,snapshot);
  assert.equal(next[1][0],'monkey');assert.equal(next[2][0],null);
  assert.throws(()=>applyMove(initial,{from:[2,0],to:[0,0]}),/Invalid move/);
});
test('when both sides are blocked, the side to move loses', () => {
  const state=board(['a.a','mam','.m.']);
  assert.equal(checkWinner(state,'alligator'),'monkey');
  assert.equal(checkWinner(state,'monkey'),'alligator');
});
test('a blocked monkey does not end the game before the alligator turn', () => {
  const state=board(['..a','aam','...']);
  assert.equal(checkWinner(state,'alligator'),null);
  assert.equal(checkWinner(state,'monkey'),'alligator');
});
test('reaching the last rank and capturing all opponents end the game', () => {
  assert.equal(checkWinner(board(['m.a','...','...']),'alligator'),'monkey');
  assert.equal(checkWinner(board(['...','m..','a..']),'monkey'),'alligator');
  assert.equal(checkWinner(board(['...','.m.','...']),'alligator'),'monkey');
});
test('the computer chooses an immediate win before a non-winning capture', () => {
  const state=board(['a..','a.m','.m.']);
  const move=chooseComputerMove(state);
  assert.ok(move);
  assert.equal(checkWinner(applyMove(state,move),'monkey'),'alligator');
});
test('every reachable state respects turn ownership, terminal status and legal computer moves', () => {
  const queue=[[createInitialBoard(),'monkey']];const seen=new Set();
  while(queue.length) {
    const [state,player]=queue.shift();const key=JSON.stringify([state,player]);
    if(seen.has(key))continue;seen.add(key);
    const winner=checkWinner(state,player);
    const moves=getAllPossibleMoves(player,state);
    if(winner)continue;
    assert.ok(moves.length>0);
    if(player==='alligator') {
      const move=chooseComputerMove(state);
      assert.ok(moves.some(candidate=>JSON.stringify(candidate)===JSON.stringify(move)));
    }
    for(const move of moves) {
      assert.equal(state[move.from[0]][move.from[1]],player);
      queue.push([applyMove(state,move),otherPlayer(player)]);
    }
  }
  assert.equal(seen.size,135);
});
