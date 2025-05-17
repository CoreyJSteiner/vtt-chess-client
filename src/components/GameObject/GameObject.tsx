import type { UUID } from 'crypto'
import { useEffect, useRef, useState } from 'react'
import { extend } from '@pixi/react'
import { Sprite, Texture } from 'pixi.js'
extend({ Sprite, Texture })

type GameObjectProps = {
    id: UUID,
    texture: Texture,
    x: number,
    y: number,
    anchor: number,
    scale: number,
    draggable?: boolean
}

const GameObject: React.FC<GameObjectProps> = ({ id, texture, x, y, anchor, scale, draggable = false }) => {
    const [xDiff, setXDiff] = useState<number>(0)
    const [yDiff, setYDiff] = useState<number>(0)
    const spriteRef = useRef<Sprite>(null)

    useEffect(() => {
        const sprite = spriteRef.current

        const handleDrag = (): void => {
            console.log(`Is draggable ${id}: ${draggable}`)
        }

        if (sprite && draggable) {
            sprite.eventMode = 'static'
            sprite.on('pointerdown', handleDrag)
        }

        return (): void => {
            if (sprite) {
                sprite.off('pointerdown', handleDrag)
            }
        }
    }, [id, draggable])

    //Reset position diff on x/y prop change
    useEffect(() => {
        setXDiff(0)
    }, [x])

    useEffect(() => {
        setYDiff(0)
    }, [y])

    return (<pixiSprite
        key={id}
        ref={spriteRef}
        texture={texture}
        x={x + xDiff}
        y={y + yDiff}
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