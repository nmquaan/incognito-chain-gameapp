export default class HomeScene extends Phaser.Scene {
    constructor() {
        super('HomeScene');
    }

    preload() {

    }

    create() {
        this.winSize = {
            width: this.game.config.width,
            height: this.game.config.height,
        };
        
        this._backGame = this.add.image(this.winSize.width * 0.5, this.winSize.height * 0.5, 'back_home');
        this._backGame.depth = 0;
        
        var logoNY = this.add.image(this.winSize.width * 0.5, this.winSize.height * 0.5, 'game_images', 'img_logo.png');
        logoNY.depth = 1;

        var text = this.add.text(this.winSize.width * 0.5, this.winSize.height * 0.7, 'Happy New Year!!!', { font: "36px Lightmorning", fill: "#ffffff" });
        text.setOrigin(0.5);
        text.setDepth(2);
        text.updateText();

        // Button Theme
        {
            var labPlay = this.add.text(0, 0, 'Play', { font: "50px Lightmorning", fill: "#e74c3c" });
            labPlay.setOrigin(0.5);
            labPlay.setDepth(2);
            labPlay.updateText();

            var btnPlay = this.add.nineslice(0, 0, 350, 120, { key: 'game_images', frame: 'panel_0.png' }, [29, 40, 29, 40]);
            btnPlay.setDepth(1);
            btnPlay.setOrigin(0.5);
            btnPlay.setPosition(this.winSize.width * 0.5, this.winSize.height * 0.8);
            btnPlay.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);

            btnPlay.setInteractive()
                .on('pointerdown', function (pointer, localX, localY, event) {
                    btnPlay.setTint(0xF7FBF9, 0xF7FBF9, 0xF7FBF9, 0xF7FBF9);
                }, this)
                .on('pointerup', function (pointer, localX, localY, event) {
                    btnPlay.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
                    this.moveToGame();
                }, this)
                .on('pointerout', function (pointer, localX, localY, event) {
                    btnPlay.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
                }, this);
            labPlay.setPosition(btnPlay.x, btnPlay.y);
        }
    }

    moveToGame() {
        this.scene.start('MainScene');
    }
}