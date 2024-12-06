/**
 * Get random number in range.
 * @param min 
 * @param max 
 * @returns number
 */
export const getRandomNumberInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * Convert degrees to radians.
 * @param degrees 
 * @returns number
 */
export const getRadiansFromDegrees = (degrees: number): number => {
  return (Math.PI / 180) * degrees
}
