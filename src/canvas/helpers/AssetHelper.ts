import axios from 'axios'
import { AssetType } from '../enums/AssetType'
import { IAsset } from '../interfaces/IAsset'

/**
 * Load entity assets.
 * @returns Promise<Map<string, any>>
 */
export const loadAssets = async (
  assets: Array<IAsset>
): Promise<Map<string, any>> => {
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
  return data
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

/**
 * Modify SVG assets to apply scaling and padding.
 * @param assets 
 * @param scale 
 * @param padding 
 * @returns Promise<Map<string, any>>
 */
export const normalizeSVGAssets = async (
  assets: Map<string, any>,
  scale: number,
  padding: number = 0
) => {
  const promises: Array<Promise<void>> = [] 
  assets.forEach((asset, key) => {
    const promise = normalizeSVGAsset(asset, scale, padding).then((svg) => {
      assets.set(key, svg)
    })
    promises.push(promise)
  })
  try {
    await Promise.all(promises)
  } catch (error) {
    console.error('Error parsing SVG assets:', error)
  }
  return assets
}

export const normalizeSVGAsset = (
  svgString: string,
  scale: number,
  padding: number = 0
): Promise<HTMLImageElement> => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(svgString, 'image/svg+xml')
  const svg = xmlDoc.documentElement as unknown as SVGElement

  if (padding > 0) {
    const width: number = parseInt(svg.getAttribute('width') as string)
    const height: number = parseInt(svg.getAttribute('height') as string)
    const scaledWidth: number = width * scale
    const scaledHeight: number = height * scale

    // Scale factor for at least padding on all sides.
    const scaleFactorWidth: number = scaledWidth / (scaledWidth + padding * 2)
    const scaleFactorHeight: number = scaledHeight / (scaledHeight + padding * 2)
    const finalScaleFactor: number = Math.min(scaleFactorWidth, scaleFactorHeight)
    
    // Set viewBox with minumum padding on all sides using scaled sizes as final dimensions.
    svg.setAttribute('viewBox', `-${padding} -${padding} ${width + ((padding * 2) / finalScaleFactor)} ${height + ((padding * 2) / finalScaleFactor)}`)
  }

  // Return promise containing SVG in an Image element.
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject

    const svgDataUrl: string = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svg))}`
    image.src = svgDataUrl
  })
}


export const getMaxSVGDimensions = (assets: Array<string>) => {
  let maxWidth: number = 0
  let maxHeight: number = 0

  assets.forEach((svgString) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(svgString, 'image/svg+xml')
    const svg = xmlDoc.documentElement as unknown as SVGElement

    const width: number = parseInt(svg.getAttribute('width') as string)
    const height: number = parseInt(svg.getAttribute('height') as string)

    if (width > maxWidth) {
      maxWidth = width
    }
    if (height > maxHeight) {
      maxHeight = height
    }
  })

  return { maxWidth, maxHeight }
}
