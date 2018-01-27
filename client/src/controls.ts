interface ArrowMotion {
    x: number
    y: number
}

export default class Controls {
    private _cursorKeys: Phaser.CursorKeys

    constructor(game: Phaser.Game) {
        this._cursorKeys = game.input.keyboard.createCursorKeys()
    }

    arrowMotion(): ArrowMotion | null {
        const motion: ArrowMotion = { x: 0, y: 0 }
        let valid = false

        if (this._cursorKeys.left.isDown) {
            motion.x = -1
            valid = true
        } else if (this._cursorKeys.right.isDown) {
            motion.x = +1
            valid = true
        }

        if (this._cursorKeys.up.isDown) {
            motion.y = -1
            valid = true
        } else if (this._cursorKeys.down.isDown) {
            motion.y = +1
            valid = true
        }

        return valid ? motion : null
    }
}
