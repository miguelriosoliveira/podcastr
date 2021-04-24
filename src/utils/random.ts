/**
 * Returns a random integer between minimum and maximum (both inclusive)
 * @param minimum Lower bound (inclusive)
 * @param maximum Upper bound (inclusive)
 * @returns A random integer between minimum and maximum (both inclusive)
 */
export function getRandomInt(minimum: number, maximum: number) {
	const min = Math.ceil(minimum);
	const max = Math.floor(maximum);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
