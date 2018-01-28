import AppState from './appState'
import * as Colyseus from 'colyseus.js'

const levelSong = ''

export default class Level extends AppState {
    private spriteMap: {
        [id: string]: Phaser.Sprite
    }

    preload() {
        this.game.stage.backgroundColor = '#202020'

        this.spriteMap = {}

        this.game.world.setBounds(0, 0, 1920 * 3, 1280 * 3)
    }

    create() {
        this.app().setSongAndPlay(levelSong)

        this.app().connect('ws://127.0.0.1:2657')

        const connection = this.app().connection()

        connection.listen('timeOfDay/dayOrNight', (change: any) => {
            console.log(change)
            console.log(change.value)
            switch (change.value) {
                case 'Night':
                    this.game.stage.backgroundColor = '#4a4b4c'
                    break
                case 'Day':
                    this.game.stage.backgroundColor = '#d7dee8'
                    break
            }
        })


        connection.listen('heroes/:id/:attribute', (change: any) => {
            switch (change.path.attribute) {
                case 'facingDirection':
                    console.log('direction changed ', change.value)
                    break
            }
        })

        connection.listen('heroes/:id/:axis', (change: any) => {
            const sprite = this.spriteMap[change.path.id]
            if (!sprite) {
                return
            }

            if (change.path.axis === 'x') {
                sprite.position.x = change.value
            } else {
                sprite.position.y = change.value
            }
        })

        connection.listen('heroes/:id', (change: any) => {
            switch (change.operation) {
                case 'add': {
                    console.log('add hero of team ' + change.value.team + ' facing ' + change.value.facingDirection)
                    const sprite = this.game.add.sprite(change.value.x, change.value.y, 'thing')
                    sprite.anchor.x = 0.5
                    sprite.anchor.y = 0.5
                    this.spriteMap[change.path.id] = sprite
                    break
                }
                case 'remove': {
                    const sprite = this.spriteMap[change.path.id]
                    if (sprite) {
                        sprite.destroy()
                    }
                    break
                }
            }
        })
    }

    update() {
        const arrowMotion = this.app()
            .controls()
            .arrowMotion()

        if (arrowMotion != null) {
            this.app()
                .connection()
                .send(arrowMotion)
        }

        this.moveCamera()
    }

    private moveCamera() {
        const heroSpriteID = this.app()
            .connection()
            .id()
        if (!heroSpriteID) {
            return
        }

        const heroSprite = this.spriteMap[heroSpriteID]
        if (!heroSprite) {
            return
        }

        const wantedCameraX = heroSprite.position.x - this.game.width / 2
        const wantedCameraY = heroSprite.position.y - this.game.height / 2

        const factor = 0.07
        this.game.camera.x += factor * (wantedCameraX - this.game.camera.x)
        this.game.camera.y += factor * (wantedCameraY - this.game.camera.y)
    }
}
