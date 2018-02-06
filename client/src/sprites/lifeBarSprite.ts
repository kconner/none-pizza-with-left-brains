import AppSprite from './appSprite'

export default class LifeBarSprite extends AppSprite {
    private maximumHP: number
    private widthWhenFull: number

    static loadAsset(game: Phaser.Game): void {
        game.load.image('lifeBar', 'lifeBar.png')
    }

    constructor(game: Phaser.Game, x: number, y: number, maximumHP: number, widthWhenFull: number) {
        super(game, x, y, 'lifeBar')

        this.width = widthWhenFull
        this.height = 4

        this.anchor.x = 0.5
        this.anchor.y = 0

        this.maximumHP = maximumHP
        this.widthWhenFull = widthWhenFull

        this.showHP(maximumHP)
    }

    showHP(hp: number) {
        this.width = hp / this.maximumHP * this.widthWhenFull

        const fraction = hp / this.maximumHP
        if (fraction < 0.333) {
            this.tint = 0xff4400
        } else if (fraction < 0.666) {
            this.tint = 0xccff00
        } else {
            this.tint = 0x00ff44
        }
    }
}
