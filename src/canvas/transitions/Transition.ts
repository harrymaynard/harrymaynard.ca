import { AdvancedEventTarget } from '@/canvas/transitions/AdvancedEventTarget'
import { TransitionEventType } from '@/canvas/enums/TransitionEventType'

interface IAbstractTransitionParams {
  startValue: number
  endValue: number
  duration: number
}

/**
 * Transition class.
 */
export class Transition extends AdvancedEventTarget {
  private _startValue: number = 0
  private _endValue: number = 0
  private _duration: number = 0
  
  private _startTime: number = 0
  private _value: number = 0
  private _isRunning: boolean = false

  constructor({
    startValue,
    endValue,
    duration,
  }: IAbstractTransitionParams) {
    super()

    this._tick = this._tick.bind(this)
    
    this._startValue = startValue
    this._endValue = endValue
    this._duration = duration
    this._value = startValue

    this._start()
  }

  /**
   * Start the transition.
   */
  private _start(): void {
    this._isRunning = true
    this._startTime = performance.now()
    this._tick()
  }

  /**
   * Stop the transition.
   */
  public destroy(): void {
    this._isRunning = false
    this.removeAllEventListeners()
  }

  /**
   * Update the value of the transition.
   */
  private _tick(): void {
    if (!this._isRunning) return

    const now = performance.now()
    const delta = Math.min((now - this._startTime) / this._duration, 1)
    this._value = (delta * (this._endValue - this._startValue)) + this._startValue
    
    if (delta < 1) {
      this.dispatchEvent(new Event(TransitionEventType.Tick))
      requestAnimationFrame(this._tick)
    } else {
      this.dispatchEvent(new Event(TransitionEventType.Tick))
      this.dispatchEvent(new Event(TransitionEventType.Complete))
    }
  }

  /**
   * Get the current value of the transition.
   * @returns number
   */
  public getValue(): number {
    return this._value
  }
}
