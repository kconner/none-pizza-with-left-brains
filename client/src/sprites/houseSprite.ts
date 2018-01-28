import AppSprite from './appSprite'
import LifeBarSprite from './lifeBarSprite'

export default class BaseSprite extends AppSprite {
    static loadAsset(game: Phaser.Game): void {
        game.load.image('base', 'base.png')
    }

    private readonly lifeBar: LifeBarSprite = null

    constructor(game: Phaser.Game, x: number, y: number, maxHp: number) {
        super(game, x, y, 'base')

        this.width = 240
        this.height = 240

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.lifeBar = new LifeBarSprite(this.game, 0, -this.height / 2 - 10, maxHp)
        this.addChild(this.lifeBar)
    }

    showHP(hp: number) {
        console.log(hp)
        this.lifeBar.showHP(hp)
    }
}
