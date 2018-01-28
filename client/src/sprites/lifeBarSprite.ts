import AppSprite from './appSprite'

export default class LifeBarSprite extends AppSprite {
    private maximum: number

    static loadAsset(game: Phaser.Game): void {
        game.load.image('lifeBar', 'lifeBar.png')
    }

    constructor(game: Phaser.Game, x: number, y: number, maximum: number) {
        super(game, x, y, 'lifeBar')

        this.width = maximum
        this.height = 4

        this.anchor.x = 0.5
        this.anchor.y = 0

        this.maximum = maximum
        this.showHP(maximum)
    }

    showHP(hp: number) {
        this.width = hp * 0.5

        const fraction = hp / this.maximum
        if (fraction < 0.333) {
            this.tint = 0xff4400
        } else if (fraction < 0.666) {
            this.tint = 0xccff00
        } else {
            this.tint = 0x00ff44
        }
    }
}
