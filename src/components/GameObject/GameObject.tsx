import type { UUID } from 'crypto'
import { useEffect, useRef, useState } from 'react'
import { extend } from '@pixi/react'
import { Assets, Container, Polygon, Sprite, Texture } from 'pixi.js'
import { createPolygonHitbox } from '../Utils'
extend({ Sprite, Texture, Container })

type GameObjectProps = {
    id: UUID,
    textureBasePath: string,
    textureOverPath?: string,
    x: number,
    y: number,
    zOverride?: number,
    anchor?: number,
    scale: number,
    draggable?: boolean
}

const GameObject: React.FC<GameObjectProps> = ({ id, textureBasePath, textureOverPath, x, y, zOverride, anchor, scale, draggable = false }) => {
    const [xDiff, setXDiff] = useState<number>(0)
    const [yDiff, setYDiff] = useState<number>(0)
    const [dragging, setDragging] = useState<boolean>(false)
    const [baseTexture, setBaseTexture] = useState<Texture>()
    const [overTexture, setOverTexture] = useState<Texture>()
    const [hitbox, setHitBox] = useState<Polygon>()
    const gameObjectRef = useRef<Container>(null)
    const overRef = useRef<Sprite>(null)
    const baseRef = useRef<Sprite>(null)

    useEffect(() => {
        const loadTexture = async (fileName: string, setTexture: (texture: Texture) => void): Promise<void> => {
            const tex: Texture = await Assets.load(fileName)
            tex.source.scaleMode = 'nearest'
            setTexture(tex)
        }

        loadTexture(textureBasePath, setBaseTexture)
        if (textureOverPath) loadTexture(textureOverPath, setOverTexture)

    }, [textureBasePath, textureOverPath])

    useEffect(() => {
        const createHitBox = async (fileName: string, setHitBox: (polygon: Polygon) => void): Promise<void> => {
            const polygonOutline: Polygon = new Polygon(
                await createPolygonHitbox(fileName)
            )
            setHitBox(polygonOutline)
        }

        let hitBoxTexturePath = textureBasePath
        if (textureOverPath) {
            hitBoxTexturePath = textureOverPath
        }
        createHitBox(hitBoxTexturePath, setHitBox)
    }, [textureBasePath, textureOverPath])


    useEffect(() => {
        const handleDragObj = (): void => {
            setDragging(true)
        }
        const handleRelease = (): void => {
            setDragging(false)
        }

        const gameObjectHitbox = gameObjectRef.current

        if (gameObjectHitbox && draggable && hitbox) {
            gameObjectHitbox.eventMode = 'static'
            gameObjectHitbox.cursor = 'pointer'
            gameObjectHitbox.hitArea = hitbox
            gameObjectHitbox.on('pointerdown', handleDragObj)
            gameObjectHitbox.on('pointerup', handleRelease)
            gameObjectHitbox.on('pointerleave', handleRelease)
        }

        return (): void => {
            if (gameObjectHitbox) {
                gameObjectHitbox.off('pointerdown', handleDragObj)
                gameObjectHitbox.off('pointerup', handleRelease)
            }
        }
    }, [id, draggable, hitbox])

    useEffect(() => {
        setXDiff(0)
    }, [x])

    useEffect(() => {
        setYDiff(0)
    }, [y])

    return (
        <pixiContainer
            key={id}
            ref={gameObjectRef}
            x={x + xDiff}
            y={y + yDiff}
            zIndex={zOverride ? zOverride : y}
            anchor={anchor}
            scale={scale}>
            {baseTexture && <pixiSprite
                ref={baseRef}
                texture={baseTexture}
                anchor={anchor}
            >
                {overTexture && <pixiSprite
                    ref={overRef}
                    texture={overTexture}
                    anchor={anchor}
                    y={dragging ? -5 : 0}
                />}
            </pixiSprite>}
        </pixiContainer>
    )
}

export default GameObject