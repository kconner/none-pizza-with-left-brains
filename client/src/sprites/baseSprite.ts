import AppSprite from './appSprite'

export default class BaseSprite extends AppSprite {
    static loadAsset(game: Phaser.Game): void {
        game.load.image('base', 'base.png')
    }

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'base')

        this.width = 80
        this.height = 120

        this.anchor.x = 0.5
        this.anchor.y = 0.5
    }
}
