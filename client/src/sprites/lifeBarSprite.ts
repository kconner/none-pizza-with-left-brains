import AppSprite from './appSprite'

export default class LifeBarSprite extends AppSprite {
    private maximum: number

    static loadAsset(game: Phaser.Game): void {
        game.load.image('lifeBar', 'lifeBar.png')
    }

    constructor(game: Phaser.Game, x: number, y: number, maximum: number) {
        super(game, x, y, 'lifeBar')

        this.width = 100
        this.height = 4

        this.anchor.x = 0.5
        this.anchor.y = 0

        this.maximum = maximum
        this.setHP(maximum)
    }

    setHP(hp: number) {
        // TODO: Set this fraction when the subject's health changes
        this.width = hp * 0.5

        const fraction = hp / this.maximum
        if (fraction < 0.333) {
            this.tint = 0xff4400
        } else if (fraction < 0.666) {
            this.tint = 0xccff00
        } else {
            this.tint = 0x00ff44
        }

        // if (fraction < 0.333) {
        //     // TODO: Greenish
        // } else if (fraction < 0.666) {
        //     // TODO: Amber
        // } else {
        //     // TODO: Blood for the blood gods
        // }
    }
}
