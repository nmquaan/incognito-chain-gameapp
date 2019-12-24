import Cell from '../component/Cell'
import Block from '../component/Block'
import TutorialData from '../data/TutorialData'
import GameConfig from '../GameConfig'
import BlockHelper from '../data/BlockHelper'

export default class Tutorial extends Phaser.Scene {
    constructor() {
        super('Tutorial');
	}
	
	static getInstance() {
		return this;
	}

    create() {
        this.winSize = {
            width : this.game.config.width,
            height : this.game.config.height,
        };

		// // Board Game
		// this.board = this.add.sprite(winSize.width * 0.5, winSize.height * 0.5, 'images_atlat', 'main_board.png');
		// this.board.y = this.board.height * 0.5 + winSize.height * 0.05;
		
		this._score = 0;
		this.zone = [];
		this.Rows = 10;
		this.Columns = 10;
		this.blocks = [];
		this.dragBlocks = [];
		this._step = 0;
		
		var posX = this.board.x;
		var posY = this.board.y + this.board.height * 0.5 + 20;
		for(var i=0; i<3; i++) {
            this.zone[i] = this.add.sprite(0, 0, 'images_atlat', 'drag_zone.png');
            this.zone[i].depth = 2;
			this.zone[i].x = posX + (i - 1) * (24  + this.zone[i].width);
			this.zone[i].y = posY + this.zone[i].height * 0.5;
			this.zone[i].z = 0;
		}

		var spaceX = 2.3;
		var spaceY = 3.4;

		var posX = -this.board.width * 0.5 + 51 + this.board.x;
		var posY = -this.board.height * 0.5 + 51.3 + this.board.y;

		this.blocks = [];

		for(var row = 0; row < this.Rows; row++) {
			this.blocks[row] = new Array(this.Columns);
			for(var col = 0; col < this.Columns; col++) {
				this.blocks[row][col] = null;
			}
		}

		this.loadDragBlock();
		this.loadBoard();
		this.initAnimation();
		this.initForTutorial();
		this.startTutorial();
	}

	endTutorial() {
		this.scene.start('MainScene');
	}
	
	initAnimation()
	{
		// Legendary Anim
		var configShowLegendary = {
			key: 'show_legendary',
			frames: this.anims.generateFrameNames('spritesheet_legendary', {
				start: 0, end: 25, zeroPad: 5,
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
				start: 0, end: 23, zeroPad: 5,
				prefix: 'NICE_', suffix: '.png'
			}),
			frameRate: 30,
			repeat: 0
		};
		this.anims.create(configShowNice);

		// Wow Anim
		var configShowWow = {
			key: 'show_wow',
			frames: this.anims.generateFrameNames('spritesheet_wow', {
				start: 0, end: 23, zeroPad: 5,
				prefix: 'WOW_', suffix: '.png'
			}),
			frameRate: 30,
			repeat: 0
		};
		this.anims.create(configShowWow);
	}

