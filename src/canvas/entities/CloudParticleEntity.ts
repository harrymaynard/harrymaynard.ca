import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'
import { getRandomAssetKey } from '@/canvas/helpers/AssetHelper'

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

const MAX_WIDTH: number = 256
const MAX_HEIGHT: number = 200

/**
 * Cloud particle entity.
 */
export class CloudParticleEntity extends AbstractEntity {
  public readonly name: string = 'cloud-particle'
  private _assetKey: CloudAssetType

  private static scale: number = 1

  static {
    loadAssets([
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud01,
      },
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud02,
      },
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud03,
      },
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud04,
      },
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud05,
      },
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud06,
      },
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud07,
      },
      {
        type: AssetType.Image,
        url: CloudAssetType.Cloud08,
      }
    ]).then((assets) => {
      CloudParticleEntity.assets = assets
      CloudParticleEntity.isAssetsLoaded = true

      // Calculate the scale based on the maximum width and height of the assets.
      const maxWidth = Math.max(
        ...Array.from(assets.values()).map((asset) => asset.width)
      )
      const maxHeight = Math.max(
        ...Array.from(assets.values()).map((asset) => asset.height)
      )
      CloudParticleEntity.scale = Math.min(
        MAX_WIDTH / maxWidth,
        MAX_HEIGHT / maxHeight
      )
    })
  }

  constructor(params) {
    // Determine the asset key before calling the super constructor.
    // This is necessary to set the width and height of the entity.
    const assetKey = getRandomAssetKey<CloudAssetType>([
      CloudAssetType.Cloud01,
      CloudAssetType.Cloud02,
      CloudAssetType.Cloud03,
      CloudAssetType.Cloud04,
      CloudAssetType.Cloud05,
      CloudAssetType.Cloud06,
      CloudAssetType.Cloud07,
      CloudAssetType.Cloud08,
    ])
    const width = CloudParticleEntity.assets.get(assetKey).width
    const height = CloudParticleEntity.assets.get(assetKey).height
    params.position.width = width
    params.position.height = height

    super(params)

    this._assetKey = assetKey
  }

  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    if (!CloudParticleEntity.isAssetsLoaded) return
    
    const image = CloudParticleEntity.assets.get(this._assetKey)
    if (image) {
      this.context.drawImage(
        image,
        this.position.x,
        this.position.y,
        image.width * CloudParticleEntity.scale,
        image.height * CloudParticleEntity.scale
      )
    }
  }
}
