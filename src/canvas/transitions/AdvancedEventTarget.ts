/**
 * AdvancedEventTarget is a class that extends the EventTarget interface.
 */
export class AdvancedEventTarget {
  private _eventListeners: Map<string, EventListener[]> = new Map()
  private _target: EventTarget = new EventTarget()

  /**
   * Add an event listener.
   * @param type 
   * @param listener 
   */
  public addEventListener(type: string, listener: EventListener): void {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, [])
    }
    (this._eventListeners.get(type) as EventListener[]).push(listener)
    this._target.addEventListener(type, listener)
  }

  /**
   * Remove an event listener.
   * @param type 
   * @param listener 
   */
  public removeEventListener(type: string, listener: EventListener): void {
    if (this._eventListeners.has(type)) {
      const listenerArray = this._eventListeners.get(type) as EventListener[]
      const index = listenerArray.indexOf(listener)
      if (index > -1) {
        listenerArray.splice(index, 1)
        this._target.removeEventListener(type, listener)
      }
    }
  }

  /**
   * Remove all event listeners.
   */
  public removeAllEventListeners(): void {
    this._eventListeners.forEach((listenerArray, type) => {
      listenerArray.forEach(listener => {
        this._target.removeEventListener(type, listener)
      })
    })
    this._eventListeners.clear()
  }

  /**
   * Dispatch an event.
   * @param event 
   */
  public dispatchEvent(event: Event): void {
    this._target.dispatchEvent(event)
  }
}
