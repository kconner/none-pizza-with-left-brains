import AppSprite from './appSprite'

enum HouseBaseFrames {
    HUMAN = 0,
    ZOMBIE = 1,
}

export default class BaseMiniMapSprite extends AppSprite {
    private wantedAlpha = 0

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

        this.scale.setTo(0.5, 0.5)

        if (team === 'Human') {
            this.frame = HouseBaseFrames.HUMAN
        } else {
            this.frame = HouseBaseFrames.ZOMBIE
        }

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.fixedToCamera = true

        console.log('House Mini Map Offset X: ' + this.cameraOffset.x)
        console.log('House Mini Map Offset X: ' + this.offsetX)

        console.log('House Mini Map Offset Y: ' + this.cameraOffset.y)
        console.log('House Mini Map Offset Y: ' + this.offsetY)
    }

    update() {
        super.update()
    }

    showHP(hp: number) {}
}
