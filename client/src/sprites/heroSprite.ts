import AppSprite from './appSprite'
import LifeBarSprite from './lifeBarSprite'

enum HeroAnimation {
    stand = 'Stand',
    walk = 'Walk',
    attack = 'Attack',
    die = 'Die',
}

export default class HeroSprite extends AppSprite {
    readonly id: string
    readonly lifeBar: LifeBarSprite = null

    static loadAsset(game: Phaser.Game): void {
        // TODO: Load both Human and Zombie sheets
        game.load.spritesheet('myguy', 'walker.png', 48, 92)
    }

    constructor(game: Phaser.Game, id: string, hero: Hero) {
        // TODO: Pick a sheet based on the team
        super(game, hero.position.x, hero.position.y, 'myguy')

        // this.width = 80
        // this.height = 120

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        const stand = this.animations.add(HeroAnimation.stand, [54, 55], 3, false)
        stand.loop = true
        const walk = this.animations.add(HeroAnimation.walk, [54, 55, 56, 57, 58, 59, 60, 61, 62], 10, false)
        walk.loop = true
        this.animations.add(HeroAnimation.attack, [16, 32, 59, 29, 23], 10, false)
        this.animations.add(HeroAnimation.die, [0, 9, 18, 27, 36], 10, false)

        this.lifeBar = new LifeBarSprite(this.game, 0, -this.height / 2 - 10, 100)
        this.addChild(this.lifeBar)

        this.id = id

        this.showX(hero.position.x)
        this.showY(hero.position.y)
        this.showFacingDirection(hero.facingDirection)
        this.showHP(hero.hp)
        this.showActivity(hero.activity)
    }

    showX(x: number) {
        this.position.x = x
    }

    showY(y: number) {
        this.position.y = y
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
