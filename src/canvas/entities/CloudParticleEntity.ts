import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'
import { getRadiansFromDegrees } from '@/canvas/helpers/NumberHelper'
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

/**
 * Cloud particle entity.
 */
export class CloudParticleEntity extends AbstractEntity {
  private _assetKey: CloudAssetType

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
    })
  }

  constructor(params) {
    super(params)

    this._assetKey = getRandomAssetKey<CloudAssetType>([
      CloudAssetType.Cloud01,
      CloudAssetType.Cloud02,
      CloudAssetType.Cloud03,
      CloudAssetType.Cloud04,
      CloudAssetType.Cloud05,
      CloudAssetType.Cloud06,
      CloudAssetType.Cloud07,
      CloudAssetType.Cloud08,
    ])
  }

  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    if (!CloudParticleEntity.isAssetsLoaded) return
    
    const image = CloudParticleEntity.assets.get(this._assetKey)
    if (image) {
      const radians: number = getRadiansFromDegrees(this.position.rotation || 0)
      
      this.context.save()
      this.context.translate(
        this.position.x + (this.position.width / 2),
        this.position.y + (this.position.height / 2)
      )
      this.context.rotate(radians)
      this.context.translate(
        -this.position.width / 2,
        -this.position.height / 2
      )
      this.context.drawImage(
        image,
        0,
        0,
        this.position.width,
        this.position.height
      )
      this.context.restore()
    }
  }
}
