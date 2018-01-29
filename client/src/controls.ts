export interface DirectionalMotion {
    x: Direction
    y: Direction
}

export default class Controls {
    private keyboard: Phaser.Keyboard
    private cursorKeys: Phaser.CursorKeys
    private gamepad: Phaser.SinglePad

    constructor(input: Phaser.Input) {
        this.keyboard = input.keyboard
        this.cursorKeys = this.keyboard.createCursorKeys()

        input.gamepad.start()
        this.gamepad = input.gamepad.pad1
    }

    startButtonIsDown(): boolean {
        return this.keyboard.isDown(Phaser.KeyCode.ENTER) || this.gamepad.isDown(Phaser.Gamepad.PS3XC_START)
    }

    attackButtonIsDown(): boolean {
        return (
            this.keyboard.isDown(Phaser.KeyCode.SPACEBAR) ||
            this.gamepad.isDown(Phaser.Gamepad.PS3XC_SQUARE) ||
            this.gamepad.isDown(Phaser.Gamepad.PS3XC_R2)
        )
    }

    directionalMotion(): DirectionalMotion | null {
        const motion: DirectionalMotion = { x: 0, y: 0 }
        let valid = false

        if (
            this.cursorKeys.left.isDown ||
            this.gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_LEFT) ||
            this.gamepad.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_X) < -0.1
        ) {
            motion.x = -1
            valid = true
        } else if (
            this.cursorKeys.right.isDown ||
            this.gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_RIGHT) ||
            this.gamepad.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_X) > +0.1
        ) {
            motion.x = +1
            valid = true
        }

        if (
            this.cursorKeys.up.isDown ||
            this.gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_UP) ||
            this.gamepad.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_Y) < -0.1
        ) {
            motion.y = -1
            valid = true
        } else if (
            this.cursorKeys.down.isDown ||
            this.gamepad.isDown(Phaser.Gamepad.PS3XC_DPAD_DOWN) ||
            this.gamepad.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_Y) > +0.1
        ) {
            motion.y = +1
            valid = true
        }

        return valid ? motion : null
    }
}
