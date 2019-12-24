import Boot from './states/Boot'
import Preload from './states/Preload'
import Tutorial from './states/Tutorial'
import HomeScene from './states/HomeScene'
import MainScene from './states/MainScene'
import EndGame from './states/EndGame'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'
import GameData from './data/GameData'
import rexButton from './plugins/button.js';
import ButtonPlugin from './plugins/button-plugin.js';

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
			scene: [Boot, Preload, Tutorial, HomeScene, MainScene, EndGame],
			backgroundColor: "#ffffff",
			plugins: {
				global: [
					NineSlicePlugin.DefaultCfg,
					{
						key: 'rexButton',
						plugin: ButtonPlugin,
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