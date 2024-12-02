
/**
 * Get random number in range.
 * @param min 
 * @param max 
 * @returns number
 */
export const getRandomNumberInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}
