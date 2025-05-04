import './Board.css';
import {
    Application,
    extend,
  } from '@pixi/react'
  import {
    Container,
    Graphics,
  } from 'pixi.js'
  import { useCallback, useState } from 'react'

  extend({
    Container,
    Graphics,
  })

const Board: React.FC = () => {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);

  //Test Graphic
  const drawCallback = useCallback((graphics: Graphics) => {
    graphics.clear()
    graphics.setFillStyle({ color: 'red' })
    graphics.rect(0, 0, 50, 50)
    graphics.fill() 
  }, [])

  return (
    <div id='game-board' ref={setContainerElement}>
      {containerElement &&<Application 
        resizeTo={containerElement}
        autoDensity={true}
        resolution={window.devicePixelRatio || 1}
      >
      <pixiContainer x={100} y={100}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
      </Application>} 
    </div>
  )
}

export default Board;