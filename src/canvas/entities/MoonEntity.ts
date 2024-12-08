import { AbstractEntity } from '@/canvas/entities/AbstractEntity'
import { loadAssets } from '@/canvas/helpers/AssetHelper'
import { AssetType } from '@/canvas/enums/AssetType'

enum MoonAssetType {
  Moon = '/images/weather/moon.svg',
}

/**
 * Moon entity.
 */
export class MoonEntity extends AbstractEntity {
  static {
    loadAssets([
      {
        type: AssetType.Image,
        url: MoonAssetType.Moon,
      }
    ]).then((assets) => {
      MoonEntity.assets = assets
      MoonEntity.isAssetsLoaded = true
    })
  }

  /**
   * Draw the entity on the canvas.
   * @returns void
   */
  public draw(): void {
    if (!MoonEntity.isAssetsLoaded) return
    
    const image = MoonEntity.assets.get(MoonAssetType.Moon)
    if (image) {
      this.context.drawImage(
        image,
        0,
        0,
        this.position.width,
        this.position.height
      )
    }
  }
}
