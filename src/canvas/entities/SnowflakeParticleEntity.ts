import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'
import { getRadiansFromDegrees } from '@/canvas/helpers/NumberHelper'

enum SnowflakeAssetType {
  Snowflake01 = '/images/weather/snowflake-01.svg',
}

/**
 * Snowflake particle entity.
 */
export class SnowflakeParticleEntity extends AbstractEntity {
  static {
    loadAssets([
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake01,
      }
    ]).then((assets) => {
      SnowflakeParticleEntity.assets = assets
      SnowflakeParticleEntity.isAssetsLoaded = true
    })
  }

  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    if (!SnowflakeParticleEntity.isAssetsLoaded) return

    const image = SnowflakeParticleEntity.assets.get(SnowflakeAssetType.Snowflake01)
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
