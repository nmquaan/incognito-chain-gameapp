export class ImageButton extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frameNormal, frameSelect, callback) {
        super(scene, x, y, texture, frameNormal);
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonResetState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => this.enterButtonHoverState());
        this._frameNormal = frameNormal;
        this._frameSelected = frameSelect;
        this._childs = [];
    }

    addChild(child) {
        this._childs.push(child);
    }

    enterButtonHoverState() {
        this.setFrame(this._frameNormal);
    }

    enterButtonResetState() {
        this.setFrame(this._frameNormal);
    }

    enterButtonActiveState() {
        this.setFrame(this._frameSelected);
    }
}