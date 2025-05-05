import './Board.css'
import {
  Application,
  extend,
  useTick
} from '@pixi/react'
import {
  Container,
  Graphics,
  Sprite,
  Assets
} from 'pixi.js'
import { useEffect, useState } from 'react'

extend({
  Container,
  Graphics,
  Sprite
})

const Board: React.FC = () => {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null)
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loadTexture = async () => {
      const tex = await Assets.load('src/assets/board-generic.png');
      setTexture(tex);
    };

    loadTexture();
  }, [])

  return (
    <div id='game-board' ref={setContainerElement}>
      {containerElement && <Application
        resizeTo={containerElement}
        background={'#fff'}
        autoDensity={true}
        resolution={window.devicePixelRatio || 1}
      >
        {texture && (
          <pixiSprite
            texture={texture}
            x={containerElement.offsetWidth / 2}
            y={containerElement.offsetHeight / 2}
            anchor={0.5}
          />
        )}
      </Application>}
    </div>
  )
}

export default Board