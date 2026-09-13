export type Player = 'monkey' | 'alligator';
export type Piece = Player | null;
export type Board = Piece[][];
export type Move = { from: [number, number]; to: [number, number] };
export const BOARD_SIZE = 3;
export const otherPlayer = (player: Player): Player => player === 'monkey' ? 'alligator' : 'monkey';

export function createInitialBoard(): Board {
  return [['alligator', 'alligator', 'alligator'], [null, null, null], ['monkey', 'monkey', 'monkey']];
}

export function isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: Board): boolean {
  // Check both coordinates before indexing the board, including empty source cells.
  if (![fromRow, fromCol, toRow, toCol].every(n => Number.isInteger(n) && n >= 0 && n < BOARD_SIZE)) return false;
  const piece = board[fromRow][fromCol];
  if (piece === null) return false;
  const direction = piece === 'monkey' ? -1 : 1;
  if (toRow !== fromRow + direction) return false;
  const target = board[toRow][toCol];
  return fromCol === toCol ? target === null : Math.abs(toCol - fromCol) === 1 && target === otherPlayer(piece);
}

export function getAllPossibleMoves(player: Player, board: Board): Move[] {
  const moves: Move[] = [];
  const direction = player === 'monkey' ? -1 : 1;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== player) continue;
      for (let offset = -1; offset <= 1; offset++) {
        if (isValidMove(row, col, row + direction, col + offset, board)) {
          moves.push({ from: [row, col], to: [row + direction, col + offset] });
        }
      }
    }
  }
  return moves;
}

export function applyMove(board: Board, move: Move): Board {
  if (!isValidMove(...move.from, ...move.to, board)) throw new Error('Invalid move');
  const next = board.map(row => [...row]);
  next[move.to[0]][move.to[1]] = next[move.from[0]][move.from[1]];
  next[move.from[0]][move.from[1]] = null;
  return next;
}

export function checkWinner(board: Board, nextPlayer: Player): Player | null {
  if (board[0].includes('monkey')) return 'monkey';
  if (board[BOARD_SIZE - 1].includes('alligator')) return 'alligator';
  if (!board.some(row => row.includes('monkey'))) return 'alligator';
  if (!board.some(row => row.includes('alligator'))) return 'monkey';
  // Only the player whose turn starts now can lose for having no legal move.
  if (getAllPossibleMoves(nextPlayer, board).length === 0) return otherPlayer(nextPlayer);
  return null;
}

export function chooseComputerMove(board: Board): Move | null {
  if (checkWinner(board, 'alligator')) return null;
  const moves = getAllPossibleMoves('alligator', board);
  // Prefer an immediate win, then a capture, then a legal forward move.
  return moves.find(move => checkWinner(applyMove(board, move), 'monkey') === 'alligator')
    ?? moves.find(move => board[move.to[0]][move.to[1]] === 'monkey')
    ?? moves[0] ?? null;
}
