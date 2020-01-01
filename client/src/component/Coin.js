export default class Coin extends Phaser.GameObjects.Sprite {
  constructor(scene, value) {
    super(scene, 0, 0, 'game_images', 'bet_' + value + '.png');
    this._scene = scene;
    this._value = value;
  }

  getValue() { return this._value; }

  show() {
    this.alpha = 0;
  }
}  