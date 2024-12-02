import { AssetType } from '../enums/AssetType'
import { IAsset } from '../interfaces/IAsset'

/**
 * Load image assets.
 * @returns Promise<Map<string, any>>
 */
export const loadAssets = async (assets: Array<IAsset>): Promise<Map<string, any>> => {
  const imageAssetMap = new Map<string, any>()
  const imageLoadPromises: Array<Promise<void>> = []

  for (const index in assets) {
    const asset = assets[index]
    let promise: Promise<void> | null = null

    switch (asset.type) {
      case AssetType.Image:
        promise = loadImage(asset.url)
          .then((image: HTMLImageElement) => {
            imageAssetMap.set(asset.url, image)
          })
          .catch((error) => {
            console.error(error)
          })
        break
      default:
        break
    }
    if (promise) {
      imageLoadPromises.push(promise)
    }
  }
  await Promise.all(imageLoadPromises)
  
  return imageAssetMap
}

/**
 * Load an image.
 * @param url 
 * @returns Promise<HTMLImageElement>
 */
export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}
