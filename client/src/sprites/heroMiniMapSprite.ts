import AppSprite from './appSprite'

export default class HeroMiniMapSprite extends AppSprite {
    private readonly id: string
    private destination: { x: number; y: number } = { x: 0, y: 0 }

    private static readonly width = 15
    private static readonly height = 24

    static loadAsset(game: Phaser.Game): void {
        game.load.spritesheet('hero-mini', 'hero-mini.png', 15, 24)
    }

    constructor(game: Phaser.Game, id: string, hero: Hero, maxHp: number) {
        super(game, hero.position.x, hero.position.y, 'hero-mini')

        var x = hero.position.x
        var y = hero.position.y

        x = x / 12
        y = y / 12

        x = game.canvas.width - 320 + x
        y = game.canvas.height - 180 + y

        this.position.x = x
        this.position.y = y

        this.width = HeroMiniMapSprite.width
        this.height = HeroMiniMapSprite.height

        this.anchor.x = 0.5
        this.anchor.y = 0.5
        this.id = id

        this.fixedToCamera = true
        console.log('start offset:' + this.offsetX)
    }

    update() {
        super.update()
        console.log('current x position:' + this.position.x)
        this.cameraOffset.set(this.position.x, this.position.y)
    }

    showX(x: number) {
        var newX = this.game.canvas.width - 320 + x / 12
        this.position.x = newX
    }

    showY(y: number) {
        var newY = this.game.canvas.height - 180 + y / 12
        this.position.y = newY
    }
}
