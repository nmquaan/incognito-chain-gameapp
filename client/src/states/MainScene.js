import UIButtonSprite from '../component/UIButtonSprite'
import Coin from '../component/Coin'
import GameData from '../data/GameData'

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
	}

	create() {
		this.winSize = {
			width: this.game.config.width,
			height: this.game.config.height,
		};

		this._positionOnPlate = [];
		this._valueDices = [];
		this._costBets = [1, 5, 10, 25, 50, 100];
		this._betTarget = -1;
		this._money = GameData.getMoney();

		this._pendingBetValue = 0;

		this.itemIcons = [];
		this.itemButtons = [];
		this._betValues = {};
		this._resultValues = [];

		this.initGame();
		this.initUI();
	}

	initGame() {
		this._backGame = this.add.image(this.winSize.width * 0.5, this.winSize.height * 0.5, 'back_gameplay');
		this._backGame.depth = 0;

		this._mainComponent = this.add.container(0, 0);
		this._mainComponent.setDepth(2);
		this._mainComponent.setPosition(this.winSize.width * 0.5, this.winSize.height * 0.3);

		this._plate = this.add.image(0, 0, 'game_images', 'plate.png');
		this._plate.setDepth(1);
		this._plate.setOrigin(0.5);
		this._mainComponent.add(this._plate);
		this._mainComponent.height = this._plate.height;
		this._mainComponent.width = this._plate.width;

		this._positionOnPlate.push({
			x: this._plate.getCenter().x - this._plate.displayWidth * 0.25,
			y: this._plate.getCenter().y - this._plate.displayHeight * 0.2,
		});
		this._positionOnPlate.push({
			x: this._plate.getCenter().x + this._plate.displayWidth * 0.25,
			y: this._plate.getCenter().y - this._plate.displayHeight * 0.2,
		});
		this._positionOnPlate.push({
			x: this._plate.getCenter().x,
			y: this._plate.getCenter().y - this._plate.displayHeight * 0.1,
		});

		var startX = this.winSize.width * 0.5 - 230;
		var startY = this._mainComponent.y + this._mainComponent.displayHeight * 0.5 + 100;

		this.showBetLayer = this.showBetLayer.bind(this);
		for (var row = 0; row < 2; row++) {
			for (var col = 0; col < 3; col++) {
				var index = row * 3 + col;

				var iconItem = this.add.sprite(0, 0, 'game_images', 'item_' + index.toString() + '.png');
				iconItem.setOrigin(0.5);
				iconItem.setDepth(2);

				var btnItem = new UIButtonSprite(this, 0, 0, 'game_images', 'btn_node_normal.png', 'btn_node_selected.png', function (gameObject) {
					this._betTarget = gameObject.getIndex();
					this.showBetLayer();
				}, this);
				btnItem.setIndex(index);
				this.add.existing(btnItem);

				btnItem.setOrigin(0.5);
				btnItem.setScale(0.9);
				btnItem.setDepth(1);
				btnItem.setPosition(startX + 230 * col, startY + btnItem.displayHeight * (row + 0.7));
				btnItem.addChild(iconItem);
				this.itemButtons.push(btnItem);
				iconItem.setPosition(btnItem.x, btnItem.y);
			}
		}

		{
			var btnStart = this.add.nineslice(0, 0, 250, 80, { key: 'game_images', frame: 'panel_0.png' }, [29, 40, 29, 40]);
			btnStart.setDepth(1);
			btnStart.setOrigin(0.5);
			btnStart.setPosition(this.winSize.width * 0.5, (this._mainComponent.y + this._mainComponent.displayHeight * 0.6 + this.itemButtons[0].getTopCenter().y) * 0.5);
			btnStart.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);

			btnStart.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnStart.setTint(0xF7FBF9, 0xF7FBF9, 0xF7FBF9, 0xF7FBF9);
					btnStart.setScale(0.9);
					labStart.setScale(0.9);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnStart.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
					btnStart.setScale(1);
					labStart.setScale(1);
					this._pendingBetValue = 0;
					this.shakeBowl();
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnStart.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
					btnStart.setScale(1);
					labStart.setScale(1);
				}, this);

			var labStart = this.add.text(btnStart.x, btnStart.y, 'Play', { font: "40px Lightmorning", fill: "#e74c3c" });
			labStart.setOrigin(0.5);
			labStart.setDepth(2);
			labStart.updateText();
		}

		this._bowl = this.add.sprite(0, 0, 'game_images', 'bowl.png');
		this._bowl.setDepth(5);
		this._bowl.setScale(1.05);
		this._bowl.setOrigin(0.5);
		this._bowl.setPosition(this.winSize.width * 1.5, this._plate.y - this._plate.displayHeight * 0.8);
		this._mainComponent.add(this._bowl);
		this.updatePlateAfterShakeDice();
	}

	shakeBowl() {
		this._resultValues = [];
		var timeline = this.tweens.createTimeline();
		this._mainComponent.moveTo(this._bowl, this._mainComponent.length - 1);

		// Close Plate
		timeline.add({
			targets: this._bowl,
			x: this._plate.x,
			y: this._plate.y - this._plate.displayHeight * 0.42,
			duration: 400,
			ease: 'Linear',
			yoyo: false,
			onComplete: function () {
				this.updatePlateAfterShakeDice();
			},
			callbackScope: this
		});

		// Shake bowl
		var xContainer = this._mainComponent.x;
		var yContainer = this._mainComponent.y;

		for (var i = 0; i < 3; i++) {
			timeline.add({
				targets: this._mainComponent,
				x: xContainer + 50,
				y: yContainer - 50,
				duration: 300,
				ease: 'Linear',
				yoyo: false,
			});

			timeline.add({
				targets: this._mainComponent,
				x: xContainer,
				y: yContainer,
				duration: 200,
				ease: 'Linear',
				yoyo: false,
			});

			timeline.add({
				targets: this._mainComponent,
				x: xContainer - 50,
				y: yContainer - 50,
				duration: 200,
				ease: 'Linear',
				yoyo: false,
			});

			timeline.add({
				targets: this._mainComponent,
				x: xContainer,
				y: yContainer,
				duration: 200,
				ease: 'Linear',
				yoyo: false
			});
		}


		timeline.add({
			targets: this._bowl,
			x: this.winSize.width * 1.5,
			y: this._plate.y - this._plate.displayHeight * 0.8,
			duration: 400,
			ease: 'Linear',
			yoyo: false,
			onComplete: function () {
				this.checkResult();
			},
			callbackScope: this
		});
		timeline.play();
	}

	checkResult() {

		var multiBet = [0, 0, 0, 0, 0, 0];
		this._resultValues.forEach(element => {
			multiBet[element]++;
		});

		var timeline = this.tweens.createTimeline();
		for (var i = 0; i < 6; i++) {
			var multiValue = multiBet[i];

			var key = "bet_" + i.toString();
			var isHaveKey = (key in this._betValues);
			if (isHaveKey) {
				var bets = this._betValues[key];
				bets.forEach(coin => {
					if (multiValue > 0) {
						timeline.add({
							targets: coin,
							x: this._labMoney.x,
							y: this._labMoney.y,
							duration: 300,
							ease: 'Quad.easeIn',
							onComplete: function () {
								console.log("Current value = ", this._money);
								console.log("Adding value = ", coin.getValue());
								this.addMoney(coin.getValue() * multiValue + coin.getValue());
								coin.destroy();
							},
							callbackScope: this
						});
					}
					else {
						coin.destroy();
					}
				});
			}
		}

		timeline.add({
			targets: this._mainComponent,
			alpha: 1,
			duration: 1,
			onComplete: function () {
				console.log('Clear bets');
				this._betValues = {};
			},
			callbackScope: this
		});

		timeline.play();
	}

	updatePlateAfterShakeDice() {
		if (this._valueDices != null) {
			this._valueDices.forEach(element => {
				element.destroy();
			});
		}
		this._valueDices = [];
		this._resultValues = [];

		while (this._valueDices.length < 3) {
			var index = Math.floor(Math.random() * 606) % 6;
			this._resultValues.push(index);
			var dice = this.add.sprite(0, 0, 'game_images', 'dice_' + index.toString() + '.png');
			dice.setDepth(2);
			dice.setAlpha(1);
			dice.setOrigin(0.5);
			dice.setScale(0.85, 0.85);
			this._valueDices.push(dice);
			this._mainComponent.add(dice);
			this._mainComponent.moveTo(this._bowl, this._mainComponent.length - 1);
		}

		for (var i = 0; i < this._valueDices.length; i++) {
			this._valueDices[i].x = this._positionOnPlate[i].x;
			this._valueDices[i].y = this._positionOnPlate[i].y;
		}
	}

	initUI() {
		var winSize = {
			width: this.game.config.width,
			height: this.game.config.height,
		};

		// Button Theme
		{
			var labBack = this.add.text(0, 0, 'Back', { font: "40px Lightmorning", fill: "#e74c3c" });
			labBack.setOrigin(0.5);
			labBack.setDepth(11);
			labBack.updateText();

			var btnBack = this.add.nineslice(0, 0, 200, 80, { key: 'game_images', frame: 'panel_0.png' }, [29, 40, 29, 40]);
			btnBack.setDepth(10);
			btnBack.setOrigin(0.5);
			btnBack.setPosition(120, 60);
			btnBack.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);

			btnBack.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnBack.setTint(0xF7FBF9, 0xF7FBF9, 0xF7FBF9, 0xF7FBF9);
					btnBack.setScale(0.9);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnBack.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
					btnBack.setScale(1);
					if (this._pendingBetValue > 0) {
						this.addMoney(this._pendingBetValue);
					}
					this.moveToHome();
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnBack.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
					btnBack.setScale(1);
				}, this);
			labBack.setPosition(btnBack.x, btnBack.y);
		}

		{
			var backScore = this.add.nineslice(0, 0, 500, 100, { key: 'game_images', frame: 'border.png' }, [48, 48, 48, 48]);
			backScore.setDepth(10);
			backScore.setOrigin(0.5);
			backScore.setScale(0.8);
			backScore.setPosition(this.winSize.width - backScore.displayWidth * 0.5 - 20, backScore.displayHeight * 0.5 + 20);

			this._labMoney = this.add.text(0, 0, 'BCTC ' + this._money.toString(), { font: "35px Lightmorning", fill: "#e74c3c" });
			this._labMoney.setDepth(11);
			this._labMoney.setOrigin(0.5);
			this._labMoney.setPosition(backScore.x, backScore.y);
		}
	}

	moveToHome() {
		this.scene.start('HomeScene');
	}

	updateMoney() {
		this._labMoney.setText('BTBC ' + this._money.toString());
		this._labMoney.updateText();
	}

	consumeMoney(value) {
		this._money -= value;
		GameData.setMoney(this._money);
		this._labMoney.setText('BTBC ' + this._money.toString());
		this._labMoney.updateText();
	}

	addMoney(value) {
		this._money += value;
		GameData.setMoney(this._money);
		this._labMoney.setText('BTBC ' + this._money.toString());
		this._labMoney.updateText();
	}

	updateBestscoreUI() {
		this.bestScoreText.updateText();

		this.bestScoreIcon.x = this.bestScoreIcon.displayWidth * 0.5;
		this.bestScoreText.x = this.bestScoreIcon.getRightCenter().x + 10 + this.bestScoreText.width * 0.5;

		var deltaX = (this.winSize.width - this.bestScoreText.getRightCenter().x) * 0.5;
		this.bestScoreIcon.x += deltaX;
		this.bestScoreText.x += deltaX;
	}

	showBetLayer() {
		var popupContent = this.add.container(0, this.winSize.height);
		popupContent.setDepth(1002);
		this.tweens.add({
			targets: popupContent,
			y: 0,
			duration: 400,
			ease: 'Back.easeOut',
		});

		var back = this.add.sprite(this.winSize.width * 0.5, this.winSize.height, 'game_images', 'default.png');
		back.displayWidth = this.winSize.width;
		back.displayHeight = this.winSize.height - this._mainComponent.y - this._mainComponent.height * 0.5 - 20;
		back.setOrigin(0.5);
		back.setDepth(10);
		back.setAlpha(0.9);
		back.setTint(0x000000, 0x000000, 0x000000, 0x000000);
		back.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
		}, this);
		back.setPosition(this.winSize.width * 0.5, this.winSize.height - back.displayHeight * 0.5);
		popupContent.add(back);

		// Title
		var labTitle = this.add.text(this.winSize.width * 0.5, this.winSize.height - back.displayHeight, 'Choose Bet value:', { font: "50px Lightmorning", fill: "#e74c3c" });
		labTitle.setOrigin(0.5);
		labTitle.setDepth(2);
		labTitle.updateText();
		labTitle.y += labTitle.frame.height * 0.5 + 20;

		popupContent.add(labTitle)

		var widthItem = 220;
		var startX = this.winSize.width * 0.5 - widthItem * 1.5;
		var startY = labTitle.getBottomCenter().y + 20 + widthItem * 0.5;
		var bottomY = 0;

		for (var row = 0; row < 2; row++) {
			for (var col = 0; col < 3; col++) {
				var index = row * 3 + col;

				var frame = 'icon_' + this._costBets[index].toString() + '.png';
				var btnBet = new UIButtonSprite(this, 0, 0, 'game_images', frame, frame, function (gameObject) {

					if (this._money < gameObject.getIndex()) {
						this._noticeMessage.setText("Not enough BCTC to play");
						var timeline1 = this.tweens.createTimeline();
						timeline1.add({
							targets: this._noticeMessage,
							alpha: 1,
							duration: 100,
							ease: 'Linear'
						});
						timeline1.add({
							targets: this._noticeMessage,
							alpha: 1,
							duration: 500,
							ease: 'Linear'
						});
						timeline1.add({
							targets: this._noticeMessage,
							alpha: 0,
							duration: 150,
							ease: 'Linear'
						});
						timeline1.play();
					}
					else {
						this.tweens.add({
							targets: popupContent,
							y: this.winSize.height,
							duration: 400,
							ease: 'Back.easeIn',
							onComplete: function () {
								this.consumeMoney(gameObject.getIndex());
								popupContent.destroy();
								this.addCoinBetOnBoard(gameObject.getIndex());
							},
							onCompleteScope: this
						});
					}
				}, this);
				popupContent.add(btnBet);
				btnBet.setIndex(this._costBets[index]);
				btnBet.setOrigin(0.5);
				btnBet.setDepth(11);
				btnBet.setPosition(startX + widthItem * 0.5 + widthItem * col, startY + widthItem * row);
				bottomY = btnBet.getBottomCenter().y;
			}
		}

		// Button Theme
		{
			var btnClose = this.add.nineslice(0, 0, 250, 80, { key: 'game_images', frame: 'panel_0.png' }, [29, 40, 29, 40]);
			btnClose.setDepth(1);
			btnClose.setOrigin(0.5);
			btnClose.setPosition(this.winSize.width * 0.5, this.winSize.height - 60);
			btnClose.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);

			btnClose.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnClose.setTint(0xF7FBF9, 0xF7FBF9, 0xF7FBF9, 0xF7FBF9);
					this.tweens.add({
						targets: popupContent,
						y: this.winSize.height,
						duration: 400,
						ease: 'Back.easeIn',
						onComplete: function () {
							popupContent.destroy();
						},
						onCompleteScope: this
					});
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnClose.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
					// this.moveToGame();
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnClose.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
				}, this);
			popupContent.add(btnClose);

			var labClose = this.add.text(btnClose.x, btnClose.y, 'Close', { font: "40px Lightmorning", fill: "#e74c3c" });
			labClose.setOrigin(0.5);
			labClose.updateText();
			popupContent.add(labClose);
		}

		// Notice Message
		{
			this._noticeMessage = this.add.text(this.winSize.width * 0.5, (bottomY + btnClose.getTopCenter().y) * 0.5, '', { font: "40px Lightmorning", fill: "#e74c3c" });
			this._noticeMessage.setOrigin(0.5);
			this._noticeMessage.updateText();
			this._noticeMessage.setAlpha(0);
			popupContent.add(this._noticeMessage);
		}
	}

	addCoinBetOnBoard(betCoin) {
		var key = "bet_" + this._betTarget.toString();
		var isHaveKey = (key in this._betValues);
		if (!isHaveKey) {
			this._betValues[key] = [];
		}

		this._pendingBetValue += betCoin;
		console.log('len = ', this._betValues[key].length);
		var distance = this.itemButtons[this._betTarget].displayWidth * 0.5 * 0.7;
		var scale = this._betValues[key].length * 0.05 * distance;

		var position = new Phaser.Math.Vector2(1, 0);

		// var directObj = this.add.sprite()
		var direct = (new Phaser.Math.Vector2(1, 0)).subtract(new Phaser.Math.Vector2(-1, 0));

		position = position.add(direct.multiply(new Phaser.Math.Vector2(scale, scale)));
		position.normalize();
		position.multiply(new Phaser.Math.Vector2(-distance, -distance));

		position.x += this.itemButtons[this._betTarget].x;
		position.y += this.itemButtons[this._betTarget].y;
		var coin = new Coin(this, betCoin);
		coin.setPosition(this._labMoney.x, this._labMoney.y);
		this.add.existing(coin);

		coin.setDepth(5);
		coin.setOrigin(0.5);
		this._betValues[key].push(coin);

		this.tweens.add({
			targets: coin,
			x: position.x,
			y: position.y,
			duration: 400,
			ease: 'Back.easeOut',
		});
	}

}