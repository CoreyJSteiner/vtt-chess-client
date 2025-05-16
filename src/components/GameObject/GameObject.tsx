import type { UUID } from 'crypto'
import {
    extend,
} from '@pixi/react'
import {
    Sprite,
    Texture,
} from 'pixi.js'

extend({
    Sprite,
    Texture
})

type GameObjectProps = {
    id: UUID,
    texture: Texture,
    x: number,
    y: number,
    anchor: number,
    scale: number
}

const GameObject: React.FC<GameObjectProps> = ({ id, texture, x, y, anchor, scale }) => {
    return (<pixiSprite
        key={id}
        texture={texture}
        x={x || 0}
        y={y || 0}
        anchor={anchor || 0.5}
        scale={scale}
    />)
}

export default GameObject


// class GameObject {
//   id: UUID
//   sprite: Sprite

//   constructor(id: UUID) {
//     this.id = id ? id : crypto.randomUUID()
//     this.sprite = null
//   }

//   initSprite(texture: Texture, x: number, y: number) {
//     this.sprite = new Sprite({ texture, x, y })

//     return (

//     )
//   }
// }