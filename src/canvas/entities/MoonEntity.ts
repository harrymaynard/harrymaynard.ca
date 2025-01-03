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
  public readonly name: string = 'moon'
  
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
      const opacity: number = this.transition?.getValue() || 1
      
      this.context.save()
      this.context.globalAlpha = opacity
      this.context.drawImage(
        image,
        this.position.x,
        this.position.y,
        this.position.width,
        this.position.height
      )
      this.context.restore()
    }
  }
}
