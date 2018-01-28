import AppSprite from './appSprite'

export default class FoodSprite extends AppSprite {
    private destination: { x: number; y: number } = { x: 0, y: 0 }

    static loadAssets(game: Phaser.Game): void {
        game.load.image('pizza-sprite', 'pizza-sprite.png')
        game.load.image('brain-sprite', 'brain-sprite.png')
    }

    constructor(game: Phaser.Game, food: Food) {
        super(game, food.position.x, food.position.y, food.team === 'Human' ? 'pizza-sprite' : 'brain-sprite')

        console.log(food.position.x)
        console.log(food.position.y)

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.destination.x = food.position.x
        this.destination.y = food.position.y
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
}
