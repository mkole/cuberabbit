import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import useGame from "../stores/useGame";
import { BOARD_FACTOR } from "../utils/constants";

interface PlayerProps {
  positionX: number;
  positionY?: number;
  positionZ: number;
  squaresMap: number[][];
}

export default function Player({
  positionX,
  positionZ,
  squaresMap,
}: PlayerProps) {
  const setPlayerPositionX = useGame((state) => state.setPlayerPositionX);
  const setPlayerPositionZ = useGame((state) => state.setPlayerPositionZ);
  const addMove = useGame((state) => state.addMove);
  const phase = useGame((state) => state.phase);
  const start = useGame((state) => state.start);

  const rabbitModel = useGLTF("./models/r.exs");
  const rabbit = useRef<THREE.Mesh>(null);
  const [subscribeKeys] = useKeyboardControls();

  const initialPositionX = positionX * BOARD_FACTOR;
  const initialPositionZ = positionZ * BOARD_FACTOR;

  useEffect(() => {
    if (phase !== "ended") {
      const movePlayer = (dx: number, dz: number) => {
        console.log("MOVEPLAYER positionX: " + positionX);
        console.log("MOVEPLAYER positionZ: " + positionZ);

        let newPositionX, newPositionZ;

        if (rabbit.current) {
          newPositionX = rabbit.current.position.x / BOARD_FACTOR + dx;
          newPositionZ = rabbit.current.position.z / BOARD_FACTOR + dz;
        }

        console.log("MOVEPLAYER NEW positionX: " + newPositionX);
        console.log("MOVEPLAYER  NEW positionZ: " + newPositionZ);

        if (
          newPositionX !== undefined &&
          newPositionZ !== undefined &&
          newPositionX >= 0 &&
          newPositionX < squaresMap[0].length &&
          newPositionZ >= 0 &&
          newPositionZ < squaresMap.length &&
          squaresMap[newPositionZ][newPositionX] !== 0
        ) {
          if (rabbit.current) {
            rabbit.current.position.x += dx * BOARD_FACTOR;
            rabbit.current.position.z += dz * BOARD_FACTOR;
          }
        }
      };

      const unsubscribeKeys = subscribeKeys(
        (state) => state,
        (value) => {
          if (rabbit.current) {
            if (value.forward) {
              // rabbit.current.position.x += BOARD_FACTOR;
              movePlayer(1, 0);
              rabbit.current.rotation.y = 0;
            }
            if (value.backward) {
              // rabbit.current.position.x -= BOARD_FACTOR;
              movePlayer(-1, 0);
              rabbit.current.rotation.y = Math.PI;
            }

            if (value.leftward) {
              // rabbit.current.position.z -= BOARD_FACTOR;
              movePlayer(0, -1);
              rabbit.current.rotation.y = Math.PI / 2;
            }

            if (value.rightward) {
              // rabbit.current.position.z += BOARD_FACTOR;
              movePlayer(0, 1);
              rabbit.current.rotation.y = -Math.PI / 2;
            }
          }
        }
      );

      const unsubscribeAny = subscribeKeys(() => {
        start();
      });

      return () => {
        unsubscribeKeys();
        unsubscribeAny();
      };
    }
  }, [phase]);

  // Player always faces forward when the game ends
  useEffect(() => {
    if (phase === "ended") {
      setTimeout(() => {
        if (rabbit.current) {
          rabbit.current.rotation.y = 0;
        }
      }, 500);
    }
  }, [phase]);

  useFrame(() => {
    if (rabbit.current) {
      const { x, z } = rabbit.current.position;
      const newX = Math.round(x / BOARD_FACTOR);
      const newZ = Math.round(z / BOARD_FACTOR);

      if (newX !== positionX) {
        setPlayerPositionX(newX);
        addMove();
        console.log("SET A NEW X: " + newX);
      }
      if (newZ !== positionZ) {
        setPlayerPositionZ(newZ);
        addMove();
        console.log("SET A NEW Z: " + newZ);
      }
    }
  });

  return (
    <>
      <primitive
        ref={rabbit}
        // onClick={() => console.log("Clicked!")}
        // onPointerEnter={() => console.log("Pointer entered")}
        // onPointerLeave={() => console.log("Pointer left")}
        object={rabbitModel.scene}
        scale={1}
        position={[initialPositionX, 0, initialPositionZ]}
      />
    </>
  );
}
