import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'
import { getRadiansFromDegrees } from '@/canvas/helpers/NumberHelper'
import { getRandomAssetKey } from '@/canvas/helpers/AssetHelper'

enum CloudAssetType {
  Cloud01 = '/images/weather/cloud-01.svg',
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
