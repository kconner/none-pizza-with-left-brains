import AppSprite from './appSprite'

export default class FoodSprite extends AppSprite {
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
    }
}
