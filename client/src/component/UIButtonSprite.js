
export default class UIButtonSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frameNormal, frameSelect, callback, scope) {
        super(scene, x, y, texture, frameNormal);
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonResetState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => this.enterButtonHoverState());
        this._frameNormal = frameNormal;
        this._frameSelected = frameSelect;
        this._callback = callback;
        this._childs = [];
        this._index = -1;
        this._scope = scope;
    }

    setIndex(index) {
        this._index = index;
    }

    getIndex() { return this._index; }

    addChild(child) {
        this._childs.push(child);
    }

    enterButtonHoverState() {
        this.setFrame(this._frameNormal);
        if(this._childs != null)
        {
            this._childs.forEach(element => {
                element.setPosition(this.x, this.y);
            });
        }
    }

    enterButtonResetState() {
        this.setFrame(this._frameNormal);
        if(this._childs != null)
        {
            this._childs.forEach(element => {
                element.setPosition(this.x, this.y);
            });
        }
    }

    enterButtonActiveState() {
        this.setFrame(this._frameSelected);
        if(this._childs != null)
        {
            this._childs.forEach(element => {
                element.setPosition(this.x + 3, this.y + 3);
            });
        }

        if (this._callback != null)
            this._callback.call(this._scope, this);
    }
}