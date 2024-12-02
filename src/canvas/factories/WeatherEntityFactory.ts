// import { WeatherCodeType } from '@/weather/enums/WeatherCodeType'
// import { AbstractEntity } from '../entities/AbstractEntity'

export class WeatherEntityFactory {
  private static _context: CanvasRenderingContext2D

  constructor({
    context,
  }: {
    context: CanvasRenderingContext2D
  }) {
    WeatherEntityFactory._context = context
  }

  // public createEntity(weatherCodeType: WeatherCodeType): AbstractEntity {
  //   switch (weatherCodeType) {
  //     case WeatherCodeType.Snow:
  //       return new SnowEntity({
  //         context: WeatherEntityFactory._context,
  //         position: {
  //           x: 0,
  //           y: 0,
  //           width: 0,
  //           height: 0,
  //         },
  //       })
  //   }
  // }
}
