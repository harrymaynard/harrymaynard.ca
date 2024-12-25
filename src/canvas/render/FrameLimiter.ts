/**
 * FrameLimiter class is used to limit the frame rate of the canvas.
 */
export class FrameLimiter {
  private fps: number
  private interval: number
  private lastTime: number
  private isRunning: boolean = false

  constructor(fps: number) {
    this.fps = fps
    this.interval = 1000 / fps
    this.lastTime = 0
  }

  /**
   * Start the frame limiter.
   * @param callback 
   */
  public start(callback: () => void): void {
    const loop = () => {
      if (!this.isRunning) return
    
      window.requestAnimationFrame(loop)
      const now: number = Date.now()
      const elapsed = now - this.lastTime

      if (elapsed > this.interval) {
        this.lastTime = now - (elapsed % this.interval)
        callback()
      }
    }

    this.isRunning = true
    window.requestAnimationFrame(loop)
  }

  /**
   * Stop the frame limiter.
   */
  public stop(): void {
    this.isRunning = false
  }
}
