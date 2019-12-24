import Cell from './Cell'
import BlockHelper from '../data/BlockHelper'
import { Game } from 'phaser';
import GameConfig from '../GameConfig';

export default class Block extends Phaser.GameObjects.Container {

  constructor(scene, type) {
    super(scene, 0, 0);
    this._anchor = new Phaser.Geom.Point(0, 0);
    this._cells = [];
    this._scene = scene;
    this._width = 0;
    this._height = 0;
    this._type = type;
    this._matrix = BlockHelper.getData(this._type);
    this._isHold = false;
    this._index = 100;

    // Decorate
    this._frameIndex = Phaser.Math.Between(1, 6);
    this.updateShape();
  }

  setBlockColor(color)
  {
    var rowCount = this._matrix.length;
    var colCount = this._matrix[0].length;
    for (var row = 0; row < rowCount; row++) {
      for (var col = 0; col < colCount; col++) {
        if (this._cells[row][col] != null) {
          this._cells[row][col].setCellColor(color);
        }
      }
    }
  }

  show() {
    this.alpha = 0.1;
    this.setActive(true);
    this._scene.tweens.add({
			targets: this,
			alpha: 1,
			duration: 300,
			repeat: 0,
		});
  }

  deactiveBlock() {
    // this.off('pointerup', this.onTouchedUp);
    // this.off('pointerdown', this.onTouchedDown);
  }

  setIndex(index) {
    this._index = index;
  }

  getIndex() {
    return this._index;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  countCell() {
    var totalCell = 0;
    for (var row = 0; row < 5; row++) {
      for (var col = 0; col < 5; col++) {
        if (this._cells[row][col] != null) {
          totalCell += 1;
        }
      }
    }
    return totalCell;
  }

  enableDragging(enabled) {
    this.setScale(enabled ? 1.0 : 0.5);
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  onTouchedDown(pointer) {
    if(this._delegate._isDraggingBlock)
      return;
    this._isHold = true;
    if(this._delegate != null)
      this._delegate.onBlockDragBegin(this);
  }

  onTouchedUp(pointer) {
    this._isHold = false;
    if(this._delegate != null)
      this._delegate.onBlockDragEnd(this);
  }

  updateView() {
    var rowCount = this._matrix.length;
    var colCount = this._matrix[0].length;
    for (var row = 0; row < rowCount; row++) {
      for (var col = 0; col < colCount; col++) {
        if (this._cells[row][col] != null) {
          this._cells[row][col].updateView();
        }
      }
    }
  }
  
  updateAnchor() {
    var currentWidth = 0;
    var maxWidth = 0;
    var maxHeight = 0;
    this._anchor = new Phaser.Geom.Point(0 , 0);

    var rowCount = this._matrix.length;
    var colCount = this._matrix[0].length;

    for(var row=0; row<rowCount; row++) {
      currentWidth = 0;
      for(var col=colCount-1; col>= 0; col--) {
        if(this._matrix[row][col] != 0) {
          currentWidth = col + 1;
          break;
        }
      }

      if(currentWidth != 0)
        ++maxHeight;

      if(currentWidth > maxWidth)
        maxWidth = currentWidth;
    }

    this._anchor.x = (maxWidth - 1) / colCount / 2.0;
    this._anchor.y = (maxHeight - 1) / rowCount / 2.0;

    this._width = maxWidth;
    this._height = maxHeight;
  }

  setSpriteFrame(texture)
  {
    var rowCount = this._matrix.length;
    var colCount = this._matrix[0].length;
    
    for (var row = 0; row < rowCount; row++) {
      for (var col = 0; col < colCount; col++) {
        if (this._cells[row][col] != null) {
          this._cells[row][col].setSpriteFrame(texture);
        }
      }
    }
  }

  updateShape() {
    this.updateAnchor();

    var rowCount = this._matrix.length;
    var colCount = this._matrix[0].length;

    var centerX = this._anchor.x * colCount;
    var centerY = this._anchor.y * rowCount;

    var total = [];
    this._cells = [];
    for (var row = 0; row < rowCount; row++) {
      this._cells[row] = new Array(colCount);
      for (var col = 0; col < colCount; col++) {
        if (this._matrix[row][col] != 0) {
          var cell = new Cell(this._scene, this._frameIndex);
          cell.depth = 10;
          this._cells[row][col] = cell;
          this.add(cell);
          total.push(cell);
          cell.x = (col - centerX) * (cell.width + GameConfig.getSpaceBlock().width);
          cell.y = (row - centerY) * (cell.height + GameConfig.getSpaceBlock().height);
        }
      }
    }
    // this.add(total);
  }

  OnPutIntoGrid() {
    this.removeAll(false);
  }
}
