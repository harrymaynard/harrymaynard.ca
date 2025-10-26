import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { getMaxSVGDimensions, loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'
import { getRandomAssetKey, parseSVG } from '@/canvas/helpers/AssetHelper'
import { DrawGlow } from '../decorators/GlowDecorator'

enum CloudAssetType {
  Cloud01 = '/images/weather/cloud-01.svg',
  Cloud02 = '/images/weather/cloud-02.svg',
  Cloud03 = '/images/weather/cloud-03.svg',
  Cloud04 = '/images/weather/cloud-04.svg',
  Cloud05 = '/images/weather/cloud-05.svg',
  Cloud06 = '/images/weather/cloud-06.svg',
  Cloud07 = '/images/weather/cloud-07.svg',
  Cloud08 = '/images/weather/cloud-08.svg',
}

const ASSET_MAX_WIDTH: number = 256
const ASSET_MAX_HEIGHT: number = 200

/**
 * Cloud particle entity.
 */
export class CloudParticleEntity extends AbstractEntity {
  public readonly name: string = 'cloud-particle'
  public assetKey: CloudAssetType

  private static scale: number = 1

  static {
    loadAssets([
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud01,
      },
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud02,
      },
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud03,
      },
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud04,
      },
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud05,
      },
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud06,
      },
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud07,
      },
      {
        type: AssetType.SVG,
        url: CloudAssetType.Cloud08,
      }
    ]).then(async (assets) => {
      CloudParticleEntity.assets = assets

      const { maxWidth, maxHeight } = getMaxSVGDimensions(Array.from(assets.values()))

      CloudParticleEntity.scale = Math.min(
        ASSET_MAX_WIDTH / maxWidth,
        ASSET_MAX_HEIGHT / maxHeight
      )

      // Modify SVG assets to apply scaling and padding.
      const promises: Array<Promise<void>> = [] 
      CloudParticleEntity.assets.forEach((asset, key) => {
        const promise = parseSVG(asset, CloudParticleEntity.scale, 10).then((svg) => {
          CloudParticleEntity.assets.set(key, svg)
        })
        promises.push(promise)
      })
      try {
        await Promise.all(promises)
      } catch (error) {
        console.error('Error parsing SVG assets:', error)
      }
      

      CloudParticleEntity.isAssetsLoaded = true
    })
  }

  constructor(params) {
    // Determine the asset key before calling the super constructor.
    // This is necessary to set the width and height of the entity.
    const assetKey: CloudAssetType = getRandomAssetKey<CloudAssetType>([
      CloudAssetType.Cloud01,
      CloudAssetType.Cloud02,
      CloudAssetType.Cloud03,
      CloudAssetType.Cloud04,
      CloudAssetType.Cloud05,
      CloudAssetType.Cloud06,
      CloudAssetType.Cloud07,
      CloudAssetType.Cloud08,
    ])
    const asset = CloudParticleEntity.assets.get(assetKey)

    params.position.width = asset?.width || 1
    params.position.height = asset?.height || 1

    super(params)

    this.assetKey = assetKey
  }

  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  @DrawGlow()
  public draw(): void {
    if (!CloudParticleEntity.isAssetsLoaded) return
    
    const image = CloudParticleEntity.assets.get(this.assetKey) as HTMLImageElement
    if (image) {
      const width: number = this.position.width
      const height: number = this.position.height
    
      this.context.drawImage(
        image,
        this.position.x,
        this.position.y,
        width,
        height
      )
    }
  }
}
