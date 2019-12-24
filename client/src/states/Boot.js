export default class Boot extends Phaser.Scene {
	constructor() {
		super('Boot');
	}

	preload() {
	}

	create() {
		console.log('Constructor Boot');
		this.scene.start('Preload');
	}
}