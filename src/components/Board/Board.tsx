import './Board.css'
import { socket } from '../../socket'
import type { UUID } from 'crypto'
import {
  Application,
  extend,
  // useTick
} from '@pixi/react'
import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets
} from 'pixi.js'
import { useEffect, useState, useMemo, useCallback } from 'react'
import GameObject from '../GameObject'

type GameObjectProps = {
  id: UUID,
  textureBasePath: string,
  textureOverPath?: string,
  x: number,
  y: number,
  anchor: number,
  scale: number,
  draggable?: boolean
}

type SocketGameObject = {
  id: UUID
  x: number
  y: number
}

extend({
  Container,
  Graphics,
  Sprite,
  Texture
})

const Board: React.FC = () => {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const [boardDimensions, setBoardDimensions] = useState<Array<number>>()
  const [gameObjects, setGameObjects] = useState<Array<GameObjectProps>>([])
  const [boardPos, setBoardPos] = useState<Array<number>>([0, 0])
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  })

  const scaleFactor = useMemo(() => {
    if (!boardDimensions) return 1
    return Math.min(
      windowDimensions.width / boardDimensions[0],
      windowDimensions.height / boardDimensions[1]
    )
  }, [windowDimensions.width, windowDimensions.height, boardDimensions])

  // const scaledBoardPos = useMemo(() => {
  //   if (!boardPos) return { x: 0, y: 0 }
  //   console.dir({ x: boardPos[0] * scaleFactor, y: boardPos[1] * scaleFactor }, { depth: null })
  //   return { x: boardPos[0] * scaleFactor, y: boardPos[1] * scaleFactor }
  // }, [boardPos, scaleFactor])

  const onBoardRefresh = useCallback((socketGameObjects: Record<UUID, SocketGameObject>) => {
    console.log('board refresh')

    const objKeys = Object.keys(socketGameObjects)

    const newGameObjProps: Array<GameObjectProps> = objKeys.map((objKey: string) => {
      const obj = socketGameObjects[objKey as UUID]
      const gameObjProps: GameObjectProps = {
        id: obj.id,
        x: obj.x,
        y: obj.y,
        textureBasePath: 'assets/token-mask.png',
        textureOverPath: 'assets/pawn.png',
        anchor: 0.5,
        scale: scaleFactor,
        draggable: true
      }

      return gameObjProps
    })

    setGameObjects(newGameObjProps)
  }, [scaleFactor])

  useEffect(() => {
    // console.dir(boardPos, { depth: null })
    setBoardPos((prev: Array<number>) => [prev[0], Math.floor(windowDimensions.height / 4)])
  }, [windowDimensions])

  useEffect(() => {
    socket.on('board-refresh', onBoardRefresh)

    const getBoardDimensions = async (): Promise<void> => {
      const boardTex: Texture = await Assets.load(
        'assets/board-generic.png'
      )
      setBoardDimensions([boardTex.width, boardTex.height])
    }

    const handleResize = (): void => {
      if (containerElement) {
        setWindowDimensions({
          width: containerElement.offsetWidth,
          height: containerElement.offsetHeight,
        })
      }

    }

    if (containerElement) {
      window.addEventListener('resize', handleResize)
    }
    getBoardDimensions()
    handleResize()
  }, [containerElement, onBoardRefresh, windowDimensions.height])

  return (
    <div id='game-board' ref={setContainerElement}>
      {containerElement && <Application
        resizeTo={containerElement}
        background={'#fff'}
        autoDensity={true}
        resolution={window.devicePixelRatio || 1}
      >
        {boardDimensions && (
          <GameObject
            id={crypto.randomUUID()}
            textureBasePath={'assets/board-generic.png'}
            x={boardPos[0]}
            y={boardPos[1]}
            zOverride={-9999}
            scale={scaleFactor}
          />
        )}

        {gameObjects.length > 0 && (
          gameObjects.map((gameObj) =>
            <GameObject
              id={gameObj.id}
              key={gameObj.id}
              textureBasePath={gameObj.textureBasePath}
              textureOverPath={gameObj.textureOverPath}
              x={boardPos[0] + (gameObj.x * scaleFactor)}
              y={boardPos[1] + (gameObj.y * scaleFactor)}
              scale={scaleFactor}
              draggable={true}
            />
          )
        )}
      </Application>}
    </div>
  )
}

export default Board