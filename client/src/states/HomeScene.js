import ThemeHelper from '../data/ThemeHelper'
import GameConfig from '../GameConfig'
import GameData from '../data/GameData'
import Cell from '../component/Cell'
import Utils from '../states/Utils'

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

        var text = this.add.text(this.winSize.width * 0.5, this.winSize.height * 0.7, 'Chúc mừng năm mới', { font: "36px Lightmorning", fill: "#ffffff" });
        text.setOrigin(0.5);
        text.setDepth(2);
        text.updateText();

        // var logo = this.add.sprite(this.winSize.width * 0.5, this.winSize.height * 0.2, 'game_images', 'logo.png');
        // logo.setDepth(1);

        // {
        //     // // Best Score
        //     this.bestScoreIcon = this.add.sprite(0, 0, 'game_images', 'icon_crown.png');
        //     this.bestScoreIcon.setOrigin(0.5);
        //     this.bestScoreIcon.setScale(0.8);
        //     this.bestScoreIcon.setTint(Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color));
        //     this.bestScoreIcon.setPosition(this.bestScoreIcon.displayWidth * 0.5, logo.getBottomCenter().y + this.bestScoreIcon.displayHeight * 0.7);

        //     this.bestScoreText = this.add.text(0, 0, GameData.getBestScore().toString(), { font: "36px Oswald-Light", fill: this.currentTheme.bestscore_color });
        //     this.bestScoreText.setOrigin(0.5, 0.5);
        //     this.bestScoreText.updateText();
        //     this.bestScoreText.setDepth(1);
        //     this.bestScoreText.setPosition(this.bestScoreIcon.getRightCenter().x + this.bestScoreText.width * 0.5 + 10, logo.getBottomCenter().y + this.bestScoreIcon.displayHeight * 0.7);

        //     var deltaX = (this.winSize.width - this.bestScoreText.getRightCenter().x) * 0.5;
        //     this.bestScoreIcon.x += deltaX;
        //     this.bestScoreText.x += deltaX;
        // }

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
        
        // // Button Leaderboar
        // {
        //     var iconLeaderboard = this.add.sprite(0, 0, 'game_images', 'icon_rank.png');
        //     iconLeaderboard.setOrigin(0.5);
        //     iconLeaderboard.setDepth(2);

        //     var btnLeaderboard = this.add.nineslice(0, 0, 120, 120, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
        //     btnLeaderboard.setDepth(1);
        //     btnLeaderboard.setOrigin(0.5);
        //     btnLeaderboard.setPosition(this.winSize.width * 0.5 - btnLeaderboard.displayWidth * 0.5 - 50, this.winSize.height * 0.8);
        //     btnLeaderboard.setTint(0xCB87C3, 0xCB87C3, 0xCB87C3, 0xCB87C3);

        //     btnLeaderboard.setInteractive()
        //         .on('pointerdown', function (pointer, localX, localY, event) {
        //             btnLeaderboard.setTint(0xA2709C, 0xA2709C, 0xA2709C, 0xA2709C);
        //         }, this)
        //         .on('pointerup', function (pointer, localX, localY, event) {
        //             btnLeaderboard.setTint(0xCB87C3, 0xCB87C3, 0xCB87C3, 0xCB87C3);

        //         }, this)
        //         .on('pointerout', function (pointer, localX, localY, event) {
        //             btnLeaderboard.setTint(0xCB87C3, 0xCB87C3, 0xCB87C3, 0xCB87C3);
        //         }, this);
        //     iconLeaderboard.setPosition(btnLeaderboard.x, btnLeaderboard.y);
        // }

        // // Button PLAY
        // {
        //     var iconPlay = this.add.sprite(0, 0, 'game_images', 'icon_play.png');
        //     iconPlay.setOrigin(0.5);
        //     iconPlay.setDepth(2);

        //     var btnPlay = this.add.sprite(0, 0, 'game_images', 'button_round_1.png');
        //     btnPlay.setDepth(1);
        //     btnPlay.setOrigin(0.5);
        //     btnPlay.setPosition(this.winSize.width * 0.5, this.winSize.height * 0.5);
        //     btnPlay.setTint(0xE6624D, 0xE6624D, 0xE6624D, 0xE6624D);

        //     btnPlay.setInteractive()
        //         .on('pointerdown', function (pointer, localX, localY, event) {
        //             btnPlay.setTint(0xC1513F, 0xC1513F, 0xC1513F, 0xC1513F);
        //         }, this)
        //         .on('pointerup', function (pointer, localX, localY, event) {
        //             btnPlay.setTint(0xE6624D, 0xE6624D, 0xE6624D, 0xE6624D);
        //             this.moveToGame();
        //         }, this)
        //         .on('pointerout', function (pointer, localX, localY, event) {
        //             btnPlay.setTint(0xE6624D, 0xE6624D, 0xE6624D, 0xE6624D);
        //         }, this);
        //     iconPlay.setPosition(btnPlay.x + 13, btnPlay.y);
        // }

        // this.updateView();
    }

    updateView() {
        this.currentTheme = ThemeHelper.getCurrentTheme();

        if (this.currentTheme.background.sprite.length <= 0) {
            this._backGame.setTexture('game_images', 'default_white.png');
            this._backGame.setScale(this.winSize.height / this._backGame.height);
            this._backGame.depth = 0;
            this._backGame.setTint(0x000000, 0x000000, 0x000000, 0x000000);
            this._backGame.setTint(this.currentTheme.background.color, this.currentTheme.background.color, this.currentTheme.background.color, this.currentTheme.background.color);
        }
        else {
            this._backGame.setTexture('back');
            var scaleRatio = this.winSize.height * 1.0 / this._backGame.height;
            this._backGame.setScale(scaleRatio, scaleRatio);
            this._backGame.depth = 0;
            this._backGame.setTint(this.currentTheme.background.color, this.currentTheme.background.color, this.currentTheme.background.color, this.currentTheme.background.color);
        }

		this.bestScoreIcon.setTint(Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color));
		this.bestScoreText.setColor(this.currentTheme.bestscore_color);
    }

    moveToGame() {
        this.scene.start('MainScene');
    }

    showTheme() {
        this.backPopup = this.add.sprite(this.winSize.width * 0.5, this.winSize.height * 0.5, 'game_images', 'default_white.png');
        this.backPopup.displayWidth = this.winSize.width;
        this.backPopup.displayHeight = this.winSize.height;
        this.backPopup.setDepth(1001);
        this.backPopup.setAlpha(0.8);
        this.backPopup.setTint(0x000000, 0x000000, 0x000000, 0x000000);
        this.backPopup.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
        }, this);

        var popupContent = this.add.container(0, this.winSize.height);
        popupContent.setDepth(1002);
        this.tweens.add({
            targets: popupContent,
            y: 0,
            duration: 400,
            ease: 'Back.easeOut',
        });

        var backPopup = this.add.nineslice(this.winSize.width * 0.5, this.winSize.height * 0.5, 550, 670, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
        backPopup.setOrigin(0.5);
        backPopup.setTint(this.currentTheme.ui_color.common_popup_bg, this.currentTheme.ui_color.common_popup_bg, this.currentTheme.ui_color.common_popup_bg, this.currentTheme.ui_color.common_popup_bg);
        popupContent.add(backPopup);

        // Button Close
        {
            var iconClose = this.add.sprite(0, 0, 'game_images', 'icon_close.png');
            iconClose.setOrigin(0.5);
            iconClose.setScale(0.5);

            var btnClose = this.add.sprite(0, 0, 'game_images', 'button_round.png');
            btnClose.setOrigin(0.5);
            btnClose.setScale(0.3);
            btnClose.setPosition(backPopup.getRightCenter().x - btnClose.displayWidth * 0.5 - 15, backPopup.getTopCenter().y + btnClose.displayHeight * 0.5 + 30);
            btnClose.setTint(0x9ACA3B, 0x9ACA3B, 0x9ACA3B, 0x9ACA3B);
            popupContent.add(btnClose);
            popupContent.add(iconClose);

            btnClose.setInteractive()
                .on('pointerdown', function (pointer, localX, localY, event) {
                    btnClose.setTint(0x85AE34, 0x85AE34, 0x85AE34, 0x85AE34);
                }, this)
                .on('pointerup', function (pointer, localX, localY, event) {
                    btnClose.setTint(0x9ACA3B, 0x9ACA3B, 0x9ACA3B, 0x9ACA3B);

                    this.tweens.add({
                        targets: popupContent,
                        y: this.winSize.height,
                        duration: 400,
                        ease: 'Back.easeIn',
                        onComplete: function () {
                            this.backPopup.destroy();
                            popupContent.destroy();
                        },
                        onCompleteScope: this
                    });
                }, this)
                .on('pointerout', function (pointer, localX, localY, event) {
                    btnClose.setTint(0x9ACA3B, 0x9ACA3B, 0x9ACA3B, 0x9ACA3B);
                }, this);
            iconClose.setPosition(btnClose.x, btnClose.y);
        }

        // Panel Score
        var backScore = this.add.nineslice(0, 0, 500, 100, { key: 'game_images', frame: 'button_0.png' }, [28, 28, 38, 28]);
        backScore.setAlpha(100.0 / 255);
        backScore.setOrigin(0.5);
        backScore.setPosition(backPopup.x, backPopup.getTopCenter().y + 250);
        backScore.setTint(0x000000, 0x000000, 0x000000, 0x000000);
        popupContent.add(backScore);
        {
            var labCoin = this.add.text(0, 0, "Tap to choose theme", { font: "45px Oswald-Light", fill: "#ffffff" });
            labCoin.setText("Tap to choose theme");
            labCoin.setOrigin(0.5);
            labCoin.updateText();
            labCoin.setPosition(backScore.getLeftCenter().x + 30 + labCoin.width * 0.5, backScore.y - 4);
            popupContent.add(labCoin);
        }

        // Theme Day
        {
            var themeDayContent = this.add.container(0, this.winSize.height);
            themeDayContent.setPosition(backPopup.getCenter().x - backPopup.displayWidth * 0.2, (backPopup.getBottomCenter().y + backScore.getBottomCenter().y) * 0.5);
            popupContent.add(themeDayContent);

            var themeDayBack = this.add.nineslice(0, 0, 180, 220, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
            themeDayBack.setOrigin(0.5);
            themeDayBack.setTint(0x4DA3BB, 0x4493A9, 0x4DA3BB, 0x4DA3BB);
            themeDayContent.add(themeDayBack);
            themeDayBack.setInteractive()
                .on('pointerdown', function (pointer, localX, localY, event) {
                    themeDayBack.setTint(0x4493A9, 0x4493A9, 0x4493A9, 0x4493A9);
                }, this)
                .on('pointerup', function (pointer, localX, localY, event) {
                    themeDayBack.setTint(0x4DA3BB, 0x4DA3BB, 0x4DA3BB, 0x4DA3BB);
                    this.tweens.add({
                        targets: popupContent,
                        y: this.winSize.height,
                        duration: 400,
                        ease: 'Back.easeIn',
                        onComplete: function () {
                            this.backPopup.destroy();
                            popupContent.destroy();
                            GameData.setThemeID(ThemeHelper.getThemeDay().id);
                            var result = {
								themeID: GameData.getThemeID()
							};
							this.facebook.saveStats(result);
                            this.updateView();
                        },
                        onCompleteScope: this
                    });
                }, this)
                .on('pointerout', function (pointer, localX, localY, event) {
                    themeDayBack.setTint(0x4DA3BB, 0x4DA3BB, 0x4DA3BB, 0x4DA3BB);
                }, this);

            var themeDayTitle = this.add.text(0, 0, "Day", { font: "30px Oswald-Light", fill: "#ffffff" });
            themeDayTitle.setOrigin(0.5);
            themeDayTitle.updateText();
            themeDayTitle.setPosition(themeDayBack.x, themeDayBack.getTopCenter().y + themeDayTitle.height * 0.5 + 10);
            themeDayContent.add(themeDayTitle);

            var tileWidth = GameConfig.getBlockSize().width * 0.7;
            var tileHeight = GameConfig.getBlockSize().height * 0.7;
            var spaceWidth = GameConfig.getSpaceBlock().width * 0.7;
            var spaceHeight = GameConfig.getSpaceBlock().height * 0.7;

            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    var cell = new Cell(this, 0);
                    cell.setCellSize(tileWidth, tileHeight, spaceWidth, spaceHeight);
                    cell.setPosition(-tileWidth * 0.5 - spaceWidth * 0.5 + i * (tileWidth + spaceWidth), -tileHeight * 0.5 - spaceHeight * 0.5 + j * (tileHeight + spaceHeight));
                    cell.setSpriteFrame(ThemeHelper.getThemeDay().block.sprite);
                    cell.setCellColor(ThemeHelper.getThemeDay().block.colors_on_grid[0]);
                    themeDayContent.add(cell);
                }
            }

            var themeDayNameBack = this.add.nineslice(0, 0, 180, 60, { key: 'game_images', frame: 'panel_1.png' }, [0, 11, 18, 11]);
            themeDayNameBack.setOrigin(0.5);
            themeDayNameBack.setTint(0xEC6848, 0xEC6848, 0xEC6848, 0xEC6848);
            themeDayNameBack.setPosition(themeDayBack.x, themeDayBack.getBottomCenter().y - themeDayNameBack.height * 0.5);
            themeDayContent.add(themeDayNameBack);

            var themeDayAction = this.add.text(0, 0, "Selected", { font: "30px Oswald-Light", fill: "#ffffff" });
            themeDayAction.setOrigin(0.5);
            themeDayAction.updateText();
            themeDayAction.setPosition(themeDayNameBack.x, themeDayNameBack.y - 5);
            themeDayContent.add(themeDayAction);
        }

        // Theme Wood
        {
            var themeWoodContent = this.add.container(0, this.winSize.height);
            themeWoodContent.setPosition(backPopup.getCenter().x + backPopup.displayWidth * 0.2, (backPopup.getBottomCenter().y + backScore.getBottomCenter().y) * 0.5);
            popupContent.add(themeWoodContent);

            var themeWoodBack = this.add.nineslice(0, 0, 180, 220, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
            themeWoodBack.setOrigin(0.5);
            themeWoodBack.setTint(0x245232, 0x245232, 0x245232, 0x245232);
            themeWoodContent.add(themeWoodBack);
            themeWoodBack.setInteractive()
                .on('pointerdown', function (pointer, localX, localY, event) {
                    themeWoodBack.setTint(0x1A3A23, 0x1A3A23, 0x1A3A23, 0x1A3A23);
                }, this)
                .on('pointerup', function (pointer, localX, localY, event) {
                    themeWoodBack.setTint(0x245232, 0x245232, 0x245232, 0x245232);
                    this.tweens.add({
                        targets: popupContent,
                        y: this.winSize.height,
                        duration: 400,
                        ease: 'Back.easeIn',
                        onComplete: function () {
                            this.backPopup.destroy();
                            popupContent.destroy();
                            GameData.setThemeID(ThemeHelper.getThemeWood().id);
                            var result = {
								themeID: GameData.getThemeID()
							};
							this.facebook.saveStats(result);
                            this.updateView();
                        },
                        onCompleteScope: this
                    });
                }, this)
                .on('pointerout', function (pointer, localX, localY, event) {
                    themeWoodBack.setTint(0x245232, 0x245232, 0x245232, 0x245232);
                }, this);

            var themeWoodTitle = this.add.text(0, 0, "Wood", { font: "30px Oswald-Light", fill: "#ffffff" });
            themeWoodTitle.setOrigin(0.5);
            themeWoodTitle.updateText();
            themeWoodTitle.setPosition(themeWoodBack.x, themeWoodBack.getTopCenter().y + themeWoodTitle.height * 0.5 + 10);
            themeWoodContent.add(themeWoodTitle);

            var tileWidth = GameConfig.getBlockSize().width * 0.7;
            var tileHeight = GameConfig.getBlockSize().height * 0.7;
            var spaceWidth = GameConfig.getSpaceBlock().width * 0.7;
            var spaceHeight = GameConfig.getSpaceBlock().height * 0.7;

            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 2; j++) {
                    var cell = new Cell(this, 0);
                    cell.setSpriteFrame(ThemeHelper.getThemeWood().block.sprite);
                    cell.setCellSize(tileWidth, tileHeight, spaceWidth, spaceHeight);
                    cell.setPosition(-tileWidth * 0.5 - spaceWidth * 0.5 + i * (tileWidth + spaceWidth), -tileHeight * 0.5 - spaceHeight * 0.5 + j * (tileHeight + spaceHeight));
                    cell.setCellColor(ThemeHelper.getThemeWood().block.colors_on_grid[0]);
                    themeWoodContent.add(cell);
                }
            }

            var themeWoodNameBack = this.add.nineslice(0, 0, 180, 60, { key: 'game_images', frame: 'panel_1.png' }, [0, 11, 18, 11]);
            themeWoodNameBack.setOrigin(0.5);
            themeWoodNameBack.setTint(0xEC6848, 0xEC6848, 0xEC6848, 0xEC6848);
            themeWoodNameBack.setPosition(themeWoodBack.x, themeWoodBack.getBottomCenter().y - themeWoodNameBack.height * 0.5);
            themeWoodContent.add(themeWoodNameBack);

            var themeWoodAction = this.add.text(0, 0, "Selected", { font: "30px Oswald-Light", fill: "#ffffff" });
            themeWoodAction.setOrigin(0.5);
            themeWoodAction.updateText();
            themeWoodAction.setPosition(themeWoodNameBack.x, themeWoodNameBack.y - 5);
            themeWoodContent.add(themeWoodAction);
        }

        var labTitle = this.add.text(0, 0, "THEME", { font: "70px Oswald-Regular", fill: "#ffffff" });
        labTitle.setOrigin(0.5);
        labTitle.setDepth(1005);
        labTitle.updateText();
        labTitle.setPosition(backPopup.getLeftCenter().x + labTitle.width * 0.5 + 35, backPopup.getTopCenter().y + labTitle.height * 0.5 + 30);
        popupContent.add(labTitle);
    }
}