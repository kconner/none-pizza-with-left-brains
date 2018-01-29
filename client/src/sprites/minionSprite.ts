import AppSprite from './appSprite'
import LifeBarSprite from './lifeBarSprite'

export default class MinionSprite extends AppSprite {
    private readonly id: string
    private readonly lifeBar: LifeBarSprite = null
    private destination: { x: number; y: number } = { x: 0, y: 0 }

    static loadAsset(game: Phaser.Game): void {
        game.load.spritesheet('minion-human', 'human-creep-spritesheet.png', 72, 120)
        game.load.spritesheet('minion-zombie', 'zombie-creep-spritesheet.png', 80, 120)
    }

    constructor(game: Phaser.Game, id: string, minion: Minion, maxHp: number) {
        super(game, minion.position.x, minion.position.y, minion.team === 'Human' ? 'minion-human' : 'minion-zombie')

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 15, true)

        this.animations.play('walk')

        this.lifeBar = new LifeBarSprite(this.game, 0, -this.height / 2 - 20, maxHp)
        this.addChild(this.lifeBar)

        this.id = id
        this.scale.setTo(0.7, 0.7)
        this.showX(minion.position.x)
        this.showY(minion.position.y)
    }

    update() {
        super.update()

        const factor = 0.15
        this.position.x += factor * (this.destination.x - this.position.x)
        this.position.y += factor * (this.destination.y - this.position.y)
    }

    showX(x: number) {
        this.destination.x = x

        if (150 < Math.abs(this.destination.x - this.position.x)) {
            this.position.x = x
        }
    }

    showY(y: number) {
        this.destination.y = y

        if (150 < Math.abs(this.destination.y - this.position.y)) {
            this.position.y = y
        }
    }

    showFacingDirection(facingDirection: FacingDirection) {
        switch (facingDirection) {
            case 'Left':
                this.scale.x = -0.7
                break
            case 'Right':
                this.scale.x = 0.7
                break
        }
    }

    showHP(hp: number) {
        this.lifeBar.showHP(hp)
    }
}
