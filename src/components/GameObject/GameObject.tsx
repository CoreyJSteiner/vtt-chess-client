import type { UUID } from 'crypto'
import { useEffect, useRef, useState } from 'react'
import { extend } from '@pixi/react'
import { Assets, Container, FederatedMouseEvent, Polygon, Sprite, Texture } from 'pixi.js'
import { createPolygonHitbox } from '../Utils'
extend({ Sprite, Texture, Container })

type GameObjectProps = {
    id: UUID,
    textureBasePath: string,
    textureOverPath?: string,
    initX: number,
    initY: number,
    zOverride?: number,
    anchor?: number,
    scale: number,
    draggable?: boolean
}

const GameObject: React.FC<GameObjectProps> = ({ id, textureBasePath, textureOverPath, initX, initY, zOverride, anchor, scale, draggable = false }) => {
    const [activeX, setActiveX] = useState<number>(0)
    const [activeY, setActiveY] = useState<number>(0)
    const [dragging, setDragging] = useState<boolean>(false)
    const [baseTexture, setBaseTexture] = useState<Texture>()
    const [overTexture, setOverTexture] = useState<Texture>()
    const [hitbox, setHitBox] = useState<Polygon>()
    const gameObjectRef = useRef<Container>(null)
    const overRef = useRef<Sprite>(null)
    const baseRef = useRef<Sprite>(null)

    useEffect(() => {
        const moveFunction = (e: FederatedMouseEvent): void => {
            if (!dragging) return
            console.log(e.movementX, e.movementY)
            console.log(e.x, e.y)
            console.log(e.screenX, e.screenY)
            console.log(activeX, activeY)
            setActiveX((prev: number) => Math.floor((prev + e.movementX)))
            setActiveY((prev: number) => Math.floor((prev + e.movementY)))
        }

        const correctPosFunction = (e: FederatedMouseEvent): void => {
            if (!dragging) return
            console.log(e.x, e.y)
            setActiveX(e.x)
            setActiveY(e.y)
        }

        const draggedObject = gameObjectRef.current

        if (dragging) {
            draggedObject?.on('pointermove', moveFunction)
            draggedObject?.on('pointerleave', correctPosFunction)
        } else {
            draggedObject?.off('pointermove', moveFunction)
            draggedObject?.off('pointerleave', correctPosFunction)
        }

        return (): void => {
            if (draggedObject) {
                draggedObject.off('pointermove', moveFunction)
                draggedObject?.off('pointerleave', correctPosFunction)
            }
        }
    }, [dragging])

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
        const handlePickUp = (): void => {
            setDragging(true)
        }
        const handleRelease = (): void => {
            console.log('release')
            setDragging(false)
        }

        const gameObjectHitbox = gameObjectRef.current

        if (gameObjectHitbox && draggable && hitbox) {
            gameObjectHitbox.eventMode = 'static'
            gameObjectHitbox.cursor = 'pointer'
            gameObjectHitbox.hitArea = hitbox
            gameObjectHitbox.on('pointerdown', handlePickUp)
            gameObjectHitbox.on('pointerup', handleRelease)
        }

        return (): void => {
            if (gameObjectHitbox) {
                gameObjectHitbox.off('pointerdown', handlePickUp)
                gameObjectHitbox.off('pointerup', handleRelease)
            }
        }
    }, [id, draggable, hitbox])

    useEffect(() => {
        setActiveX(initX)
    }, [initX])

    useEffect(() => {
        setActiveY(initY)
    }, [initY])

    return (
        <pixiContainer
            key={id}
            ref={gameObjectRef}
            x={activeX}
            y={activeY}
            zIndex={zOverride ? zOverride : activeY}
            anchor={anchor}
            scale={scale}>
            {baseTexture && <pixiSprite
                ref={baseRef}
                texture={baseTexture}
            // anchor={anchor}
            >
                {overTexture && <pixiSprite
                    ref={overRef}
                    texture={overTexture}
                    // anchor={anchor}
                    y={dragging ? -5 : 0}
                />}
            </pixiSprite>}
        </pixiContainer>
    )
}

export default GameObject