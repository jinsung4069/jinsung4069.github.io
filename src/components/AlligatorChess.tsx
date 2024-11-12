"use client"

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 타입 정의
type PieceType = 'monkey' | 'alligator' | null;
type Board = PieceType[][];
type GameState = {
  board: Board;
  currentPlayer: PieceType;
  gameOver: boolean;
  winner: PieceType;
  computerThinking: boolean;
};

const BOARD_SIZE = 3;

const AlligatorChess = () => {
  // 초기 보드 생성 함수
  const createInitialBoard = (): Board => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    // 원숭이는 아래쪽에 배치
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[BOARD_SIZE - 1][i] = 'monkey';
    }
    // 악어는 위쪽에 배치
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[0][i] = 'alligator';
    }
    return board;
  };

  // 상태 관리
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'monkey',
    gameOver: false,
    winner: null,
    computerThinking: false
  });

  // 이동 가능 여부 확인
  const isValidMove = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    board: Board
  ): boolean => {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];
    
    // 보드 범위 체크
    if (toRow < 0 || toRow >= BOARD_SIZE || toCol < 0 || toCol >= BOARD_SIZE) {
      return false;
    }

    if (piece === 'monkey') {
      // 원숭이는 위로 이동
      const isDiagonalAttack = Math.abs(fromCol - toCol) === 1 && fromRow - toRow === 1;
      const isForward = toCol === fromCol && toRow === fromRow - 1;

      if (isDiagonalAttack) {
        return targetPiece === 'alligator';
      }
      if (isForward) {
        return targetPiece === null;
      }
    } else {
      // 악어는 아래로 이동
      const isDiagonalAttack = Math.abs(fromCol - toCol) === 1 && toRow - fromRow === 1;
      const isForward = toCol === fromCol && toRow === fromRow + 1;

      if (isDiagonalAttack) {
        return targetPiece === 'monkey';
      }
      if (isForward) {
        return targetPiece === null;
      }
    }

    return false;
  };

  // 가능한 모든 이동 찾기
  const getAllPossibleMoves = (piece: PieceType, board: Board) => {
    const moves: { from: [number, number]; to: [number, number] }[] = [];
    
    for (let fromRow = 0; fromRow < BOARD_SIZE; fromRow++) {
      for (let fromCol = 0; fromCol < BOARD_SIZE; fromCol++) {
        if (board[fromRow][fromCol] === piece) {
          for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
            for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
              if (isValidMove(fromRow, fromCol, toRow, toCol, board)) {
                moves.push({
                  from: [fromRow, fromCol],
                  to: [toRow, toCol]
                });
              }
            }
          }
        }
      }
    }
    
    return moves;
  };

  // 컴퓨터의 최적 이동 찾기
  const findBestMove = (board: Board) => {
    // 1. 먼저 대각선 공격 가능한지 확인
    for (let fromRow = 0; fromRow < BOARD_SIZE; fromRow++) {
      for (let fromCol = 0; fromCol < BOARD_SIZE; fromCol++) {
        if (board[fromRow][fromCol] === 'alligator') {
          if (fromRow + 1 < BOARD_SIZE) {
            // 왼쪽 대각선 공격
            if (fromCol - 1 >= 0 && board[fromRow + 1][fromCol - 1] === 'monkey') {
              return {
                from: [fromRow, fromCol] as [number, number],
                to: [fromRow + 1, fromCol - 1] as [number, number]
              };
            }
            // 오른쪽 대각선 공격
            if (fromCol + 1 < BOARD_SIZE && board[fromRow + 1][fromCol + 1] === 'monkey') {
              return {
                from: [fromRow, fromCol] as [number, number],
                to: [fromRow + 1, fromCol + 1] as [number, number]
              };
            }
          }
        }
      }
    }

    // 2. 공격할 수 없다면 전진
    for (let fromRow = 0; fromRow < BOARD_SIZE; fromRow++) {
      for (let fromCol = 0; fromCol < BOARD_SIZE; fromCol++) {
        if (board[fromRow][fromCol] === 'alligator') {
          if (fromRow + 1 < BOARD_SIZE && board[fromRow + 1][fromCol] === null) {
            return {
              from: [fromRow, fromCol] as [number, number],
              to: [fromRow + 1, fromCol] as [number, number]
            };
          }
        }
      }
    }

    return null;
  };

  // 승자 확인
  const checkWinner = (board: Board): PieceType => {
    // 1. 상대방 진영 끝에 도달했는지 확인
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board[0][i] === 'monkey') return 'monkey';
      if (board[BOARD_SIZE-1][i] === 'alligator') return 'alligator';
    }

    // 2. 모든 말이 잡혔는지 확인
    let monkeyCount = 0;
    let alligatorCount = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === 'monkey') monkeyCount++;
        if (board[row][col] === 'alligator') alligatorCount++;
      }
    }

    if (monkeyCount === 0) return 'alligator';
    if (alligatorCount === 0) return 'monkey';

    // 3. 이동 가능한 수가 있는지 확인
    const monkeyMoves = getAllPossibleMoves('monkey', board);
    if (monkeyMoves.length === 0) return 'alligator';

    const alligatorMoves = getAllPossibleMoves('alligator', board);
    if (alligatorMoves.length === 0) return 'monkey';

    return null;
  };

  // 컴퓨터 이동
  const makeComputerMove = () => {
    const move = findBestMove(gameState.board);
    
    if (!move) {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        winner: 'monkey'
      }));
      return;
    }

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]];
    newBoard[move.from[0]][move.from[1]] = null;
    
    const winner = checkWinner(newBoard);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: 'monkey',
      gameOver: winner !== null,
      winner,
      computerThinking: false
    }));
  };

  // 컴퓨터 턴 처리
  useEffect(() => {
    if (gameState.currentPlayer === 'alligator' && !gameState.gameOver && gameState.computerThinking) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.computerThinking]);

  // 사용자 이동 처리
  const handleCellClick = (row: number, col: number) => {
    if (gameState.gameOver || gameState.currentPlayer === 'alligator') return;

    const piece = gameState.board[row][col];

    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      
      if (isValidMove(selectedRow, selectedCol, row, col, gameState.board)) {
        const newBoard = gameState.board.map(row => [...row]);
        newBoard[row][col] = newBoard[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = null;
        
        const winner = checkWinner(newBoard);
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: 'alligator',
          gameOver: winner !== null,
          winner,
          computerThinking: true
        }));
      }
      setSelectedPiece(null);
    } else if (piece === 'monkey') {
      setSelectedPiece([row, col]);
    }
  };

  // 게임 초기화
  const resetGame = () => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'monkey',
      gameOver: false,
      winner: null,
      computerThinking: false
    });
    setSelectedPiece(null);
  };

  // 말 이모지 반환
  const getPieceEmoji = (piece: PieceType): string => {
    if (piece === 'monkey') return '🐒';
    if (piece === 'alligator') return '🐊';
    return '';
  };

  // 유효한 이동 위치 확인
  const getValidMoves = (row: number, col: number): boolean => {
    if (!selectedPiece) return false;
    return isValidMove(selectedPiece[0], selectedPiece[1], row, col, gameState.board);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">악어 체스</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-lg ${gameState.currentPlayer === 'monkey' ? 'font-bold' : ''}`}>
              🐒 원숭이 (사용자)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${gameState.currentPlayer === 'alligator' ? 'font-bold' : ''}`}>
              🐊 악어 (컴퓨터)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 mb-4">
          {gameState.board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-16 h-16 border-2 flex items-center justify-center text-3xl
                  ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex
                    ? 'border-blue-500'
                    : 'border-gray-300'}
                  ${cell === 'monkey' ? 'bg-yellow-100' : cell === 'alligator' ? 'bg-green-100' : 'bg-white'}
                  ${selectedPiece && getValidMoves(rowIndex, colIndex) ? 'bg-blue-200' : ''}
                  ${gameState.currentPlayer === 'alligator' ? 'cursor-not-allowed' : ''}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={gameState.currentPlayer === 'alligator'}
              >
                {getPieceEmoji(cell)}
              </button>
            ))
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={() => setShowRules(true)}>게임 규칙</Button>
          <Button onClick={resetGame}>다시 시작</Button>
        </div>
      </Card>

      <AlertDialog open={showRules}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게임 규칙</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>• 3x3 게임판에서 진행되는 사용자와 컴퓨터의 대결입니다.</p>
              <p>• 각 플레이어는 3개의 말을 가지고 시작합니다.</p>
              <p>• 말은 앞으로만 이동할 수 있습니다.</p>
              <p>• 대각선으로만 상대방의 말을 잡을 수 있습니다.</p>
              <p>• 다음 경우에 승리합니다:</p>
              <ul className="list-disc pl-6">
                <li>한 말이 상대방 진영 끝에 도달</li>
                <li>상대방의 말을 모두 제거</li>
                <li>상대방이 더 이상 움직일 수 없는 경우</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowRules(false)}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={gameState.gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게임 종료!</AlertDialogTitle>
            <AlertDialogDescription>
              {gameState.winner === 'monkey' 
                ? '원숭이(사용자)가 승리했습니다!' 
                : getAllPossibleMoves('monkey', gameState.board).length === 0
                  ? '악어(컴퓨터)의 승리! 원숭이가 더 이상 이동할 수 없습니다.'
                  : '악어(컴퓨터)가 승리했습니다!'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>새 게임 시작</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlligatorChess;