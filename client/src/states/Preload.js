import GameData from '../data/GameData'

export default class Preload extends Phaser.Scene {
	constructor() {
		super('Preload');
	}

	preload() {
		this.load.image('back_home', 'assets/back_home.jpg');
		this.load.image('back_gameplay', 'assets/back_gameplay.jpg');
		this.load.image('back_profile', 'assets/back_profile.jpg');
		this.load.multiatlas('game_images', 'assets/game_images.json', 'assets');
		GameData.init();
	}

	create() {
		console.log('START GAME');
		this.scene.start('HomeScene');
	}
}