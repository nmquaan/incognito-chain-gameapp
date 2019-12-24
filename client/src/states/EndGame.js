import { FacebookInstantGamesPlugin } from "phaser";

export default class EndGame extends Phaser.Scene {
    constructor() {
        super('EndGame');
    }

    preload() {
        
	}

    create() {
        console.log('Constructor EndGame');
        var winSize = {
            width : this.game.config.width,
            height : this.game.config.height,
        };
        
        //Background Game
		var back = this.add.rectangle(winSize.width * 0.5, winSize.height * 0.5, winSize.width, winSize.height, 0x000000, 0.5);
        back.depth = 0;
        back.alpha = 0.0;

		// Logo Game
        var logo = this.add.image(winSize.width * 0.5, winSize.height * 0.3, 'images_atlat', 'logo.png');
        logo.alpha = 0;

        // Button Download
        var btnDownload = this.add.text(winSize.width * 0.5, winSize.height * 0.6, 'Download Now');
        btnDownload.setOrigin(0.5);
        btnDownload.setScale(1.5);
        btnDownload.depth = 2;
        btnDownload.setInteractive().on('pointerdown', () => {
            FbPlayableAd.onCTAClick();
        });
 
        var timeline = this.tweens.createTimeline();
		timeline.add({
			targets: back,
			alpha: 0.5,
			duration: 700,
			ease: 'Linear',
			repeat: 0
        });

        timeline.add({
			targets: logo,
			alpha: 1.0,
			duration: 400,
			ease: 'Linear',
			repeat: 0
        });

        timeline.play();
	}
	
}