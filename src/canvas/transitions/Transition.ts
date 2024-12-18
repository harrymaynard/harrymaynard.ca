interface IAbstractTransitionParams {
  startValue: number
  endValue: number
  duration: number
  onComplete?: () => void
  onTick?: (value: number) => void
}

/**
 * Transition class.
 */
export class Transition {
  private _startValue: number = 0
  private _endValue: number = 0
  private _duration: number = 0
  private _onComplete: () => void = () => {}
  private _onTick: (value: number) => void = () => {}

  private _startTime: number = 0
  private _value: number = 0
  private _isRunning: boolean = false

  constructor({
    startValue,
    endValue,
    duration,
    onComplete,
    onTick,
  }: IAbstractTransitionParams) {
    this._tick = this._tick.bind(this)
    
    this._startValue = startValue
    this._endValue = endValue
    this._duration = duration
    this._onComplete = onComplete || this._onComplete
    this._onTick = onTick || this._onTick
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
  public stop(): void {
    this._isRunning = false
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
      this._onTick(this._value)
      requestAnimationFrame(this._tick)
    } else {
      this._onTick(this._endValue)
      this._onComplete()
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
