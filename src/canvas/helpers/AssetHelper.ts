import axios from 'axios'
import { AssetType } from '../enums/AssetType'
import { IAsset } from '../interfaces/IAsset'

/**
 * Load entity assets.
 * @returns Promise<Map<string, any>>
 */
export const loadAssets = async (assets: Array<IAsset>): Promise<Map<string, any>> => {
  const assetMap = new Map<string, any>()
  const loadPromises: Array<Promise<void>> = []

  for (const index in assets) {
    const asset = assets[index]
    let promise: Promise<void> | null = null

    switch (asset.type) {
      case AssetType.Image:
        promise = loadImage(asset.url)
          .then((image: HTMLImageElement) => {
            assetMap.set(asset.url, image)
          })
          .catch((error) => {
            console.error(error)
          })
        break

      case AssetType.SVG:
        promise = loadSVG(asset.url)
          .then((image: SVGElement) => {
            assetMap.set(asset.url, image)
          })
          .catch((error) => {
            console.error(error)
          })
        break

      default:
        break
    }
    if (promise) {
      loadPromises.push(promise)
    }
  }
  await Promise.all(loadPromises)
  
  return assetMap
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

/**
 * Load an SVG.
 * @param url 
 * @returns Promise<SVGElement>
 */
export const loadSVG = async (url: string): Promise<SVGElement> => {
  const { data } = await axios.get(url, {
    responseType: 'text' // Specify response type as 'text' for SVG
  })
  return data as SVGElement
}

/**
 * Get a random asset key from the given assets.
 * @param assets 
 * @returns string
 */
export const getRandomAssetKey = <T>(assets: Array<string>): T => {
  const randomIndex = Math.floor(Math.random() * assets.length)
  return assets[randomIndex] as T
}
