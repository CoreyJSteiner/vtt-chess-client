import { isoLines } from "marching-squares"

export const getAlphaBuffer = async (imageUrl: string): Promise<Array<Array<number>>> => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    await img.decode()

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    const alphaMatrix: number[][] = []

    for (let y = 0; y < img.height; y++) {
        const row: number[] = [];
        for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            row.push(imageData[idx + 3]); // Alpha channel
        }
        alphaMatrix.push(row);
    }

    return alphaMatrix;
}

export const createPolygonHitbox = async (imagePath: string): Promise<Array<number>> => {
    const alphaMatrix: Array<Array<number>> = await getAlphaBuffer(imagePath)

    const flatArray: Array<number> = isoLines(alphaMatrix, [1, 255], { noFrame: true })[1].flat(2)

    return flatArray
}