import AppSprite from './appSprite'
import LifeBarSprite from './lifeBarSprite'

enum BaseFrames {
    HUMAN = 0,
    HUMAN_DESTROYED = 1,
    ZOMBIE = 2,
    ZOMBIE_DESTROYED = 3,
}

export default class BaseSprite extends AppSprite {
    private static readonly SIZE = 240

    static loadAsset(game: Phaser.Game): void {
        game.load.spritesheet('base', 'bases.png', BaseSprite.SIZE, BaseSprite.SIZE)
    }

    private readonly lifeBar: LifeBarSprite = null

    constructor(game: Phaser.Game, x: number, y: number, maxHp: number, team: Team) {
        super(game, x, y, 'base')

        this.width = BaseSprite.SIZE
        this.height = BaseSprite.SIZE

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.lifeBar = new LifeBarSprite(this.game, 0, -this.height / 2 - 10, maxHp, BaseSprite.SIZE)
        this.addChild(this.lifeBar)
        this.showHP(maxHp)

        if (team === 'Human') {
            this.frame = BaseFrames.HUMAN
        } else {
            this.frame = BaseFrames.ZOMBIE
        }
    }

    showHP(hp: number) {
        this.lifeBar.showHP(hp)

        if (hp <= 0) {
            if (this.frame == BaseFrames.HUMAN) {
                this.frame = BaseFrames.HUMAN_DESTROYED
            } else {
                this.frame = BaseFrames.ZOMBIE_DESTROYED
            }
        }
    }
}
