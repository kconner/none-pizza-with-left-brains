import AppSprite from './appSprite'

export default class MiniMapSprite extends AppSprite {
    private static readonly width = 320
    private static readonly height = 180

    static loadAsset(game: Phaser.Game): void {
        game.load.spritesheet('minimap', 'minimap.png', MiniMapSprite.width, MiniMapSprite.height)
    }

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'minimap')

        // use the bitmap data as the texture for the sprite
        this.position.x = game.canvas.width - MiniMapSprite.width
        this.position.y = game.canvas.height - MiniMapSprite.height

        this.alpha = 0.75

        this.fixedToCamera = true
    }

    update() {
        super.update()
    }
}
