import AppSprite from './appSprite'

enum HouseBaseFrames {
    HUMAN = 0,
    ZOMBIE = 1,
}

export default class BaseMiniMapSprite extends AppSprite {
    static loadAsset(game: Phaser.Game): void {
        game.load.spritesheet('houseBaseMini', 'house-base-mini.png', 20, 20)
    }

    constructor(game: Phaser.Game, x: number, y: number, maxHp: number, team: Team) {
        super(game, x, y, 'houseBaseMini')
        var xSize = 20
        var ySize = 20

        // mini-map-ify the proportions
        x = x / 12
        y = y / 12

        x = game.canvas.width - 320 + x
        y = game.canvas.height - 180 + y

        this.position.x = x
        this.position.y = y

        this.width = xSize
        this.height = ySize

        if (team === 'Human') {
            this.frame = HouseBaseFrames.HUMAN
        } else {
            this.frame = HouseBaseFrames.ZOMBIE
        }

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.fixedToCamera = true
    }

    update() {
        super.update()
    }

    showHP(hp: number) {}
}
