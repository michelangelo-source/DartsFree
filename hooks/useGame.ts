import { SingleScore, useGameStore, VisitScore } from "@/store/GameStore";
import { useTournamentStore } from "@/store/Tournament/TournamentStore";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";

const checkIsWin = (
  target: number,
  score: number,
  multiplier: number,
  lastDartMultiplier: number,
) => {
  if (score !== target) return false;
  return multiplier === lastDartMultiplier || lastDartMultiplier === 1;
};

const checkIsBust = (
  target: number,
  score: number,
  lastDartMultiplier: number,
) => {
  return target - score < lastDartMultiplier;
};

const getNumericScore = (score: SingleScore | null): number => {
  return typeof score === "number" ? score : 0;
};

export const useGame = () => {
  const { target, legsToWin, lastDartMultiplier, players, updatePlayer } =
    useGameStore();
  const { isStarted, setWinner } = useTournamentStore();

  const scorePlayer = useAudioPlayer(require("@/assets/sounds/ScoreSound.mp3"));
  const score3xPlayer = useAudioPlayer(
    require("@/assets/sounds/ScoreSound3x.mp3"),
  );
  const missPlayer = useAudioPlayer(require("@/assets/sounds/MissSound.mp3"));
  const bustPlayer = useAudioPlayer(require("@/assets/sounds/BustSound.mp3"));

  const playersListRef = useRef<FlatList>(null);

  const [finished, setFinished] = useState(false);
  const [bust, setBust] = useState(false);
  const [currentThrows, setCurrentThrows] = useState<VisitScore>({
    firstThrow: null,
    secondThrow: null,
    thirdThrow: null,
  });

  const isTurnOver = currentThrows.thirdThrow !== null || bust;

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (playersListRef.current) {
      playersListRef.current.scrollToIndex({
        index: currentPlayerIndex,
        animated: true,
      });
    }
  }, [currentPlayerIndex]);

  const classicScore = () => {
    if (currentThrows.firstThrow) return;
    if (target - currentPlayer.score <= 26) return;

    setCurrentThrows({
      firstThrow: 1,
      secondThrow: 5,
      thirdThrow: 20,
    });

    score3xPlayer.seekTo(0);
    score3xPlayer.play();

    updatePlayer({
      ...currentPlayer,
      dartsThrown: currentPlayer.dartsThrown + 3,
      score: currentPlayer.score + 26,
    });
  };

  const updateCurrentThrows = (scored: NonNullable<SingleScore>) => {
    setCurrentThrows((prev) => {
      if (!prev.firstThrow) return { ...prev, firstThrow: scored };
      if (!prev.secondThrow) return { ...prev, secondThrow: scored };
      if (!prev.thirdThrow) return { ...prev, thirdThrow: scored };
      return prev;
    });
  };

  const reverseScore = (score: SingleScore) => {
    updatePlayer({
      ...currentPlayer,
      dartsThrown: currentPlayer.dartsThrown - 1,
      score: currentPlayer.score - getNumericScore(score),
    });
  };

  const addScore = (score: SingleScore, multiplier: number) => {
    if (currentThrows.thirdThrow || score === null || bust) return;

    const scored = score !== "MISS" ? score * multiplier : "MISS";
    const updatedPlayer = {
      ...currentPlayer,
      dartsThrown: currentPlayer.dartsThrown + 1,
    };

    if (typeof scored === "number") {
      const potentialScore = currentPlayer.score + scored;

      if (checkIsWin(target, potentialScore, multiplier, lastDartMultiplier)) {
        updatedPlayer.score = potentialScore;
        updatedPlayer.history = [...updatedPlayer.history, currentThrows];

        updatePlayer(updatedPlayer);
        updateCurrentThrows(scored);
        setCurrentThrows({
          firstThrow: null,
          secondThrow: null,
          thirdThrow: null,
        });
        if (isStarted) {
          if (updatedPlayer.wins + 1 >= legsToWin) {
            setWinner((currentPlayerIndex + 1) as 1 | 2);
          }
        }
        setFinished(true);
        return;
      }

      if (checkIsBust(target, potentialScore, lastDartMultiplier)) {
        bustPlayer.seekTo(0);
        bustPlayer.play();
        setBust(true);
        const pointsToRevert =
          getNumericScore(currentThrows.firstThrow) +
          getNumericScore(currentThrows.secondThrow);
        updatedPlayer.score -= pointsToRevert;

        updatePlayer(updatedPlayer);
        updateCurrentThrows(scored);
        return;
      }

      updatedPlayer.score = potentialScore;
    } else {
      missPlayer.seekTo(0);
      missPlayer.play();
    }
    scorePlayer.seekTo(0);
    scorePlayer.play();
    updatePlayer(updatedPlayer);
    updateCurrentThrows(scored);
  };

  const undoLastThrow = () => {
    if (!currentThrows.firstThrow) {
      const previousPlayerIndex =
        (currentPlayerIndex - 1 + players.length) % players.length;
      const previousPlayer = players[previousPlayerIndex];

      if (!previousPlayer.history?.length) return;

      const updatedPreviousPlayer = {
        ...previousPlayer,
        history: [...previousPlayer.history],
      };
      const restoredThrows = updatedPreviousPlayer.history.pop();

      if (restoredThrows) {
        if (restoredThrows.isBust) setBust(true);
        updatePlayer(updatedPreviousPlayer);
        setCurrentThrows(restoredThrows);
        setCurrentPlayerIndex(previousPlayerIndex);
      }
      return;
    }

    if (bust) {
      const updatedPlayer = {
        ...currentPlayer,
        dartsThrown: currentPlayer.dartsThrown - 1,
      };
      const newThrows = { ...currentThrows };

      if (currentThrows.thirdThrow) {
        updatedPlayer.score +=
          getNumericScore(currentThrows.firstThrow) +
          getNumericScore(currentThrows.secondThrow);
        newThrows.thirdThrow = null;
      } else if (currentThrows.secondThrow) {
        updatedPlayer.score += getNumericScore(currentThrows.firstThrow);
        newThrows.secondThrow = null;
      } else {
        newThrows.firstThrow = null;
      }

      updatePlayer(updatedPlayer);
      setCurrentThrows(newThrows);
      setBust(false);
      return;
    }

    if (currentThrows.thirdThrow) {
      reverseScore(currentThrows.thirdThrow);
      setCurrentThrows({ ...currentThrows, thirdThrow: null });
    } else if (currentThrows.secondThrow) {
      reverseScore(currentThrows.secondThrow);
      setCurrentThrows({ ...currentThrows, secondThrow: null });
    } else if (currentThrows.firstThrow) {
      reverseScore(currentThrows.firstThrow);
      setCurrentThrows({ ...currentThrows, firstThrow: null });
    }
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);

    if (bust) {
      setBust(false);
      updatePlayer({
        ...currentPlayer,
        history: [...currentPlayer.history, { ...currentThrows, isBust: true }],
      });
    } else {
      const tmpThrows = {
        firstThrow: currentThrows.firstThrow ?? "MISS",
        secondThrow: currentThrows.secondThrow ?? "MISS",
        thirdThrow: currentThrows.thirdThrow ?? "MISS",
      };

      const missedThrowsCount = [
        currentThrows.firstThrow,
        currentThrows.secondThrow,
        currentThrows.thirdThrow,
      ].filter((throwVal) => !throwVal).length;

      updatePlayer({
        ...currentPlayer,
        dartsThrown: currentPlayer.dartsThrown + missedThrowsCount,
        history: [...currentPlayer.history, tmpThrows],
      });
    }

    setCurrentThrows({ firstThrow: null, secondThrow: null, thirdThrow: null });
  };

  return {
    target,
    currentPlayer,
    currentPlayerIndex,
    players,
    playersListRef,
    currentThrows,
    bust,
    isTurnOver,
    finished,
    classicScore,
    addScore,
    setCurrentPlayerIndex,
    undoLastThrow,
    nextPlayer,
    setFinished,
  };
};
