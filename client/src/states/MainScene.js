import Cell from '../component/Cell'
import Block from '../component/Block'
import TutorialData from '../data/TutorialData'
import GameConfig from '../GameConfig'
import BlockHelper from '../data/BlockHelper'
import ThemeHelper from '../data/ThemeHelper'
import Utils from '../states/Utils'
import GameData from '../data/GameData'
import ImageButton from '../component/ImageButton';

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
		this.OnPointerUp = this.OnPointerUp.bind(this);
		this.OnPointerMove = this.OnPointerMove.bind(this);
		this.OnPointerDown = this.OnPointerDown.bind(this);
	}

	create() {
		this.winSize = {
			width: this.game.config.width,
			height: this.game.config.height,
		};

		// this.currentTheme = ThemeHelper.getCurrentTheme();
		// this.Rows = 9;
		// this.Columns = 9;

		// this._countScore = 0;
		// this._deltaScore = 0;
		// this._score = 0;
		// this._bestScore = GameData.getBestScore();
		// this._timerUpdateScore = null;

		// this._tileWidth = GameConfig.getBlockSize().width;
		// this._tileHeight = GameConfig.getBlockSize().height;
		// this._tileSpaceX = GameConfig.getSpaceBlock().width;
		// this._tileSpaceY = GameConfig.getSpaceBlock().height;

		// this._callbackTouchedDown = null;
		// this._callbackTouchedUp = null;
		// this._callbackTouchedMove = null;

		this.itemIcons = [];
		this.itemButtons = [];
		// this.blocks = [];
		// this.dragBlocks = [];

		// this._deltaYDragging = 220;
		// this._indexDraggingBlock = -1;
		// this._draggingBlock = null;
		// this._isGameOver = false;
		// this._grid = [];
		// this._zones = new Array(9);
		// this._mainLines = new Array();
		// this._subLines = new Array();
		// this._boardInfo = {};

		// for (var i = 0; i < 9; i++) {
		// 	this._zones[i] = new Array();
		// }

		// this.blocks = [];
		// for (var row = 0; row < this.Rows; row++) {
		// 	this.blocks[row] = new Array(this.Columns);
		// 	for (var col = 0; col < this.Columns; col++) {
		// 		this.blocks[row][col] = null;
		// 	}
		// }

		// // Highlights
		// this._highlightCellDragging = [];
		// this._highlightCells = [];

		this.initGame();
		// this.loadDragBlock();
		// this.initAnimation();
		// this.enableInput(true);
		this.initUI();
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

		for (var row = 0; row < this.Rows; row++) {
			for (var col = 0; col < this.Columns; col++) {
				var color = 0xffffff;
				if (row < 3) {
					if (col < 3)
						color = this.currentTheme.grid.colors[0];
					else if (col < 6)
						color = this.currentTheme.grid.colors[1];
					else
						color = this.currentTheme.grid.colors[0];
				}
				else if (row < 6) {
					if (col < 3)
						color = this.currentTheme.grid.colors[1];
					else if (col < 6)
						color = this.currentTheme.grid.colors[0];
					else
						color = this.currentTheme.grid.colors[1];
				}
				else {
					if (col < 3)
						color = this.currentTheme.grid.colors[0];
					else if (col < 6)
						color = this.currentTheme.grid.colors[1];
					else
						color = this.currentTheme.grid.colors[0];
				}
				this._grid[row][col].setTint(color, color, color, color);

				if (this.blocks[row][col] != null) {
					this.blocks[row][col].setSpriteFrame(this.currentTheme.block.sprite);
					this.blocks[row][col].setCellColor(this.currentTheme.block.colors_on_grid[row]);
				}
			}
		}

		// Update line
		this._mainLines.forEach(line => {
			line.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
		});
		this._subLines.forEach(line => {
			line.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
		});

		// Update dragging block
		for (var i = 0; i < 3; i++) {
			if (this.dragBlocks[i] != null) {
				this.dragBlocks[i].updateView();
			}
		}

		this.scoreText.setColor(this.currentTheme.score_color);
		this.bestScoreIcon.setTint(Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color));
		this.bestScoreText.setColor(this.currentTheme.bestscore_color);

		this.btnTheme.setTint(Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color));
		this.btnPause.setTint(Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color));
	}

	initGame() {
		this._backGame = this.add.image(this.winSize.width * 0.5, this.winSize.height * 0.5, 'back_gameplay');
		this._backGame.depth = 0;

		var startX = this.winSize.width * 0.5 - 230 * 1.5;
		var startY = this.winSize.height * 0.5;

		for (var row = 0; row < 2; row++) {
			for (var col = 0; col < 3; col++) {
				var index = row * 3 + col;

				var iconItem = this.add.text(0, 0, 'Back', { font: "40px Lightmorning", fill: "#e74c3c" });
				iconItem.setOrigin(0.5);
				iconItem.setDepth(2);
				iconItem.updateText();
				
				var btn = new ImageButton(this, 0, 0, 'game_images', 'btn_node_normal.png', 'btn_node_selected.png', function() {

				});
				btn.addChild(iconItem);
				btn.setPosition(startX + btn.displayWidth * 0.5 + 230 * col, startY - btn.displayHeight * row);

				// this.itemIcons.push(iconItem);

				// var iconButton = this.add.sprite(0, 0, 'game_images', 'btn_node_normal.png');
				// iconButton.setDepth(1);
				// iconButton.setOrigin(0.5);
				// iconButton.setPosition(startX + iconButton.displayWidth * 0.5 + 230 * col, startY - iconButton.displayHeight * row);
				// iconButton.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
				// this.itemButtons.push(iconButton);
				
				// iconButton.setInteractive()
				// 	.on('pointerdown', function (hitArea, x, y, gameObject) {
				// 		console.log(gameObject);
				// 		this.itemButtons[index].setFrame('btn_node_selected.png');
				// 		this.itemButtons[index].setTint(0xF7FBF9, 0xF7FBF9, 0xF7FBF9, 0xF7FBF9);
				// 		this.itemIcons[index].setPosition(this.itemButtons[index].x + 10, this.itemButtons[index].y + 10);
				// 	}, this)
				// 	.on('pointerup', function (hitArea, x, y, gameObject) {
				// 		this.itemButtons[index].setFrame('btn_node_selected.png');
				// 		this.itemButtons[index].setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
				// 		this.itemIcons[index].setPosition(this.itemButtons[index].x, this.itemButtons[index].y);
				// 		// this.moveToGame();
				// 	}, this)
				// 	.on('pointerout', function (hitArea, x, y, gameObject) {
				// 		this.itemButtons[index].setFrame('btn_node_selected.png');
				// 		this.itemButtons[index].setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
				// 		this.itemIcons[index].setPosition(this.itemButtons[index].x, this.itemButtons[index].y);
				// 	}, this);
				// this.itemIcons[index].setPosition(this.itemButtons[index].x, this.itemButtons[index].y);
			}
		}

		return;
		var posX = this.winSize.width * 0.5 - boardSize.width * 0.5 + this._tileWidth * 0.5;
		var posY = this.winSize.height * 0.43 - boardSize.height * 0.5 + this._tileHeight * 0.5;
		var bottomY = 0.0;

		for (var row = 0; row < this.Rows; row++) {
			this._grid[row] = new Array(this.Columns);
			for (var col = 0; col < this.Columns; col++) {
				this._grid[row][col] = this.add.sprite(posX + col * (this._tileHeight + this._tileSpaceX), posY + row * (this._tileHeight + this._tileSpaceY), 'game_images', 'default_white.png');
				this._grid[row][col].displayWidth = this._grid[row][col].width = this._tileWidth;
				this._grid[row][col].displayHeight = this._grid[row][col].height = this._tileHeight;
				bottomY = this._grid[row][col].getBottomRight().y;

				var index = 0;
				if (row < 3) {
					if (col < 3)
						index = 0;
					else if (col < 6)
						index = 1;
					else
						index = 2;
				}
				else if (row < 6) {
					if (col < 3)
						index = 3;
					else if (col < 6)
						index = 4;
					else
						index = 5;
				}
				else {
					if (col < 3)
						index = 6;
					else if (col < 6)
						index = 7;
					else
						index = 8;
				}
				this._zones[index].push(new Phaser.Math.Vector2(row, col));
			}
		}

		this._boardInfo.center = new Phaser.Math.Vector2(this._grid[4][4].x, this._grid[4][4].y);
		this._boardInfo.size = boardSize;

		for (var row = 0; row < this.Rows; row++) {
			for (var col = 0; col < this.Columns; col++) {
				if (col == 0 || col == 3 || col == 6) {
					var mainLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
					mainLine.setOrigin(0.5);
					mainLine.displayWidth = mainLine.width = this._tileSpaceX;
					mainLine.displayHeight = mainLine.height = boardSize.height + this._tileSpaceY * 2;
					mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
					mainLine.setPosition(this._grid[4][col].getLeftCenter().x - mainLine.width * 0.5, this._grid[4][col].getLeftCenter().y);
					mainLine.depth = 5;
					this._mainLines.push(mainLine);
				}
				else if (col == 8) {
					var mainLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
					mainLine.setOrigin(0.5);
					mainLine.displayWidth = mainLine.width = this._tileSpaceX;
					mainLine.displayHeight = mainLine.height = boardSize.height + this._tileSpaceY * 2;
					mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
					mainLine.setPosition(this._grid[4][col].getRightCenter().x + mainLine.width * 0.5, this._grid[4][col].getRightCenter().y);
					mainLine.depth = 5;
					this._mainLines.push(mainLine);

					var subLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
					subLine.setOrigin(0.5);
					subLine.displayWidth = subLine.width = this._tileSpaceX;
					subLine.displayHeight = subLine.height = boardSize.height + this._tileSpaceY * 2;
					subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
					subLine.setPosition(this._grid[4][col].getLeftCenter().x - subLine.width * 0.5, this._grid[4][col].getLeftCenter().y);
					subLine.depth = 1;
					this._subLines.push(subLine);
				}
				else {
					var subLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
					subLine.setOrigin(0.5);
					subLine.displayWidth = subLine.width = this._tileSpaceX;
					subLine.displayHeight = subLine.height = boardSize.height + this._tileSpaceY * 2;
					subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
					subLine.setPosition(this._grid[4][col].getLeftCenter().x - subLine.width * 0.5, this._grid[4][col].getLeftCenter().y);
					subLine.depth = 1;
					this._subLines.push(subLine);
				}
			}

			if (row == 0 || row == 3 || row == 6) {
				var mainLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
				mainLine.setOrigin(0.5);
				mainLine.displayHeight = mainLine.height = this._tileSpaceY;
				mainLine.displayWidth = mainLine.width = boardSize.height + this._tileSpaceX * 2;
				mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
				mainLine.setPosition(this._grid[row][4].getTopCenter().x, this._grid[row][4].getTopCenter().y - mainLine.height * 0.5);
				mainLine.depth = 5;
				this._mainLines.push(mainLine);
			}
			else if (row == 8) {
				var mainLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
				mainLine.setOrigin(0.5);
				mainLine.displayHeight = mainLine.height = this._tileSpaceY;
				mainLine.displayWidth = mainLine.width = boardSize.height + this._tileSpaceX * 2;
				mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
				mainLine.setPosition(this._grid[row][4].getTopCenter().x, this._grid[row][4].getBottomCenter().y + mainLine.height * 0.5);
				mainLine.depth = 5;
				this._mainLines.push(mainLine);

				var subLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
				subLine.setOrigin(0.5);
				subLine.displayHeight = subLine.height = this._tileSpaceY;
				subLine.displayWidth = subLine.width = boardSize.height + this._tileSpaceX * 2;
				subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
				subLine.setPosition(this._grid[row][4].getTopCenter().x, this._grid[row][4].getTopCenter().y - subLine.height * 0.5);
				subLine.depth = 1;
				this._subLines.push(subLine);
			}
			else {
				var subLine = this.add.sprite(0, 0, 'game_images', 'default_white.png');
				subLine.setOrigin(0.5);
				subLine.displayHeight = subLine.height = this._tileSpaceY;
				subLine.displayWidth = subLine.width = boardSize.height + this._tileSpaceX * 2;
				subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
				subLine.setPosition(this._grid[row][4].x, this._grid[row][4].getTopCenter().y - subLine.height * 0.5);
				subLine.depth = 1;
				this._subLines.push(subLine);
			}
		}

		for (var i = 0; i < 3; i++) {
			var sizeZone = 200;
			var spaceX = 24;

			this.backDrags[i] = this.add.sprite(0, 0, 'game_images', 'transperent.png');
			this.backDrags[i].depth = 2;
			this.backDrags[i].x = this.winSize.width * 0.5 + (i - 1) * (spaceX + sizeZone);
			this.backDrags[i].y = bottomY + sizeZone * 0.5 + 80;
			this.backDrags[i].z = 0;
		}
	}

	enableInput(enabled) {
		if (this._callbackTouchedDown != null)
			this.input.removeListener('pointerdown');

		if (this._callbackTouchedUp != null)
			this.input.removeListener('pointerup');

		if (this._callbackTouchedMove != null)
			this.input.removeListener('pointermove');

		if (enabled) {
			this._callbackTouchedDown = this.input.on('pointerdown', this.OnPointerDown, this);
			this._callbackTouchedUp = this.input.on('pointerup', this.OnPointerUp, this);
			this._callbackTouchedMove = this.input.on('pointermove', this.OnPointerMove, this);
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
			labBack.setDepth(2);
			labBack.updateText();

			var btnBack = this.add.nineslice(0, 0, 200, 80, { key: 'game_images', frame: 'panel_0.png' }, [29, 40, 29, 40]);
			btnBack.setDepth(1);
			btnBack.setOrigin(0.5);
			btnBack.setPosition(120, 60);
			btnBack.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);

			btnBack.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnBack.setTint(0xF7FBF9, 0xF7FBF9, 0xF7FBF9, 0xF7FBF9);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnBack.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
					// this.moveToGame();
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnBack.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
				}, this);
			labBack.setPosition(btnBack.x, btnBack.y);
		}

		return;

		this.btnTheme = this.add.sprite(0, 0, 'game_images', 'icon_theme.png');
		this.btnTheme.setOrigin(0.5);
		this.btnTheme.setScale(0.7);
		this.btnTheme.setPosition(this.btnPause.getRightCenter().x + this.btnPause.displayWidth * 0.5 + 30, this.bestScoreIcon.y);
		this.btnTheme.setTint(Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color));

		this.btnTheme.setInteractive()
			.on('pointerdown', function (pointer, localX, localY, event) {
				this.btnTheme.setTint(Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color));
			}, this)
			.on('pointerup', function (pointer, localX, localY, event) {
				this.btnTheme.setTint(Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color));
				this.showTheme();
			}, this)
			.on('pointerout', function (pointer, localX, localY, event) {
				this.btnTheme.setTint(Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color), Utils.convertHex(this.currentTheme.score_color));
			}, this);
	}

	updateBestscoreUI() {
		this.bestScoreText.updateText();

		this.bestScoreIcon.x = this.bestScoreIcon.displayWidth * 0.5;
		this.bestScoreText.x = this.bestScoreIcon.getRightCenter().x + 10 + this.bestScoreText.width * 0.5;

		var deltaX = (this.winSize.width - this.bestScoreText.getRightCenter().x) * 0.5;
		this.bestScoreIcon.x += deltaX;
		this.bestScoreText.x += deltaX;
	}

	// Input Scene
	OnPointerUp(pointer) {
		if (this._isGameOver)
			return;
		if (this._indexDraggingBlock >= 0 && this._draggingBlock != null) {
			this.onBlockDragEnd(this._draggingBlock);
		}
	}

	OnPointerDown(pointer) {
		if (this._isGameOver)
			return;

		for (var i = 0; i < 3; i++) {
			if (this.dragBlocks[i] != null) {
				var distance = Phaser.Math.Distance.Between(this.dragBlocks[i].x, this.dragBlocks[i].y, pointer.x, pointer.y);
				if (distance <= this.backDrags[i].width * 0.5) {
					this._indexDraggingBlock = i;
					this._draggingBlock = this.dragBlocks[i];
					break;
				}
			}
		}

		if (this._indexDraggingBlock >= 0 && this._draggingBlock != null) {
			this._draggingBlock.x = pointer.x;
			this._draggingBlock.y = pointer.y - this._deltaYDragging;
			this.onBlockDragBegin(this._draggingBlock);
		}
	}

	OnPointerMove(pointer) {
		if (this._isGameOver)
			return;

		if (this._indexDraggingBlock >= 0 && this._draggingBlock != null) {
			this._draggingBlock.x = pointer.x;
			this._draggingBlock.y = pointer.y - this._deltaYDragging;
			this.onBlockDragging(this._draggingBlock);
		}
	}

	showComboAnim(combo, score, x, y) {
		var comboObj = this.add.container(x, y);
		comboObj.setDepth(1000);
		comboObj.alpha = 0;

		var scoreText = this.add.text(0, 0, '+' + score, { font: "45px Oswald-Light", fill: this.currentTheme.score_color });
		scoreText.setOrigin(0.5);
		comboObj.add(scoreText);

		var timeDuration = 400;
		switch (combo) {
			case 1:
				break;
			case 2:
			case 3:
				{
					var text = ["Nice", "Yaaah", "Cool"];

					timeDuration = 500;
					scoreText.y += 25;
					var hurrayText = this.add.text(0, -35, text[Math.floor(Math.random() * text.length)], { font: "60px Oswald-Regular", fill: "#000000" });
					hurrayText.setOrigin(0.5);
					hurrayText.setColor("#f39c12");
					comboObj.add(hurrayText);
					break;
				}
			case 4:
			case 5:
				{
					var text = ["WOW", "Great", "Amazing"];

					timeDuration = 500;
					scoreText.y += 25;
					var hurrayText = this.add.text(0, -35, text[Math.floor(Math.random() * text.length)], { font: "60px Oswald-Regular", fill: "#000000" });
					hurrayText.setOrigin(0.5);
					hurrayText.setColor("#f39c12");
					comboObj.add(hurrayText);
					break;
				}
			default:
				{
					var text = ["Genius", "Unbelievable", "Amazing"];

					timeDuration = 500;
					scoreText.y += 25;
					var hurrayText = this.add.text(0, -35, text[Math.floor(Math.random() * text.length)], { font: "60px Oswald-Regular", fill: "#000000" });
					hurrayText.setOrigin(0.5);
					hurrayText.setColor("#f39c12");
					comboObj.add(hurrayText);
					break;
				}
		}

		var timeline = this.tweens.createTimeline();
		timeline.add({
			delay: 400,
			targets: comboObj,
			alpha: 1.0,
			y: comboObj.y - 40,
			duration: timeDuration,
			ease: 'Back.easeOut',
		});
		timeline.add({
			targets: comboObj,
			alpha: 0,
			y: comboObj.y - 25,
			duration: timeDuration * 0.3,
			ease: 'Linear',
			onComplete: function () {
				comboObj.destroy();
			}
		});
		timeline.play();
	}

	initAnimation() {
		// Legendary Anim
		var configShowLegendary = {
			key: 'show_legendary',
			frames: this.anims.generateFrameNames('spritesheet_legendary', {
				start: 0, end: 61, zeroPad: 5,
				prefix: 'LEGENDARY_', suffix: '.png'
			}),
			frameRate: 30,
			repeat: 0
		};
		this.anims.create(configShowLegendary);

		// Nice Anim
		var configShowNice = {
			key: 'show_nice',
			frames: this.anims.generateFrameNames('spritesheet_nice', {
				start: 0, end: 61, zeroPad: 5,
				prefix: 'NICE_', suffix: '.png'
			}),
			frameRate: 30,
			repeat: 0
		};
		this.anims.create(configShowNice);

		// Nice Wow
		var configShowWow = {
			key: 'show_wow',
			frames: this.anims.generateFrameNames('spritesheet_wow', {
				start: 0, end: 61, zeroPad: 5,
				prefix: 'WOW_', suffix: '.png'
			}),
			frameRate: 30,
			repeat: 0
		};
		this.anims.create(configShowWow);
	}

	showAnimation(type) {
		var winSize = {
			width: this.game.config.width,
			height: this.game.config.height,
		};

		if (this.anim_hurray_moment == null)
			this.anim_hurray_moment = this.add.sprite(winSize.width * 0.5, winSize.height * 0.43, 'spritesheet_legendary');

		this.anim_hurray_moment.depth = 10;

		switch (type) {
			case 1:
				//this.sound.playAudioSprite('audiosprite_voices', 'nice');
				this.anim_hurray_moment.play('show_nice');
				break;

			case 2:
				//this.sound.playAudioSprite('audiosprite_voices', 'wow');
				this.anim_hurray_moment.play('show_wow');
				break;

			case 3:
				//this.sound.playAudioSprite('audiosprite_voices', 'legendary');
				this.anim_hurray_moment.play('show_legendary');
				break;
		}
	}

	showGameover() {
		var backNoMoreMove = this.add.sprite(this._boardInfo.center.x, this._boardInfo.center.y, 'game_images', 'default_white.png');
		backNoMoreMove.displayWidth = this._boardInfo.size.width;
		backNoMoreMove.displayHeight = this._boardInfo.size.height;
		backNoMoreMove.setDepth(1000);
		backNoMoreMove.setAlpha(0);
		backNoMoreMove.setTint(0x000000, 0x000000, 0x000000, 0x000000);

		var overText = this.add.text(this._boardInfo.center.x, this._boardInfo.center.y, 'No More Move', { font: "80px Oswald-Regular", fill: "#ffffff" });
		overText.setOrigin(0.5);
		overText.setDepth(1000);
		overText.setAlpha(0);
		// hurrayText.setColor("#f39c12");

		var timeline1 = this.tweens.createTimeline();

		var _instance = this;
		timeline1.add({
			targets: backNoMoreMove,
			alpha: 0.8,
			duration: 800,
			ease: 'Linear'
		});
		timeline1.add({
			targets: overText,
			alpha: 1.0,
			duration: 300,
			ease: 'Linear',
			onComplete: function () {
				_instance.showResult();
			}
		});
		timeline1.play();
	}

	showResult() {

		if (this._score > GameData.getBestScore()) {
			var result = {
				bestscore: this._score
			};
			this.facebook.saveStats(result);
			GameData.setBestScore(this._score);
		}

		this.enableInput(false);

		var backResult = this.add.sprite(this.winSize.width * 0.5, this.winSize.height * 0.5, 'game_images', 'default_white.png');
		backResult.displayWidth = this.winSize.width;
		backResult.displayHeight = this.winSize.height;
		backResult.setDepth(1001);
		backResult.setAlpha(0.8);
		backResult.setTint(0x000000, 0x000000, 0x000000, 0x000000);
		backResult.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
		}, this);

		var popupContent = this.add.container(0, this.winSize.height);
		popupContent.setDepth(1002);
		this.tweens.add({
			targets: popupContent,
			y: 0,
			duration: 300,
			ease: 'Back',
		});

		var gameOverPopup = this.add.nineslice(this.winSize.width * 0.5, this.winSize.height * 0.5, 500, 730, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
		gameOverPopup.setOrigin(0.5);
		gameOverPopup.setTint(this.currentTheme.ui_color.common_popup_bg, this.currentTheme.ui_color.common_popup_bg, this.currentTheme.ui_color.common_popup_bg, this.currentTheme.ui_color.common_popup_bg);
		popupContent.add(gameOverPopup);

		// Button
		var topBtnReplay = 0;
		{
			var labReplay = this.add.text(0, 0, 'Replay', { font: "30px Oswald-Light", fill: "#FFFFFF" });
			labReplay.setOrigin(0.5);
			labReplay.updateText();

			var iconReplay = this.add.sprite(0, 0, 'game_images', 'icon_replay.png');
			iconReplay.setOrigin(0.5);
			iconReplay.setScale(0.3);

			var btnReplay = this.add.nineslice(0, 0, 200, 80, { key: 'game_images', frame: 'button_0.png' }, [28, 28, 38, 28]);
			btnReplay.setOrigin(0.5);
			btnReplay.setPosition(gameOverPopup.x, gameOverPopup.getBottomCenter().y - btnReplay.height * 0.5 - 20);
			btnReplay.setTint(0x99CB2C, 0x99CB2C, 0x99CB2C, 0x99CB2C);
			popupContent.add(btnReplay);
			popupContent.add(labReplay);
			popupContent.add(iconReplay);

			btnReplay.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnReplay.setTint(0x7FAB1F, 0x7FAB1F, 0x7FAB1F, 0x7FAB1F);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnReplay.setTint(0x99CB2C, 0x99CB2C, 0x99CB2C, 0x99CB2C);
					this.scene.start('MainScene');
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnReplay.setTint(0x99CB2C, 0x99CB2C, 0x99CB2C, 0x99CB2C);
				}, this);
			topBtnReplay = btnReplay.getTopCenter().y;

			labReplay.setPosition(labReplay.width * 0.5, btnReplay.y - 4);
			iconReplay.setPosition(labReplay.getRightCenter().x + 10 + iconReplay.displayWidth * 0.5, btnReplay.y - 4);

			var deltaX = (this.winSize.width - iconReplay.getRightCenter().x) * 0.5;
			labReplay.x += deltaX;
			iconReplay.x += deltaX;
		}

		var boardReviewContent = this.add.container(0, 0);
		popupContent.add(boardReviewContent);

		this._gridReview = [];
		var scaleFactor = 0.6;
		var tileWidth = this._tileWidth * scaleFactor;
		var tileHeight = this._tileWidth * scaleFactor;

		var spaceWidth = this._tileSpaceX * scaleFactor;
		var spaceHeight = this._tileSpaceY * scaleFactor;

		var boardSize = {
			width: this.Columns * tileWidth + (this.Columns - 1) * spaceWidth,
			height: this.Rows * tileHeight + (this.Rows - 1) * spaceHeight
		};

		var posX = this.winSize.width * 0.5 - boardSize.width * 0.5 + tileWidth * 0.5;
		var posY = topBtnReplay - 20 - boardSize.height + tileHeight * 0.5;

		for (var row = 0; row < this.Rows; row++) {
			this._gridReview[row] = new Array(this.Columns);
			for (var col = 0; col < this.Columns; col++) {
				this._gridReview[row][col] = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
				this._gridReview[row][col].displayWidth = tileWidth;
				this._gridReview[row][col].displayHeight = tileHeight;
				boardReviewContent.add(this._gridReview[row][col]);

				if (this.blocks[row][col] != null) {
					var cell = new Cell(this, 0);
					cell.setPosition(this._gridReview[row][col].x, this._gridReview[row][col].y);
					cell.setCellSize(tileWidth, tileHeight, spaceWidth, spaceHeight);
					cell.setCellColor(this.currentTheme.block.colors_on_grid[row]);
					boardReviewContent.add(cell);
				}

				var color = 0xffffff;
				if (row < 3) {
					if (col < 3)
						color = this.currentTheme.grid.colors[0];
					else if (col < 6)
						color = this.currentTheme.grid.colors[1];
					else
						color = this.currentTheme.grid.colors[0];
				}
				else if (row < 6) {
					if (col < 3)
						color = this.currentTheme.grid.colors[1];
					else if (col < 6)
						color = this.currentTheme.grid.colors[0];
					else
						color = this.currentTheme.grid.colors[1];
				}
				else {
					if (col < 3)
						color = this.currentTheme.grid.colors[0];
					else if (col < 6)
						color = this.currentTheme.grid.colors[1];
					else
						color = this.currentTheme.grid.colors[0];
				}
				this._gridReview[row][col].setTint(color, color, color, color);
			}
		}

		for (var row = 0; row < this.Rows; row++) {
			for (var col = 0; col < this.Columns; col++) {
				if (col == 0 || col == 3 || col == 6) {
					var mainLine = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
					mainLine.setOrigin(0.5);
					mainLine.displayWidth = mainLine.width = spaceWidth;
					mainLine.displayHeight = mainLine.height = boardSize.height + spaceHeight * 2;
					mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
					mainLine.setPosition(this._gridReview[4][col].getLeftCenter().x - mainLine.width * 0.5, this._gridReview[4][col].y);
					mainLine.setDepth(1);
					boardReviewContent.add(mainLine);
				}
				else if (col == 8) {
					var mainLine = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
					mainLine.setOrigin(0.5);
					mainLine.displayWidth = mainLine.width = spaceWidth;
					mainLine.displayHeight = mainLine.height = boardSize.height + spaceHeight * 2;
					mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
					mainLine.setPosition(this._gridReview[4][col].getRightCenter().x + mainLine.width * 0.5, this._gridReview[4][col].y);
					mainLine.setDepth(1);
					boardReviewContent.add(mainLine);

					var subLine = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
					subLine.setOrigin(0.5);
					subLine.displayWidth = subLine.width = spaceWidth;
					subLine.displayHeight = subLine.height = boardSize.height + spaceHeight * 2;
					subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
					subLine.setPosition(this._gridReview[4][col].getLeftCenter().x - subLine.width * 0.5, this._gridReview[4][col].y);
					subLine.setDepth(0);
					boardReviewContent.add(subLine);
				}
				else {
					var subLine = this.add.sprite(posX + col * (tileHeight + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
					subLine.setOrigin(0.5);
					subLine.displayWidth = subLine.width = spaceWidth;
					subLine.displayHeight = subLine.height = boardSize.height + spaceHeight * 2;
					subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
					subLine.setPosition(this._gridReview[4][col].getLeftCenter().x - subLine.width * 0.5, this._gridReview[4][col].y);
					subLine.setDepth(0);
					boardReviewContent.add(subLine);
				}
			}

			if (row == 0 || row == 3 || row == 6) {
				var mainLine = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
				mainLine.setOrigin(0.5);
				mainLine.displayHeight = mainLine.height = spaceHeight;
				mainLine.displayWidth = mainLine.width = boardSize.height + spaceWidth * 2;
				mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
				mainLine.setPosition(this._gridReview[row][4].x, this._gridReview[row][4].getTopCenter().y - mainLine.height * 0.5);
				mainLine.setDepth(1);
				boardReviewContent.add(mainLine);
			}
			else if (row == 8) {
				var mainLine = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
				mainLine.setOrigin(0.5);
				mainLine.displayHeight = mainLine.height = spaceHeight;
				mainLine.displayWidth = mainLine.width = boardSize.height + spaceWidth * 2;
				mainLine.setTint(this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline, this.currentTheme.grid.color_mainline);
				mainLine.setPosition(this._gridReview[row][4].getTopCenter().x, this._gridReview[row][4].getBottomCenter().y + mainLine.height * 0.5);
				mainLine.setDepth(1);
				boardReviewContent.add(mainLine);

				var subLine = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
				subLine.setOrigin(0.5);
				subLine.displayHeight = subLine.height = spaceHeight;
				subLine.displayWidth = subLine.width = boardSize.height + spaceWidth * 2;
				subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
				subLine.setPosition(this._gridReview[row][4].x, this._gridReview[row][4].getTopCenter().y - subLine.height * 0.5);
				subLine.setDepth(0);
				boardReviewContent.add(subLine);
			}
			else {
				var subLine = this.add.sprite(posX + col * (tileWidth + spaceWidth), posY + row * (tileHeight + spaceHeight), 'game_images', 'default_white.png');
				subLine.setOrigin(0.5);
				subLine.displayHeight = subLine.height = spaceHeight;
				subLine.displayWidth = subLine.width = boardSize.height + spaceWidth * 2;
				subLine.setTint(this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline, this.currentTheme.grid.color_subline);
				subLine.setPosition(this._gridReview[row][4].x, this._gridReview[row][4].getTopCenter().y - subLine.height * 0.5);
				subLine.setDepth(0);
				boardReviewContent.add(subLine);
			}
		}

		boardReviewContent.sort('depth');

		// Best Score
		// if(this._score > this._bestScore)
		if (true) {
			var labTitle = this.add.text(0, 0, "HIGH SCORE", { font: "50px Oswald-Regular", fill: "#ffffff" });
			labTitle.setOrigin(0.5);
			labTitle.setDepth(1005);
			labTitle.updateText();
			labTitle.setPosition(gameOverPopup.x, gameOverPopup.getTopCenter().y + labTitle.height * 0.5 + 10);
			popupContent.add(labTitle);

			var bestIcon = this.add.sprite(0, 0, 'game_images', 'icon_crown.png');
			bestIcon.setDepth(1005);
			bestIcon.setOrigin(0.5);
			bestIcon.setScale(1.3);
			bestIcon.setTint(Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color));
			bestIcon.setPosition(bestIcon.displayWidth * 0.5, (labTitle.getBottomCenter().y + this._gridReview[0][0].getTopCenter().y) * 0.5);
			popupContent.add(bestIcon);

			var labBestScore = this.add.text(0, 0, this._bestScore.toString(), { font: "65px Oswald-Light", fill: this.currentTheme.bestscore_color });
			labBestScore.setDepth(1005);
			labBestScore.setOrigin(0.5);
			labBestScore.updateText();
			labBestScore.setPosition(bestIcon.getRightCenter().x + 5 + labBestScore.width * 0.5, bestIcon.y);
			popupContent.add(labBestScore);

			var deltaX = (this.winSize.width - labBestScore.getRightCenter().x) * 0.5;
			bestIcon.x += deltaX;
			labBestScore.x += deltaX;
		}
		else {
			var bestIcon = this.add.sprite(0, 0, 'game_images', 'icon_crown.png');
			bestIcon.setDepth(1005);
			bestIcon.setOrigin(0.5);
			bestIcon.setScale(0.5);
			bestIcon.setTint(Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color), Utils.convertHex(this.currentTheme.bestscore_color));
			bestIcon.setPosition(bestIcon.width * 0.5, this._gridReview[0][0].getTopCenter().y - 10 - bestIcon.displayHeight * 0.5);
			popupContent.add(bestIcon);

			var labBestScore = this.add.text(0, 0, this._bestScore.toString(), { font: "26px Oswald-Light", fill: this.currentTheme.bestscore_color });
			labBestScore.setDepth(1005);
			labBestScore.setOrigin(0.5);
			labBestScore.updateText();
			labBestScore.setPosition(bestIcon.getRightCenter().x + 5 + labBestScore.width * 0.5, bestIcon.y);
			popupContent.add(labBestScore);

			var deltaX = (this.winSize.width - labBestScore.getRightCenter().x) * 0.5;
			bestIcon.x += deltaX;
			labBestScore.x += deltaX;

			var labTitle = this.add.text(0, 0, "GAME OVER", { font: "50px Oswald-Regular", fill: "#ffffff" });
			labTitle.setOrigin(0.5);
			labTitle.setDepth(1005);
			labTitle.updateText();
			labTitle.setPosition(gameOverPopup.x, gameOverPopup.getTopCenter().y + labTitle.height * 0.5 + 10);
			popupContent.add(labTitle);

			var labScore = this.add.text(0, 0, this._score.toString(), { font: "65px Oswald-Regular", fill: this.currentTheme.score_color });
			labScore.setOrigin(0.5);
			labScore.setDepth(1005);
			labScore.updateText();
			labScore.setPosition(gameOverPopup.x, (labTitle.getBottomCenter().y + labBestScore.getTopCenter().y) * 0.5);
			popupContent.add(labScore);
		}

	}

	showConfirmRestartPopup() {
		var popupContent = this.add.container(0, this.winSize.height);
		popupContent.setDepth(1002);
		this.tweens.add({
			targets: popupContent,
			y: 0,
			duration: 400,
			ease: 'Back.easeOut',
		});

		var backPopup = this.add.nineslice(this.winSize.width * 0.5, this.winSize.height * 0.5, 550, 350, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
		backPopup.setOrigin(0.5);
		backPopup.setTint(0x63D6B4, 0x63D6B4, 0x63D6B4, 0x63D6B4);
		popupContent.add(backPopup);

		// Button Yes
		{
			var labYes = this.add.text(0, 0, "Yes", { font: "35px Oswald-Light", fill: "#ffffff" });
			labYes.setOrigin(0.5);

			var btnYes = this.add.nineslice(0, 0, 200, 80, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
			btnYes.setOrigin(0.5);
			btnYes.setPosition(this.winSize.width * 0.5 - btnYes.displayWidth * 0.5 - 30, backPopup.getBottomCenter().y - btnYes.displayHeight * 0.5 - 30);
			btnYes.setTint(0x9ACA3B, 0x9ACA3B, 0x9ACA3B, 0x9ACA3B);
			popupContent.add(btnYes);
			popupContent.add(labYes);

			btnYes.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnYes.setTint(0x85AE34, 0x85AE34, 0x85AE34, 0x85AE34);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnYes.setTint(0x9ACA3B, 0x9ACA3B, 0x9ACA3B, 0x9ACA3B);
					this.tweens.add({
						targets: popupContent,
						y: this.winSize.height,
						duration: 400,
						ease: 'Back.easeIn',
						onComplete: function () {
							popupContent.destroy();
							this.scene.start('MainScene');
						},
						onCompleteScope: this
					});
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnYes.setTint(0x9ACA3B, 0x9ACA3B, 0x9ACA3B, 0x9ACA3B);
				}, this);
			labYes.setPosition(btnYes.x, btnYes.y);
		}

		// Button No
		{
			var labNo = this.add.text(0, 0, "No", { font: "35px Oswald-Light", fill: "#ffffff" });
			labNo.setOrigin(0.5);

			var btnNo = this.add.nineslice(0, 0, 200, 80, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
			btnNo.setOrigin(0.5);
			btnNo.setPosition(this.winSize.width * 0.5 + btnNo.displayWidth * 0.5 + 30, backPopup.getBottomCenter().y - btnNo.displayHeight * 0.5 - 30);
			btnNo.setTint(0xAA61A1, 0xAA61A1, 0xAA61A1, 0xAA61A1);
			popupContent.add(btnNo);
			popupContent.add(labNo);

			btnNo.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnNo.setTint(0x8E5487, 0x8E5487, 0x8E5487, 0x8E5487);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnNo.setTint(0xAA61A1, 0xAA61A1, 0xAA61A1, 0xAA61A1);
					this.enableInput(true);
					this.tweens.add({
						targets: popupContent,
						y: this.winSize.height,
						duration: 400,
						ease: 'Back.easeIn',
						onComplete: function () {
							popupContent.destroy();
							this.backPopup.destroy();
						},
						onCompleteScope: this
					});
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnNo.setTint(0xAA61A1, 0xAA61A1, 0xAA61A1, 0xAA61A1);
				}, this);
			labNo.setPosition(btnNo.x, btnNo.y);
		}

		var labTitle = this.add.text(0, 0, "Restart Game", { font: "50px Oswald-Regular", fill: "#ffffff" });
		labTitle.setOrigin(0.5);
		labTitle.setDepth(1005);
		labTitle.updateText();
		labTitle.setPosition(backPopup.x, backPopup.getTopCenter().y + labTitle.height * 0.5 + 10);
		popupContent.add(labTitle);

		var labScore = this.add.text(0, 0, "Are you sure want\nto restart?", { font: "40px Oswald-Light", fill: this.currentTheme.score_color });
		labScore.setAlign('center');
		labScore.setOrigin(0.5);
		labScore.setDepth(1005);
		labScore.updateText();
		labScore.setPosition(backPopup.x, (labTitle.getBottomCenter().y + labYes.getTopCenter().y) * 0.5);
		popupContent.add(labScore);
	}

	showPause() {
		this.enableInput(false);

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

		// Button Home
		{
			var iconHome = this.add.sprite(0, 0, 'game_images', 'icon_home.png');
			iconHome.setOrigin(0.5);

			var btnHome = this.add.nineslice(0, 0, 120, 120, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
			btnHome.setOrigin(0.5);
			btnHome.setPosition(this.winSize.width * 0.5 - btnHome.displayWidth * 0.5 - 10, this.winSize.height * 0.4 - btnHome.displayHeight * 0.5 - 10);
			btnHome.setTint(0x495A90, 0x495A90, 0x495A90, 0x495A90);
			popupContent.add(btnHome);
			popupContent.add(iconHome);

			btnHome.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnHome.setTint(0x35467B, 0x35467B, 0x35467B, 0x35467B);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnHome.setTint(0x495A90, 0x495A90, 0x495A90, 0x495A90);
					this.scene.start('HomeScene');
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnHome.setTint(0x495A90, 0x495A90, 0x495A90, 0x495A90);
				}, this);
			iconHome.setPosition(btnHome.x, btnHome.y);
		}

		// Button Restart
		{
			var iconRestart = this.add.sprite(0, 0, 'game_images', 'icon_replay.png');
			iconRestart.setOrigin(0.5);
			iconRestart.setScale(0.62);

			var btnRestart = this.add.nineslice(0, 0, 120, 120, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
			btnRestart.setOrigin(0.5);
			btnRestart.setPosition(this.winSize.width * 0.5 + btnRestart.displayWidth * 0.5 + 10, this.winSize.height * 0.4 - btnRestart.displayHeight * 0.5 - 10);
			btnRestart.setTint(0xCB87C3, 0xCB87C3, 0xCB87C3, 0xCB87C3);
			popupContent.add(btnRestart);
			popupContent.add(iconRestart);

			btnRestart.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnRestart.setTint(0xA2709C, 0xA2709C, 0xA2709C, 0xA2709C);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnRestart.setTint(0xCB87C3, 0xCB87C3, 0xCB87C3, 0xCB87C3);
					this.tweens.add({
						targets: popupContent,
						y: this.winSize.height,
						duration: 400,
						ease: 'Back.easeIn',
						onComplete: function () {
							popupContent.destroy();
							this.showConfirmRestartPopup();
						},
						onCompleteScope: this
					});
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnRestart.setTint(0xCB87C3, 0xCB87C3, 0xCB87C3, 0xCB87C3);
				}, this);
			iconRestart.setPosition(btnRestart.x, btnRestart.y);
		}

		// Button Resume
		{
			var iconResume = this.add.sprite(0, 0, 'game_images', 'icon_resume.png');
			iconResume.setOrigin(0.5);
			iconResume.setScale(0.6);

			var btnResume = this.add.nineslice(0, 0, 120, 120, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
			btnResume.setOrigin(0.5);
			btnResume.setPosition(this.winSize.width * 0.5 - btnResume.displayWidth * 0.5 - 10, this.winSize.height * 0.4 + btnResume.displayHeight * 0.5 + 10);
			btnResume.setTint(0xE6624D, 0xE6624D, 0xE6624D, 0xE6624D);
			popupContent.add(btnResume);
			popupContent.add(iconResume);

			btnResume.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnResume.setTint(0xC1513F, 0xC1513F, 0xC1513F, 0xC1513F);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					btnResume.setTint(0xE6624D, 0xE6624D, 0xE6624D, 0xE6624D);
					this.enableInput(true);
					this.tweens.add({
						targets: popupContent,
						y: this.winSize.height,
						duration: 400,
						ease: 'Back.easeIn',
						onComplete: function () {
							popupContent.destroy();
							this.backPopup.destroy();
						},
						onCompleteScope: this
					});
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnResume.setTint(0xE6624D, 0xE6624D, 0xE6624D, 0xE6624D);
				}, this);
			iconResume.setPosition(btnResume.x, btnResume.y);
		}

		// Button Sound
		{
			var isEnableSound = true;

			var iconSound = this.add.sprite(0, 0, 'game_images', isEnableSound ? 'icon_sound_on.png' : 'icon_sound_off.png');
			iconSound.setOrigin(0.5);

			var btnSound = this.add.nineslice(0, 0, 120, 120, { key: 'game_images', frame: 'panel_0.png' }, [12, 12, 18, 12]);
			btnSound.setOrigin(0.5);
			btnSound.setPosition(this.winSize.width * 0.5 + btnSound.displayWidth * 0.5 + 10, this.winSize.height * 0.4 + btnSound.displayHeight * 0.5 + 10);
			btnSound.setTint(0xC79C62, 0xC79C62, 0xC79C62, 0xC79C62);
			popupContent.add(btnSound);
			popupContent.add(iconSound);

			btnSound.setInteractive()
				.on('pointerdown', function (pointer, localX, localY, event) {
					btnSound.setTint(0x9D7B4C, 0x9D7B4C, 0x9D7B4C, 0x9D7B4C);
				}, this)
				.on('pointerup', function (pointer, localX, localY, event) {
					isEnableSound = !isEnableSound;
					btnSound.setTint(0xC79C62, 0xC79C62, 0xC79C62, 0xC79C62);
					iconSound.setTexture('game_images', isEnableSound ? 'icon_sound_on.png' : 'icon_sound_off.png');
				}, this)
				.on('pointerout', function (pointer, localX, localY, event) {
					btnSound.setTint(0xC79C62, 0xC79C62, 0xC79C62, 0xC79C62);
				}, this);
			iconSound.setPosition(btnSound.x, btnSound.y);
		}
	}

	showTheme() {
		this.enableInput(false);

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
					this.enableInput(true);
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
					this.enableInput(true);
					this.tweens.add({
						targets: popupContent,
						y: this.winSize.height,
						duration: 400,
						ease: 'Back.easeIn',
						onComplete: function () {
							this.backPopup.destroy();
							popupContent.destroy();
							GameData.setThemeID(ThemeHelper.getThemeDay().id);
							var stats = {
								themeID: GameData.getThemeID()
							};
							this.facebook.saveStats(stats);
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
					this.enableInput(true);
					this.tweens.add({
						targets: popupContent,
						y: this.winSize.height,
						duration: 400,
						ease: 'Back.easeIn',
						onComplete: function () {
							this.backPopup.destroy();
							popupContent.destroy();
							GameData.setThemeID(ThemeHelper.getThemeWood().id);
							var stats = {
								themeID: GameData.getThemeID()
							};
							this.facebook.saveStats(stats);
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

	addScore(bonusScore) {
		this._countScore = this._score;
		this._score += bonusScore;
		this.animationScore();
	}

	animationScore() {
		if (this._timerUpdateScore != null) {
			this._timerUpdateScore.remove();
		}

		this._timerUpdateScore = this.time.addEvent({
			delay: 30,
			callback: this.updateScoreText,
			callbackScope: this,
			loop: true
		});

		this._deltaScore = Math.round((this._score - this._countScore) / 10);
		if (this._deltaScore <= 0)
			this._deltaScore = 1;
		this.tweens.add({
			targets: this.scoreText,
			scale: 1.2,
			duration: 300,
			ease: 'Linear',
			yoyo: true,
		});
	}

	updateScoreText() {
		if (this._countScore < this._score) {
			this._countScore += this._deltaScore;
			this.scoreText.setText(String(this._countScore));
			if (this._bestScore < this._countScore) {
				this._bestScore = this._countScore;
				this.bestScoreText.setText(this._bestScore.toString());
				this.updateBestscoreUI();
			}
		} else {
			this._countScore = this._score;
			this.scoreText.setText(String(this._score));
			if (this._bestScore < this._score) {
				this._bestScore = this._score;
				this.bestScoreText.setText(this._bestScore.toString());
				this.updateBestscoreUI();
			}

			this._timerUpdateScore.remove();
			this._timerUpdateScore = null;
		}
	}

	checkAvailable() {
		var canPutBlockAt = false;
		for (var i = 0; i < 3; i++) {
			if (this.dragBlocks[i] != null) {
				var availableIndexes = this.getAvailableIndexes(this.dragBlocks[i]);
				if (availableIndexes != null && availableIndexes.length > 0) {
					canPutBlockAt = true;
				}
			}
		}

		if (!canPutBlockAt) {
			this.showGameover();
		}
	}

	getAvailableIndexes(block) {
		var indexes = [];
		for (var row = 0; row < this.Rows; row++) {
			for (var col = 0; col < this.Columns; col++) {
				if (this.canPutBlockAt(block, row, col)) {
					indexes.push({
						x: row,
						y: col,
					})
				}
			}
		}
		return indexes;
	}

	indexAtPoint(x, y) {
		var spaceX = this._tileSpaceX;
		var spaceY = this._tileSpaceY;

		var blockSize = GameConfig.getBlockSize();

		var posX = this._grid[0][0].x;// - blockSize.width * 0.5;
		var posY = this._grid[0][0].y;//- blockSize.height * 0.5;

		var index = new Phaser.Math.Vector2(0, 0);
		index.y = (x - posX) / (blockSize.width + spaceX);
		index.x = (y - posY) / (blockSize.height + spaceY);
		return index;
	}

	pointAtIndex(row, col) {
		if (row < 0 || row >= this.Rows || col < 0 || col >= this.Columns) {
			return {
				x: -1,
				y: -1
			};
		}
		var pos = this._grid[row][col];

		return {
			x: pos.x,
			y: pos.y,
		};
	}

	createHighlightTile(block) {
		var needCreater = block.countCell() - this._highlightCells.length;
		if (needCreater > 0) {
			for (var i = 0; i < needCreater; i++) {
				var cellHighlight = new Cell(this, 0);
				cellHighlight.enabledHighlight(true);
				cellHighlight.updateView();
				cellHighlight.setPosition(this.winSize.width * 0.5, this.winSize.height * 0.5);
				this.add.existing(cellHighlight);
				this._highlightCells.push(cellHighlight);
			}
		}

		this._highlightCells.forEach(element => {
			element.updateView();
			element.setVisible(false);
		});
	}

	updateHighlightTiles(block) {
		if (this._highlightCellDragging.length > 0) {
			this._highlightCellDragging.forEach(element => {
				element.enabledDragHighlight(false);
				element.updateView();
			});
			this._highlightCellDragging = [];
		}

		this.createHighlightTile(block);

		var index = this.indexAtPoint(block.x, block.y);

		if (block._width % 2 == 0)
			index.y -= 0.5;
		if (block._height % 2 == 0)
			index.x -= 0.5;

		var row = Math.round(index.x);
		var col = Math.round(index.y);

		var blockColumnCount = block._width;
		var blockRowCount = block._height;

		var halfColumnCount = Math.floor(blockColumnCount / 2);
		var halfRowCount = Math.floor(blockRowCount / 2);

		if (blockColumnCount % 2 == 0)
			halfColumnCount--;
		if (blockRowCount % 2 == 0)
			halfRowCount--;


		var indexObj = 0;
		var listHighlight = [];
		for (var tmpRow = 0; tmpRow < blockRowCount; tmpRow++) {
			for (var tmpCol = 0; tmpCol < blockColumnCount; tmpCol++) {
				var cell = block._cells[tmpRow][tmpCol];
				if (cell != null) {
					var cellRow = Math.round(row + (tmpRow - halfRowCount));
					var cellCol = Math.round(col + (tmpCol - halfColumnCount));

					var position = this.pointAtIndex(cellRow, cellCol);
					var objHighlight = this._highlightCells[indexObj];
					objHighlight.setVisible(true);
					objHighlight.setPosition(position.x, position.y);
					listHighlight.push({ row: cellRow, column: cellCol });
					indexObj++;
				}
			}
		}

		this.highlightClearLine(listHighlight);
	}

	getZoneByRowColumn(row, col) {
		var outPut = null;
		this._zones.forEach(element => {
			if (element.findIndex(val => row == val.x && col == val.y) > 0) {
				outPut = element;
			}
		});
		return outPut;
	}

	highlightClearLine(listHighlight) {
		var rows = [];
		var cols = [];
		var zones = [];

		listHighlight.forEach(element => {
			var rowHL = element.row;
			var colHL = element.column;

			var isAdd = true;
			for (var row = 0; row < this.Rows; row++) {
				var isHighlight = listHighlight.findIndex(val => (row == val.row && colHL == val.column)) >= 0;
				if (this.blocks[row][colHL] == null && !isHighlight) {
					isAdd = false;
					break;
				}
			}

			if (isAdd) {
				for (var row = 0; row < this.Rows; row++)
					if (this.blocks[row][colHL] != null)
						this._highlightCellDragging.push(this.blocks[row][colHL]);
				cols.push(colHL);
			}

			isAdd = true;
			for (var col = 0; col < this.Columns; col++) {
				var isHighlight = listHighlight.findIndex(val => (rowHL == val.row && col == val.column)) >= 0;
				if (this.blocks[rowHL][col] == null && !isHighlight) {
					isAdd = false;
					break;
				}
			}
			if (isAdd) {
				for (var col = 0; col < this.Columns; col++)
					if (this.blocks[rowHL][col] != null)
						this._highlightCellDragging.push(this.blocks[rowHL][col]);
				rows.push(rowHL);
			}

			var zone = this.getZoneByRowColumn(rowHL, colHL);
			if (zone != null) {
				isAdd = true;
				for (var i = 0; i < zone.length; i++) {
					var row = zone[i].x;
					var col = zone[i].y;
					var isHighlight = listHighlight.findIndex(val => (row == val.row && col == val.column)) >= 0;
					if (this.blocks[row][col] == null && !isHighlight) {
						isAdd = false;
						break;
					}
				}
				if (isAdd) {
					for (var i = 0; i < zone.length; i++) {
						var row = zone[i].x;
						var col = zone[i].y;
						if (this.blocks[row][col] != null)
							this._highlightCellDragging.push(this.blocks[row][col]);
					}
				}
			}
		});

		this._highlightCellDragging.forEach(element => {
			element.enabledDragHighlight(true);
			element.updateView();
		});
	}

	setHideHighlightTiles() {
		this._highlightCells.forEach(element => {
			element.setVisible(false);
		});

		if (this._highlightCellDragging.length > 0) {
			this._highlightCellDragging.forEach(element => {
				element.enabledDragHighlight(false);
				element.updateView();
			});
			this._highlightCellDragging = [];
		}
	}

	putDraggingBlockBack() {
		this._draggingBlock.setDepth(5);
		this._draggingBlock.setPosition(this.backDrags[this._draggingBlock.getIndex()].x, this.backDrags[this._draggingBlock.getIndex()].y);
		this._draggingBlock.enableDragging(false);
		this._draggingBlock.updateView();
	}


	onBlockDragBegin(block) {
		if (block != null) {
			console.log('Theme ID = ', this.currentTheme.id);
			block.setBlockColor(this.currentTheme.block.color_dragging);
			block.enableDragging(true);
			block.setDepth(100);
		}
	}

	onBlockDragging(block) {
		var index = this.indexAtPoint(block.x, block.y);

		if (block._width % 2 == 0)
			index.y -= 0.5;
		if (block._height % 2 == 0)
			index.x -= 0.5;

		var row = Math.round(index.x);
		var col = Math.round(index.y);

		if (this.canPutBlockAt(block, row, col)) {
			this.updateHighlightTiles(block);
		} else {
			this.setHideHighlightTiles();
		}
	}

	onBlockDragEnd(block) {
		this.setHideHighlightTiles();

		var index = this.indexAtPoint(block.x, block.y);

		if (block._width % 2 == 0)
			index.y -= 0.5;
		if (block._height % 2 == 0)
			index.x -= 0.5;

		var row = Math.round(index.x);
		var col = Math.round(index.y);

		if (this.canPutBlockAt(block, row, col)) {
			// this.sound.playAudioSprite('audiosprite_blocks', 'put_block');
			this.putBlockAt(block, row, col);
			block.deactiveBlock();
			this.dragBlocks[block.getIndex()] = null;

			if (this.needUpdateDragBlocks()) {
				this.spawnNewBlocks();
			}

			this.addScore(block.countCell());
			var clearData = this.checkGrid();

			var clearScore = 0;
			clearScore += this.removeRows(clearData.rows);
			clearScore += this.removeColumns(clearData.columns);
			clearScore += this.removeZones(clearData.zones);

			var pos = { x: this._boardInfo.center.x, y: this._boardInfo.center.y };
			var comboLine = clearData.rows.length + clearData.columns.length + clearData.zones.length;

			if (comboLine == 1) {
				if (clearData.rows.length > 0) {
					pos = this.pointAtIndex(clearData.rows[0], 4);
				}
				else if (clearData.columns.length > 0) {
					pos = this.pointAtIndex(4, clearData.columns[0]);
				}
				else {
					var rowZone = this._zones[clearData.zones[0]][4].x;
					var colZone = this._zones[clearData.zones[0]][4].y;
					pos = this.pointAtIndex(rowZone, colZone);
				}
			}
			switch (comboLine) {
				case 1:
				case 2:
					// this.sound.playAudioSprite('audiosprite_blocks', 'combo_12');
					break;
				case 3:
				case 4:
					// this.sound.playAudioSprite('audiosprite_blocks', 'combo_34');
					break;
				case 5:
					// this.sound.playAudioSprite('audiosprite_blocks', 'combo_5');
					break;
				case 6:
					// this.sound.playAudioSprite('audiosprite_blocks', 'combo_6');
					break;
			}

			if (comboLine > 0) {
				this.showComboAnim(comboLine, clearScore, pos.x, pos.y);
			}

			this.checkAvailable();

		} else {
			//this.sound.playAudioSprite('audiosprite_blocks', 'drop_block');
			this.putDraggingBlockBack();
		}

		this._indexDraggingBlock = -1;
		this._draggingBlock = null;
	}

	removeCell(cell, moveBottom, delay) {
		cell.exploding(moveBottom, delay);
	}

	removeRows(rowList) {
		var totalScore = 0;
		if (rowList == null || rowList.length <= 0)
			return 0;
		for (var i = 0; i < rowList.length; i++) {
			var row = rowList[i];
			if (row < 0 || row >= this.Rows)
				continue;
			totalScore += 10;
			this.addScore(10);
			var delayAnim = 50;
			for (var col = 0; col < this.Columns; col++) {
				if (this.blocks[row][col] != null) {
					this.removeCell(this.blocks[row][col], true, col * delayAnim);
					this.blocks[row][col] = null;
				}
			}
		}
		return totalScore;
	}

	removeColumns(colList) {
		var totalScore = 0;
		if (colList == null || colList.length <= 0)
			return 0;
		for (var i = 0; i < colList.length; i++) {
			var col = colList[i];
			if (col < 0 || col >= this.Rows)
				continue;
			totalScore += 10;
			this.addScore(10);
			var delayAnim = 50;
			for (var row = 0; row < this.Rows; row++) {
				if (this.blocks[row][col] != null) {
					this.removeCell(this.blocks[row][col], false, row * delayAnim);
					this.blocks[row][col] = null;
				}
			}
		}
		return totalScore;
	}

	removeZones(zoneList) {
		var totalScore = 0;
		if (zoneList == null || zoneList.length <= 0)
			return 0;
		for (var i = 0; i < zoneList.length; i++) {
			var zone = zoneList[i];
			if (zone < 0 || zone >= 9)
				continue;
			totalScore += 10;
			this.addScore(10);
			var delayAnim = 30;
			for (var i = 0; i < 9; i++) {
				var row = this._zones[zone][i].x;
				var col = this._zones[zone][i].y;
				if (this.blocks[row][col] != null) {
					this.removeCell(this.blocks[row][col], false, row * delayAnim);
					this.blocks[row][col] = null;
				}
			}
		}
		return totalScore;
	}

	isFullfilledColumn(col) {
		if (this.Rows <= 1) return false;
		for (var row = 0; row < this.Rows; row++) {
			if (this.blocks[row][col] == null) {
				return false;
			}
		}
		return true;
	}

	isFullfilledRow(row) {
		if (this.Columns <= 1) return false;
		for (var col = 0; col < this.Columns; col++) {
			if (this.blocks[row][col] == null) {
				return false;
			}
		}
		return true;
	}

	isFullfillZone(index) {
		if (index < 0 || index > 9)
			return false;
		for (var i = 0; i < 9; i++) {
			var row = this._zones[index][i].x;
			var col = this._zones[index][i].y;
			if (this.blocks[row][col] == null)
				return false;
		}
		return true;
	}

	checkGrid() {
		var rowClear = [];
		var colClear = [];
		var zoneClear = [];

		for (var row = 0; row < this.Rows; row++) {
			if (this.isFullfilledRow(row))
				rowClear.push(row);
		}

		for (var col = 0; col < this.Columns; col++) {
			if (this.isFullfilledColumn(col))
				colClear.push(col);
		}

		for (var i = 0; i < this._zones.length; i++) {
			if (this.isFullfillZone(i))
				zoneClear.push(i);
		}

		return {
			rows: rowClear,
			columns: colClear,
			zones: zoneClear
		};
	}

	spawnNewBlocks() {
		for (var i = 0; i < 3; i++) {
			var block = new Block(this, Phaser.Math.Between(0, BlockHelper.getTotal() - 1));
			this.add.existing(block);
			block.setDelegate(this);
			block.setIndex(i);
			block.x = this.backDrags[i].x;
			block.y = this.backDrags[i].y;
			block.depth = 5;
			block.show();
			block.enableDragging(false);
			block.setBlockColor(this.currentTheme.block.color_default);
			this.dragBlocks[i] = block;
		}
	}

	loadDragBlock() {
		for (var i = 0; i < 3; i++) {
			var block = new Block(this, Phaser.Math.Between(0, BlockHelper.getTotal() - 1));
			this.add.existing(block);
			block.setDelegate(this);
			block.setIndex(i);
			block.x = this.backDrags[i].x;
			block.y = this.backDrags[i].y;
			block.depth = 5;
			block.show();
			block.enableDragging(false);
			block.setBlockColor(this.currentTheme.block.color_default);
			this.dragBlocks[i] = block;
		}
	}

	needUpdateDragBlocks() {
		for (var i = 0; i < 3; i++) {
			if (this.dragBlocks[i] != null)
				return false;
		}
		return true;
	}

	setCellAtIndex(row, col, cell) {
		if (row < 0 || col < 0 || row >= this.Rows || col >= this.Columns)
			return;

		var pos = this.pointAtIndex(row, col);
		cell.x = pos.x;
		cell.y = pos.y;
		this.blocks[row][col] = cell;
		this.blocks[row][col].depth = 3;
		this.blocks[row][col]._row = row;
		this.blocks[row][col].updateView();
		this.add.existing(cell);
	}

	putBlockAt(block, row, col) {
		var blockColumnCount = block._width;
		var blockRowCount = block._height;

		var halfColumnCount = Math.floor(blockColumnCount / 2);
		var halfRowCount = Math.floor(blockRowCount / 2);

		if (blockColumnCount % 2 == 0)
			halfColumnCount--;
		if (blockRowCount % 2 == 0)
			halfRowCount--;

		for (var tmpRow = 0; tmpRow < blockRowCount; tmpRow++) {
			for (var tmpCol = 0; tmpCol < blockColumnCount; tmpCol++) {
				var cell = block._cells[tmpRow][tmpCol];
				if (cell != null) {
					var cellRow = Math.round(row + (tmpRow - halfRowCount));
					var cellCol = Math.round(col + (tmpCol - halfColumnCount));
					this.setCellAtIndex(cellRow, cellCol, cell);
				}
			}
		}

		block.OnPutIntoGrid();
	}

	canPutBlockAt(block, row, col) {
		if (row < 0 || row >= this.Rows || col < 0 || col >= this.Columns)
			return false;

		var blockColumnCount = block._width;
		var blockRowCount = block._height;

		var halfColumnCount = Math.floor(blockColumnCount / 2);
		var halfRowCount = Math.floor(blockRowCount / 2);

		if (blockColumnCount % 2 == 0)
			halfColumnCount--;
		if (blockRowCount % 2 == 0)
			halfRowCount--;

		var datas = [];
		for (var tmpRow = 0; tmpRow < blockRowCount; tmpRow++) {
			for (var tmpCol = 0; tmpCol < blockColumnCount; tmpCol++) {
				if (block._cells[tmpRow][tmpCol] != null) {
					var cellRow = row + (tmpRow - halfRowCount);
					var cellCol = col + (tmpCol - halfColumnCount);
					datas.push({
						x: cellRow,
						y: cellCol,
					});

					if (cellRow < 0 || cellRow >= this.Rows || cellCol < 0 || cellCol >= this.Columns)
						return false;

					if (this.blocks[cellRow][cellCol] != null) {
						return false;
					}
				}
			}
		}

		return true;
	}

	checkPassCondition(conditions, data) {
		for (var i = 0; i < data.length; i++) {
			var point = data[i];

			var pass = false;
			for (var j = 0; j < conditions.length; j++) {
				var data = conditions[i];

				if (data.x == point.x && data.y == point.y) {
					pass = true;
					break;
				}
			}
			if (!pass)
				return false;
		}
		return true;
	}
}