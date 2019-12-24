import BlockHelper from "../data/BlockHelper";
import GameConfig from '../GameConfig';
import ThemeHelper from "../data/ThemeHelper";
export default class Cell extends Phaser.GameObjects.Container {

  constructor(scene, frameIndex) {
    super(scene, 0, 0);
    this._frame = frameIndex;
    this._scene = scene;
    this._row = -1;
    this._isHighlight = false;
    this._isDragging = false;

    this._back = this._scene.add.sprite(0, 0, 'game_images', 'default_white.png');
    this._back.setOrigin(0.5);
    this._back.displayWidth = this._back.width = GameConfig.getBlockSize().width + GameConfig.getSpaceBlock().width * 2;
    this._back.displayHeight = this._back.height = GameConfig.getBlockSize().height + GameConfig.getSpaceBlock().height * 2;
    this._back.depth = 1;
    this._back.setTint(0x000000, 0x000000, 0x000000, 0x000000);
    this.add(this._back);

    if (ThemeHelper.getCurrentTheme().block.sprite.length > 0) {
      this._elemental = this._scene.add.sprite(0, 0, 'game_images', 'block_wood.png');
      this._elemental.setOrigin(0.5);
      this._elemental.depth = 5;
      this._elemental.displayWidth = this._elemental.width = GameConfig.getBlockSize().width;
      this._elemental.displayHeight = this._elemental.height = GameConfig.getBlockSize().height;
      this.add(this._elemental);
    }
    else {
      this._elemental = this._scene.add.sprite(0, 0, 'game_images', 'default_white.png');
      this._elemental.setOrigin(0.5);
      this._elemental.depth = 5;
      this._elemental.displayWidth = this._elemental.width = GameConfig.getBlockSize().width;
      this._elemental.displayHeight = this._elemental.height = GameConfig.getBlockSize().height;
      this.add(this._elemental);
    }

    this._elemental.setTint(0x000000, 0x000000, 0x000000, 0x000000);

    this.width = this._elemental.displayWidth;
    this.height = this._elemental.displayHeight;
  }

  show() {
    this.alpha = 0;
  }

  setVisible(visibled) {
    this._elemental.setVisible(visibled);
    this._back.setVisible(visibled);
  }

  enabledHighlight(isEnabled) {
    this._isHighlight = isEnabled;
  }

  enabledDragHighlight(isEnabled) {
    this._isDragging = isEnabled;
  }

  setCellColor(color) {
    this._elemental.setTint(color, color, color, color);
  }

  updateView() {
    var themeData = ThemeHelper.getCurrentTheme();
    this.setSpriteFrame(themeData.block.sprite);
    if (this._isHighlight) {
      this.setAlpha(0.4);
      this._elemental.setTint(themeData.block.color_highlight, themeData.block.color_highlight, themeData.block.color_highlight, themeData.block.color_highlight);
    } else {
      this.setAlpha(1.0);
      if (this._row < 0)
        this._elemental.setTint(themeData.block.color_default, themeData.block.color_default, themeData.block.color_default, themeData.block.color_default);
      else if (this._isDragging)
        this._elemental.setTint(themeData.block.color_dragging, themeData.block.color_dragging, themeData.block.color_dragging, themeData.block.color_dragging);
      else
        this._elemental.setTint(themeData.block.colors_on_grid[this._row], themeData.block.colors_on_grid[this._row], themeData.block.colors_on_grid[this._row], themeData.block.colors_on_grid[this._row]);
    }
  }

  setSpriteFrame(frame) {
    var width = this._elemental.width;
    var height = this._elemental.height;

    if (frame.length > 0) {
      this._elemental.setTexture('game_images', 'block_wood.png');
    }
    else {
      this._elemental.setTexture('game_images', 'default_white.png');
    }
    this._elemental.width = this._elemental.displayWidth = width;
    this._elemental.height = this._elemental.displayHeight = height;
  }

  setCellSize(width, height, spaceWidth, spaceHeight) {
    this._back.displayWidth = width + spaceWidth * 2;
    this._back.displayHeight = height + spaceHeight * 2;

    this._elemental.displayWidth = this._elemental.width = width;
    this._elemental.displayHeight = this._elemental.height = height;
  }

  exploding(moveBottom, delay) {
    this._scene.tweens.add({
      targets: this,
      scale: 0,
      delay: delay,
      angle: 45,
      duration: 300,
      repeat: 0,
    });

    // if(moveBottom) {
    //   this._scene.tweens.add({
    //     targets: this,
    //     alpha: 0,
    //     delay : delay,
    //     y : this.y + 80,
    //     duration: 300,
    //     repeat: 0,
    //   });
    // } else {
    //   this._scene.tweens.add({
    //     targets: this,
    //     alpha: 0,
    //     delay : delay,
    //     x : this.x + 80,
    //     duration: 300,
    //     repeat: 0,
    //   });
    // }
  }

  destroyCell() {
    this.destroy();
  }
}  