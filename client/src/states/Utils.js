export default class Utils {
	static convertHex(color)
	{
		return parseInt(color.replace(/^#/, ''), 16);
	}
}