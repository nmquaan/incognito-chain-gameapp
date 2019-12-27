export default class Coin extends Phaser.GameObjects.Container {
  constructor(scene, value) {
    super(scene, 0, 0);
    this._scene = scene;
    this._value = value;

    this._back = this._scene.add.sprite(0, 0, 'game_images', 'default_white.png');
    this._back.setOrigin(0.5);
    this._back.displayWidth = this._back.width = GameConfig.getBlockSize().width + GameConfig.getSpaceBlock().width * 2;
    this._back.displayHeight = this._back.height = GameConfig.getBlockSize().height + GameConfig.getSpaceBlock().height * 2;
    this._back.depth = 1;
    this._back.setTint(0x000000, 0x000000, 0x000000, 0x000000);
    this.add(this._back);

    this._text = this.add.text(0, 0, this._value.toString(), { font: "30px Lightmorning", fill: "#e74c3c" });
    this.add(this._text);

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

  exploding(moveBottom, delay) {
    this._scene.tweens.add({
      targets: this,
      scale: 0,
      delay: delay,
      angle: 45,
      duration: 300,
      repeat: 0,
    });
  }
}  