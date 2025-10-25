import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'
import { getRadiansFromDegrees } from '@/canvas/helpers/NumberHelper'
import { getRandomAssetKey } from '@/canvas/helpers/AssetHelper'
import { DrawGlow } from '../decorators/GlowDecorator'

enum SnowflakeAssetType {
  Snowflake01 = '/images/weather/snowflake-01.svg',
  Snowflake02 = '/images/weather/snowflake-02.svg',
  Snowflake03 = '/images/weather/snowflake-03.svg',
  Snowflake04 = '/images/weather/snowflake-04.svg',
  Snowflake05 = '/images/weather/snowflake-05.svg',
  Snowflake06 = '/images/weather/snowflake-06.svg',
  Snowflake07 = '/images/weather/snowflake-07.svg',
  Snowflake08 = '/images/weather/snowflake-08.svg',
  Snowflake09 = '/images/weather/snowflake-09.svg',
}

/**
 * Snowflake particle entity.
 */
export class SnowflakeParticleEntity extends AbstractEntity {
  public readonly name: string = 'snowflake-particle'
  private _assetKey: SnowflakeAssetType

  static {
    loadAssets([
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake01,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake02,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake03,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake04,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake05,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake06,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake07,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake08,
      },
      {
        type: AssetType.Image,
        url: SnowflakeAssetType.Snowflake09,
      }
    ]).then((assets) => {
      SnowflakeParticleEntity.assets = assets
      SnowflakeParticleEntity.isAssetsLoaded = true
    })
  }

  constructor(params) {
    super(params)

    this._assetKey = getRandomAssetKey<SnowflakeAssetType>([
      SnowflakeAssetType.Snowflake01,
      SnowflakeAssetType.Snowflake02,
      SnowflakeAssetType.Snowflake03,
      SnowflakeAssetType.Snowflake04,
      SnowflakeAssetType.Snowflake05,
      SnowflakeAssetType.Snowflake06,
      SnowflakeAssetType.Snowflake07,
      SnowflakeAssetType.Snowflake08,
      SnowflakeAssetType.Snowflake09
    ])
  }

  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  @DrawGlow()
  public draw(): void {
    if (!SnowflakeParticleEntity.isAssetsLoaded) return
    
    const image = SnowflakeParticleEntity.assets.get(this._assetKey)
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
