import { Keyboard } from 'phaser-ce'
import { Actions } from './models'

export default class Controls {
    private keyboard: Phaser.Keyboard
    private cursorKeys: Phaser.CursorKeys

    constructor(input: Phaser.Input) {
        this.keyboard = input.keyboard
        this.cursorKeys = this.keyboard.createCursorKeys()
    }

    spacebarIsDown(): boolean {
        return this.keyboard.isDown(Phaser.KeyCode.SPACEBAR)
    }

    arrowMotion(): Movement | null {
        const motion = Actions.movement()
        let valid = false

        if (this.cursorKeys.left.isDown) {
            motion.x = -1
            valid = true
        } else if (this.cursorKeys.right.isDown) {
            motion.x = +1
            valid = true
        }

        if (this.cursorKeys.up.isDown) {
            motion.y = -1
            valid = true
        } else if (this.cursorKeys.down.isDown) {
            motion.y = +1
            valid = true
        }

        return valid ? motion : null
    }
}
