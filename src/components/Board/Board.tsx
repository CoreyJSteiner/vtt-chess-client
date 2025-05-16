import './Board.css'
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
import { useEffect, useState } from 'react'
import GameObject from '../GameObject'

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
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const loadTexture = async (fileName: string, setTexture: (texture: Texture) => void) => {
      const tex: Texture = await Assets.load(fileName)
      setTexture(tex)

      const handleResize = () => {
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

      return () => window.removeEventListener('resize', handleResize)
    };

    loadTexture('src/assets/board-generic.png', setBoardTexture)
    loadTexture('src/assets/pawn.png', setPawnTexture)
  }, [containerElement])

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
          />
        )}

        {pawnTexture && (
          <GameObject
            id={crypto.randomUUID()}
            texture={pawnTexture}
            x={windowDimensions.width / 2}
            y={windowDimensions.height / 2}
            anchor={0.5}
          />
        )}
      </Application>}
    </div>
  )
}

export default Board