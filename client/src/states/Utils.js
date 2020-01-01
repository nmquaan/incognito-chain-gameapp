export default class Utils {
	static convertHex(color)
	{
		return parseInt(color.replace(/^#/, ''), 16);
	}

	static normalize(vec2) {
		return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
	}
}