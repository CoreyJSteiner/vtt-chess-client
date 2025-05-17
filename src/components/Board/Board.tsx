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
  texture: Texture,
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
  const [boardTexture, setBoardTexture] = useState<Texture>()
  const [pawnTexture, setPawnTexture] = useState<Texture>()
  const [gameObjects, setGameObjects] = useState<Array<GameObjectProps>>([])
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  })

  const scaleFactor = useMemo(() => {
    if (!boardTexture) return 1
    return Math.min(
      windowDimensions.width / boardTexture.width,
      windowDimensions.height / boardTexture.height
    )
  }, [windowDimensions.width, windowDimensions.height, boardTexture])

  const onBoardRefresh = useCallback((socketGameObjects: Record<UUID, SocketGameObject>) => {
    console.log('board refresh')
    if (!pawnTexture) return

    const objKeys = Object.keys(socketGameObjects)

    const newGameObjProps: Array<GameObjectProps> = objKeys.map((objKey: string) => {
      const obj = socketGameObjects[objKey as UUID]
      const gameObjProps: GameObjectProps = {
        id: obj.id,
        x: obj.x,
        y: obj.y,
        texture: pawnTexture,
        anchor: 0.5,
        scale: scaleFactor,
        draggable: true
      }

      return gameObjProps
    })

    setGameObjects(newGameObjProps)
  }, [pawnTexture, scaleFactor])

  useEffect(() => {
    socket.on('board-refresh', onBoardRefresh)

    const loadTexture = async (fileName: string, setTexture: (texture: Texture) => void) => {
      const tex: Texture = await Assets.load(fileName)
      tex.source.scaleMode = 'nearest'
      setTexture(tex)

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

      handleResize()

      return (): void => window.removeEventListener('resize', handleResize)
    };

    loadTexture('src/assets/board-generic.png', setBoardTexture)
    loadTexture('src/assets/pawn.png', setPawnTexture)
  }, [containerElement, onBoardRefresh])

  return (
    <div id='game-board' ref={setContainerElement}>
      {containerElement && <Application
        resizeTo={containerElement}
        background={'#fff'}
        autoDensity={true}
        resolution={window.devicePixelRatio || 1}
      >
        {boardTexture && (
          <GameObject
            id={crypto.randomUUID()}
            texture={boardTexture}
            x={windowDimensions.width / 2}
            y={windowDimensions.height / 2}
            anchor={0.5}
            scale={scaleFactor}
          />
        )}

        {pawnTexture && (
          gameObjects.map((gameObj) =>
            <GameObject
              id={gameObj.id}
              key={gameObj.id}
              texture={pawnTexture}
              x={gameObj.x ? (windowDimensions.width / 2) + gameObj.x * scaleFactor : windowDimensions.width / 2}
              y={gameObj.y ? (windowDimensions.height / 2) + gameObj.y * scaleFactor : windowDimensions.height / 2}
              anchor={0.5}
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