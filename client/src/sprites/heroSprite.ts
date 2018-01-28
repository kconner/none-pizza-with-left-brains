import AppSprite from './appSprite'
import LifeBarSprite from './lifeBarSprite'

enum HeroAnimation {
    stand = 'Stand',
    walk = 'Walk',
    attack = 'Attack',
    die = 'Die',
}

export default class HeroSprite extends AppSprite {
    private readonly id: string
    private readonly lifeBar: LifeBarSprite = null
    private destination: { x: number; y: number } = { x: 0, y: 0 }

    static loadAsset(game: Phaser.Game): void {
        game.load.spritesheet('hero-human', 'hero-human-spritesheet.png', 80, 120)
        game.load.spritesheet('hero-zombie', 'hero-zombie-spritesheet.png', 80, 120)
    }

    constructor(game: Phaser.Game, id: string, hero: Hero) {
        super(game, hero.position.x, hero.position.y, hero.team === 'Human' ? 'hero-human' : 'hero-zombie')

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.animations.add(HeroAnimation.stand, [0, 1, 2, 3, 3, 2, 1, 0], 15, true)
        this.animations.add(HeroAnimation.walk, [4, 5, 6, 7, 8, 9, 10, 11], 15, true)
        this.animations.add(HeroAnimation.attack, [12, 13, 14, 15], 15, false)
        this.animations.add(HeroAnimation.die, [15], 10, false)

        this.lifeBar = new LifeBarSprite(this.game, 0, -this.height / 2 - 10, 100)
        this.addChild(this.lifeBar)

        this.id = id

        this.showX(hero.position.x)
        this.showY(hero.position.y)
        this.showFacingDirection(hero.facingDirection)
        this.showHP(hero.hp)
        this.showActivity(hero.activity)
    }

    update() {
        super.update()

        const factor = 0.25
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
                this.scale.x = -1
                break
            case 'Right':
                this.scale.x = 1
                break
        }
    }

    showHP(hp: number) {
        console.log(hp)
        this.lifeBar.setHP(hp)
    }

    showActivity(activity: Activity) {
        switch (activity) {
            case 'Standing':
                this.playAnimation(HeroAnimation.stand)
                break
            case 'Walking':
                this.playAnimation(HeroAnimation.walk)
                break
            case 'Dead':
                this.playAnimation(HeroAnimation.die)
                break
        }
    }

    showAttacking() {
        // Play the attack animation, then resume the activity animation
        this.playAnimation(HeroAnimation.attack, () => {
            const gameState = this.app()
                .connection()
                .data()
            if (!gameState || !gameState.heroes) {
                return
            }

            const hero = gameState.heroes[this.id]
            if (!hero) {
                return
            }

            this.showActivity(hero.activity)
        })
    }

    private playAnimation(animation: HeroAnimation, completion?: () => void) {
        this.animations.play(animation)

        if (!completion) {
            return
        }

        this.animations.currentAnim.onComplete.addOnce(completion)
    }
}