	showAnimation(type)
	{
		var winSize = {
            width : this.game.config.width,
            height : this.game.config.height,
        };
		
		if(this.anim_hurray_moment == null)
			this.anim_hurray_moment = this.add.sprite(winSize.width * 0.5, winSize.height * 0.3, 'spritesheet_legendary');

		this.anim_hurray_moment.depth = 10;

		switch(type)
		{
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

	startTutorial() {
		var _this = this;

		
		this._handSprite.x = this.dragBlocks[0].x;
		this._handSprite.y = this.dragBlocks[0].y;

		// Drag block 0
		var timeline = this.tweens.createTimeline();
		timeline.add({
			targets: this._handSprite,
			scaleX: 0.5,
			scaleY: 0.5,
			duration: 500,
			ease: 'Back.easeIn',
			repeat: 0,
			onComplete: function() {
				_this.onBlockDragBegin(_this.dragBlocks[0]);
			}
		});

		// Move block to board
		var point = this.pointAtIndex(6, 2);
		timeline.add({
			targets: [this._handSprite, this.dragBlocks[0]],
			x: point.x,
			y: point.y,
			duration: 800,
			ease: 'Linear',
			repeat: 0,
			onComplete: function() {
				_this.onBlockDragEnd(_this.dragBlocks[0]);
			}
		});

		// Put block on Board
		timeline.add({
			targets: this._handSprite,
			scaleX: 0.7,
			scaleY: 0.7,
			duration: 500,
			ease: 'Back.easeOut',
			repeat: 0,
		});
		
		// Move hand to block 1
		timeline.add({
			targets: this._handSprite,
			x: _this.dragBlocks[1].x,
			y: _this.dragBlocks[1].y,
			duration: 800,
			ease: 'Linear',
			repeat: 0
		});

		// Drag block 1
		timeline.add({
			targets: this._handSprite,
			scaleX: 0.5,
			scaleY: 0.5,
			duration: 500,
			ease: 'Back.easeIn',
			repeat: 0,
			onComplete: function() {
				_this.onBlockDragBegin(_this.dragBlocks[1]);
			}
		});

		// Move block to board
		point = this.pointAtIndex(2, 5);
		timeline.add({
			targets: [this._handSprite, this.dragBlocks[1]],
			x: point.x,
			y: point.y,
			duration: 800,
			ease: 'Linear',
			repeat: 0,
			onComplete: function() {
				_this.onBlockDragEnd(_this.dragBlocks[1]);
			}
		});

		// Put block on Board
		timeline.add({
			targets: this._handSprite,
			scaleX: 0.7,
			scaleY: 0.7,
			duration: 500,
			ease: 'Back.easeOut',
			repeat: 0,
		});

		// Move hand to block 2
		timeline.add({
			targets: this._handSprite,
			x: _this.dragBlocks[2].x,
			y: _this.dragBlocks[2].y,
			duration: 800,
			ease: 'Linear',
			repeat: 0
		});

		// Drag block 2
		timeline.add({
			targets: this._handSprite,
			scaleX: 0.5,
			scaleY: 0.5,
			duration: 500,
			ease: 'Back.easeIn',
			repeat: 0,
			onComplete: function() {
				_this.onBlockDragBegin(_this.dragBlocks[2]);
			}
		});

		// Move block to board
		point = this.pointAtIndex(4, 8);
		timeline.add({
			targets: [this._handSprite, this.dragBlocks[2]],
			x: point.x,
			y: point.y,
			duration: 800,
			ease: 'Linear',
			repeat: 0,
			onComplete: function() {
				if(_this.dragBlocks[2] != null)
				_this.onBlockDragEnd(_this.dragBlocks[2]);
			}
		});

		// Put block on Board
		timeline.add({
			targets: this._handSprite,
			scaleX: 0.7,
			scaleY: 0.7,
			duration: 500,
			ease: 'Back.easeOut',
			repeat: 0,
		});

		point = this.pointAtIndex(5, 5);
		timeline.add({
			targets: this._handSprite,
			x: point.x,
			y: point.y,
			duration: 800,
			ease: 'Linear',
			repeat: 0,
			delay: 500,
			onComplete: function() {
				if(_this._handSprite != null)
					_this._handSprite.destroy();
				_this.endTutorial();	
			}
		});

		timeline.play();
	}

    initForTutorial() {
		this._handSprite = this.add.sprite(this.zone[1].x, this.zone[2].y, 'images_atlat', 'hand.png');
		this._handSprite.setOrigin(0.18, 0.18);
		this._handSprite.alpha = 0.6;
		this._handSprite.setScale(0.7);
		this._handSprite.depth = 10;

		this._textTutorial = this.add.sprite(this.zone[1].x, this.game.config.height * 0.87, 'images_atlat', 'text_tutorial_0.png');
		this._textTutorial.setScale(0.7);
		this._textTutorial.depth = 11;
    }
    
    setEnableTutorial(enabled)
	{
		// this.LayoutTutorial.alpha = enabled ? 1 : 0;
	}

	showGameover() {
		for(var i=0; i<3; i++) {
			if(this.dragBlocks[i] != null) {
				this.dragBlocks[i].inputEnabled = false;
			}
		}
		this.scene.start("GameOver");
	}

	addScore(bonusScore) {
		this._score += bonusScore;

		// if(this._score >= 10)
			// this.showGameover();
	}

	checkAvaiable() {
		var canPutBlockAt = false;
		for(var i=0; i<3; i++) {
			if(this.dragBlocks[i] != null) {
				var availableIndexes = this.getAvailableIndexes(this.dragBlocks[i]);
				if(availableIndexes != null && availableIndexes.length > 0) {
					canPutBlockAt = true;
				}
			}
		}

		if(!canPutBlockAt) {
			this.showGameover();
		}
	}

	getAvailableIndexes(block) {
		var indexes = [];
		for(var row=0; row<this.Rows; row++) {
			for(var col=0; col<this.Columns; col++) {
				if(this.canPutBlockAt(block, row, col)) {
					indexes.push({
						x : row,
						y : col,
					})
				}
			}
		}
		return indexes;
	}

	indexAtPoint(x, y) {
		var spaceX = 1.7;
		var spaceY = 1.7;

        var blockSize = GameConfig.getBlockSize();

		var posX = -this.board.width * 0.5 + blockSize.width + this.board.x + 7.3 - blockSize.width * 0.5;
		var posY = -this.board.height * 0.5 + blockSize.height + this.board.y + 7.3 - blockSize.height * 0.5;

		var index = new Phaser.Math.Vector2(0, 0);
		index.y = (x - posX) / (blockSize.width + spaceX);
		index.x = (y - posY) / (blockSize.height + spaceY);
		return index;
	}

	pointAtIndex(row, col) {
		var spaceX = 1.7;
		var spaceY = 1.7;

        var blockSize = GameConfig.getBlockSize();

		var posX = -this.board.width * 0.5 + blockSize.width + this.board.x + 7.3 - blockSize.width * 0.5;
		var posY = -this.board.height * 0.5 + blockSize.height + this.board.y + 7.3 - blockSize.height * 0.5;

		posX = posX + (blockSize.width + spaceX) * col;
		posY = posY + (blockSize.height + spaceY) * row;

		return {
			x : posX,
			y : posY,
		};
	}

	onBlockDragBegin(block) {
		this.setEnableTutorial(false);
		block.enableDragging(true);
	}

	onBlockDragEnd(block) {
		this.setEnableTutorial(true);
		var index = this.indexAtPoint(block.x, block.y);

		if (block.Width % 2 == 0)
				index.y -= 0.5;
			if (block.Height % 2 == 0)
				index.x -= 0.5;

		var row = Math.round(index.x);
		var col = Math.round(index.y);

		if(this.canPutBlockAt(block, row, col)) {
			//this.sound.playAudioSprite('audiosprite_blocks', 'put_block');
			this.putBlockAt(block, row, col);
			this.dragBlocks[block.getIndex()] = null;
						
			this.addScore(block.countCell());
			var clearLines = this.checkGrid();
			this.removeRows(clearLines.rows);
			this.removeColumns(clearLines.columns);
			
			console.log('Combo blocks = %d', clearLines.rows.length + clearLines.columns.length);
			switch(clearLines.rows.length + clearLines.columns.length)
			{
				case 1:
				case 2:
					//this.sound.playAudioSprite('audiosprite_blocks', 'combo_12');
					break;
				case 3:
				case 4:
					//this.sound.playAudioSprite('audiosprite_blocks', 'combo_34');
					break;
				case 5:
					//this.sound.playAudioSprite('audiosprite_blocks', 'combo_5');
					break;
				case 6:
					//this.sound.playAudioSprite('audiosprite_blocks', 'combo_6');
					break;
			}

			if(clearLines.rows.length + clearLines.columns.length < 2)
			{
			}
			else if(clearLines.rows.length + clearLines.columns.length < 4)
			{
				this.showAnimation(Phaser.Math.Between(1, 2));
			}
			else
			{
				this.showAnimation(3);
			}

		} else {
			//this.sound.playAudioSprite('audiosprite_blocks', 'drop_block');
			block.setPosition(this.zone[block.getIndex()].x, this.zone[block.getIndex()].y);
			block.enableDragging(false);
		}
	}

	removeCell(cell, moveBottom, delay) {
		console.log('Remove Cell');
		cell.exploding(moveBottom, delay);
	}

	removeRows(rowList) {
		if(rowList == null || rowList.length <= 0)
			return;
		for(var i=0; i<rowList.length; i++) {
			var row = rowList[i];
			if(row < 0 || row >= this.Rows)
				continue;

			this.addScore(10);
			var delayAnim = 50;
			for(var col=0; col <this.Columns; col++) {
				if(this.blocks[row][col] != null) {
					this.removeCell(this.blocks[row][col], true, col * delayAnim);
					this.blocks[row][col] = null;
				}
			}
		}
	}

	removeColumns(colList) {
		if(colList == null || colList.length <= 0)
			return;
		for(var i=0; i<colList.length; i++) {
			var col = colList[i];
			if(col < 0 || col >= this.Rows)
				continue;

			this.addScore(10);
			var delayAnim = 50;
			for(var row=0; row <this.Rows; row++) {
				if(this.blocks[row][col] != null) {
					this.removeCell(this.blocks[row][col], false, row * delayAnim);
					this.blocks[row][col] = null;
				}
			}
		}
	}

	isFulfilledColumn(col) {
		if (this.Rows <= 1) return false;
    for (var row = 0; row < this.Rows; row++) {
			if (this.blocks[row][col] == null) {
				return false;
      }
    }
    return true;
  }

	isFulfilledRow(row) {
		if (this.Columns <= 1) return false;
    for (var col = 0; col < this.Columns; col++) {
			if (this.blocks[row][col] == null) {
				return false;
      }
    }
    return true;
  }

	checkGrid() {
		var rowClear = [];
		var colClear = [];

		for(var row=0; row<this.Rows; row++) {
			if(this.isFulfilledRow(row))
				rowClear.push(row);
		}

		for(var col=0; col<this.Columns; col++) {
			if(this.isFulfilledColumn(col))
				colClear.push(col);
		}

		return {
			rows : rowClear,
			columns : colClear,
		};
	}

	spawnNewBlocks() {
		for(var i=0; i<3; i++) {
			var block = new Block(this.game, BlockHelper.getData(this.game.math.between(0, BlockHelper.getTotal() - 1)));
            this.add.existing(block);

            block.setIndex(i);
			block.setDelegate(this);
			block.x = this.zone[i].x;
			block.y = this.zone[i].y;
			block.z = 1;
			block.show();

			this.dragBlocks[i] = block;
		}
	}

	loadDragBlock() {
		for(var i=0; i<3; i++) {
			var block = new Block(this, BlockHelper.getData(TutorialData.getBlockStep(this._step * 2 + i)));
			this.add.existing(block);
			block.setDelegate(this);
			block.setIndex(i);
			block.x = this.zone[i].x;
			block.y = this.zone[i].y;
			block.depth = 5;
			block.show();
			block.enableDragging(false);
			block.disableInteractive();
			this.dragBlocks[i] = block;
		}
	}

	loadBoard()
	{
		var dataBoard = TutorialData.getBoardStep(this._step);
		for(var row = 0; row < this.Rows; row++) {
			for(var col = 0; col < this.Columns; col++) {
				if(dataBoard[row][col] == 1 && this.blocks[row][col] == null) {
					var cell = new Cell(this);
					cell.depth = 3;
					cell.show();
                    this.setCellAtIndex(row, col, cell);
                    
                    this.tweens.add({
                        targets : cell,
                        alpha : 1.0,
                        ease : 'Linear',
                        duration : 300
                    });
				}
				else if(dataBoard[row][col] == 0 && this.blocks[row][col] != null) {
					var cell = this.blocks[row][col];
					cell.depth = 3;
					cell.destroy();
					this.blocks[row][col] = null;
				}
			}
		}
	}

	needUpdateDragBlocks() {
		for(var i=0; i<3; i++) {
			if(this.dragBlocks[i] != null)
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
		this.add.existing(cell);
	}

	putBlockAt(block, row, col) {
		var blockColumnCount = block.Width;
    	var blockRowCount = block.Height;

		var halfColumnCount = Math.floor(blockColumnCount / 2);
    	var halfRowCount = Math.floor(blockRowCount / 2);

		if (blockColumnCount % 2 == 0)
			halfColumnCount--;
    	if (blockRowCount % 2 == 0)
      		halfRowCount--;

		for (var tmpRow = 0; tmpRow < blockRowCount; tmpRow++) {
			for (var tmpCol = 0; tmpCol < blockColumnCount; tmpCol++) {
				var cell = block.cells[tmpRow][tmpCol];
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
		if(row < 0 || row >= this.Rows || col < 0 || col >= this.Columns)
			return false;

		var blockColumnCount = block.Width;
		var blockRowCount = block.Height;

		var halfColumnCount = Math.floor(blockColumnCount / 2);
    	var halfRowCount = Math.floor(blockRowCount / 2);

		if (blockColumnCount % 2 == 0)
			halfColumnCount--;
		if (blockRowCount % 2 == 0)
			halfRowCount--;

		var datas = [];
    	for (var tmpRow = 0; tmpRow < blockRowCount; tmpRow++) {
			for (var tmpCol = 0; tmpCol < blockColumnCount; tmpCol++) {
				if (block.cells[tmpRow][tmpCol] != null) {
					var cellRow = row + (tmpRow - halfRowCount);
					var cellCol = col + (tmpCol - halfColumnCount);
					datas.push({
						x : cellRow,
						y : cellCol,
					});

					if(cellRow < 0 || cellRow >= this.Rows || cellCol < 0 || cellCol >= this.Columns)
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
		for(var i=0; i<data.length; i++) {
			var point = data[i];

			var pass = false;
			for(var j=0; j<conditions.length; j++) {
				var data = conditions[i];

				if(data.x == point.x && data.y == point.y) {
					pass = true;
					break;
				}
			}
			if(!pass)
				return false;
		}
		return true;
	}
}