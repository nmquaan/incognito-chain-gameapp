import 'phaser'
import Boot from './states/Boot'
import Preload from './states/Preload'
import HomeScene from './states/HomeScene'
import MainScene from './states/MainScene'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'
import GameData from './data/GameData'
import rexButton from './plugins/button.js'
import ButtonPlugin from './plugins/button-plugin.js'
import ShakePlugin from './plugins/shakeposition-plugin.js'

class Game extends Phaser.Game {

	constructor() {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		var gameWidth = windowHeight / 1.77;
		console.log(gameWidth);

		let gameConfig = {
			type: Phaser.AUTO,
			resolution: 1,
			scale: {
				mode: Phaser.Scale.FIT,
				parent: 'phaser-example',
				autoCenter: Phaser.Scale.CENTER_BOTH,
				width: 720,
				height: 1280
			},
			scene: [Boot, Preload, HomeScene, MainScene],
			backgroundColor: "#ffffff",
			plugins: {
				global: [
					NineSlicePlugin.DefaultCfg,
					{
						key: 'rexButton',
						plugin: ButtonPlugin,
						start: true
					},
					{
						key: 'rexShake',
						plugin: ShakePlugin,
						start: true
					}
				],
			},
		};
		super(gameConfig);
	}

	onPause() {

	}
}

var game = new Game();