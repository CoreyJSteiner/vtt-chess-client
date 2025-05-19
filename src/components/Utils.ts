import { isoLines } from "marching-squares"
// import sharp from 'sharp'

// export const getAlphaBuffer = async (imagePath: string): Promise<Array<Array<number>>> => {

//     // Read image and ensure alpha channel exists
//     const image = sharp(imagePath).ensureAlpha();

//     // Get image metadata
//     const { width, height } = await image.metadata();
//     if (!width || !height) throw new Error('Invalid image dimensions');

//     // Extract raw RGBA pixel data
//     const { data: rgbaBuffer } = await image
//         .raw()
//         .toColourspace('rgba')
//         .toBuffer({ resolveWithObject: true });

//     // Create 2D alpha matrix
//     const alphaMatrix: Array<Array<number>> = [];

//     for (let y = 0; y < height; y++) {
//         const row: number[] = [];
//         for (let x = 0; x < width; x++) {
//             // Calculate position in RGBA buffer (4 bytes per pixel)
//             const pos = (y * width + x) * 4;
//             // Extract alpha value (4th channel)
//             row.push(rgbaBuffer[pos + 3]);
//         }
//         alphaMatrix.push(row);
//     }

//     return alphaMatrix
// }

export const getAlphaBuffer = async (imageUrl: string): Promise<Array<Array<number>>> => {
    // Load image element
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    await img.decode();

    // Create canvas context
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
    const alphaMatrix: number[][] = [];

    // Build alpha matrix (same structure as sharp version)
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