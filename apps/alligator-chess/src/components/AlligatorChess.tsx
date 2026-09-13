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

import { createInitialBoard, isValidMove, getAllPossibleMoves, checkWinner, applyMove, chooseComputerMove } from '@/lib/game';
import type { Player, Piece, Board } from '@/lib/game';

type GameState = {
  board: Board;
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  computerThinking: boolean;
};

const AlligatorChess = () => {
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

  // The timer always uses current state and is cancelled by a reset or unmount.
  useEffect(() => {
    if (gameState.currentPlayer !== 'alligator' || gameState.gameOver || !gameState.computerThinking) return;
    const timer = setTimeout(() => {
      setGameState(current => {
        if (current.currentPlayer !== 'alligator' || current.gameOver || !current.computerThinking) return current;
        const move = chooseComputerMove(current.board);
        const board = move ? applyMove(current.board, move) : current.board;
        const winner = move ? checkWinner(board, 'monkey') : 'monkey';
        return { board, currentPlayer: 'monkey', gameOver: winner !== null, winner, computerThinking: false };
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [gameState.currentPlayer, gameState.gameOver, gameState.computerThinking]);

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
        
        const winner = checkWinner(newBoard, 'alligator');
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: 'alligator',
          gameOver: winner !== null,
          winner,
          computerThinking: winner === null
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
  const getPieceEmoji = (piece: Piece): string => {
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
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm sm:text-base whitespace-nowrap ${gameState.currentPlayer === 'monkey' ? 'font-bold' : ''}`}>
              🐒 원숭이 (사용자)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm sm:text-base whitespace-nowrap ${gameState.currentPlayer === 'alligator' ? 'font-bold' : ''}`}>
              🐊 악어 (컴퓨터)
            </span>
          </div>
        </div>

        <p id="game-status" role="status" aria-live="polite" className="text-sm text-slate-600 mb-4 text-center">
          {gameState.gameOver ? '게임이 끝났습니다.' : gameState.computerThinking ? '악어가 이동할 곳을 고르고 있습니다.' : selectedPiece ? '파란 칸으로 이동할 수 있습니다.' : '원숭이를 선택해 이동하세요.'}
        </p>
        <div className="grid grid-cols-3 gap-1 mb-4" role="group" aria-label="3행 3열 게임판">
          {gameState.board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                aria-pressed={!!selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex}
                aria-describedby="game-status"
                aria-label={`${rowIndex + 1}행 ${colIndex + 1}열, ${cell === "monkey" ? "원숭이" : cell === "alligator" ? "악어" : "빈칸"}`}
                className={`w-16 h-16 border-2 flex items-center justify-center text-3xl
                  ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex
                    ? 'border-blue-500'
                    : 'border-gray-300'}
                  ${selectedPiece && getValidMoves(rowIndex, colIndex) ? 'bg-blue-200' : cell === 'monkey' ? 'bg-yellow-100' : cell === 'alligator' ? 'bg-green-100' : 'bg-white'}
                  ${gameState.currentPlayer === 'alligator' ? 'cursor-not-allowed' : ''}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={gameState.gameOver || gameState.currentPlayer === 'alligator'}
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

      <AlertDialog open={showRules} onOpenChange={setShowRules}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게임 규칙</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
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
              </div>
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