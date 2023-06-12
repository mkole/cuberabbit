import { useEffect } from "react";
import useGame from "../../stores/useGame";
import { LevelData } from "./levels";
import { BOARD_HEIGHT } from "../../utils/constants";
import { SquareColor, CollectibleColor } from "../../utils/enums";
import Square from "./Square";
import Collectible from "./Collectible";

interface LevelProps {
  level: LevelData;
}

export default function Level({ level }: LevelProps) {
  const setPlayerPositionX = useGame((state) => state.setPlayerPositionX);
  const setPlayerPositionZ = useGame((state) => state.setPlayerPositionZ);
  const setCollectibles = useGame((state) => state.setCollectibles);

  // Setters
  useEffect(() => {
    setPlayerPositionX(level.playerInitialPosition[0]);
    setPlayerPositionZ(level.playerInitialPosition[1]);
    setCollectibles(level.collectibles);
  }, []);

  // Squares
  const getSquareColor = (value: number) => {
    switch (value) {
      case 1:
        return SquareColor.purple;
      case 2:
        return SquareColor.fuchsia;
      case 3:
        return SquareColor.gray;
      case 4:
        return SquareColor.yellow;
      default:
        return SquareColor.purple;
    }
  };

  const squaresMap = level.squaresMap;
  const Squares = squaresMap.flatMap((row, rowIndex) =>
    row.map(
      (value, columnIndex) =>
        value !== 0 && (
          <Square
            key={`${rowIndex}-${columnIndex}`}
            color={getSquareColor(value)}
            positionX={columnIndex}
            positionY={BOARD_HEIGHT}
            positionZ={rowIndex}
          />
        )
    )
  );

  // Collectibles
  const getCollectibleColor = (value: number) => {
    switch (value) {
      case 1:
        return CollectibleColor.golden;
      case 2:
        return CollectibleColor.green;
      default:
        return CollectibleColor.golden;
    }
  };

  const collectiblesMap = level.collectiblesMap;
  const Collectibles = collectiblesMap.flatMap((row, rowIndex) =>
    row.map(
      (value, columnIndex) =>
        value !== 0 && (
          <Collectible
            key={`${rowIndex}-${columnIndex}`}
            color={getCollectibleColor(value)}
            positionX={columnIndex}
            positionY={0.2}
            positionZ={rowIndex}
          />
        )
    )
  );

  return (
    <>
      {Squares}
      {Collectibles}
    </>
  );
}
