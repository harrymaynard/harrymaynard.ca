import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'

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
      this.context.drawImage(
        image,
        this.position.x,
        this.position.y,
        this.position.width,
        this.position.height
      )
    }
  }
}
