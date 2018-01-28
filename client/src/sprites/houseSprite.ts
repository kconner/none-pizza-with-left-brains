import AppSprite from './appSprite'
import LifeBarSprite from './lifeBarSprite'

enum HouseFrames {
    HUMAN = 0,
    HUMAN_DESTROYED = 1,
    ZOMBIE = 2,
    ZOMBIE_DESTROYED = 3
}

export default class HouseSprite extends AppSprite {

    public static readonly RADIUS: number = 240

    static loadAsset(game: Phaser.Game): void {
        game.load.spritesheet('house', 'houses.png', HouseSprite.RADIUS, HouseSprite.RADIUS)
    }

    private readonly lifeBar: LifeBarSprite = null

    constructor(game: Phaser.Game, x: number, y: number, maxHp: number, team: Team) {
        super(game, x, y, 'house')

        this.width = HouseSprite.RADIUS
        this.height = HouseSprite.RADIUS

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.lifeBar = new LifeBarSprite(this.game, 0, -this.height / 2 - 10, maxHp)
        this.addChild(this.lifeBar)
        this.showHP(maxHp)

        if (team === 'Human') {
            this.frame = HouseFrames.HUMAN
        } else {
            this.frame = HouseFrames.ZOMBIE
        }
    }

    showHP(hp: number) {
        console.log(hp)
        this.lifeBar.showHP(hp)
        if (hp <= 0) {
            if (this.frame == HouseFrames.HUMAN) {
                this.frame = HouseFrames.HUMAN_DESTROYED
            } else {
                this.frame = HouseFrames.ZOMBIE_DESTROYED
            }
        }
    }
}
