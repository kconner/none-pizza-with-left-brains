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
    }

    create() {
        this.app().setSongAndPlay(levelSong)

        this.app().connect('ws://127.0.0.1:2657')

        const connection = this.app().connection()

        connection.listen('heroes/:id/:axis', (change: any) => {
            console.log(change)

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
                    const sprite = this.game.add.sprite(change.value.x, change.value.y, 'thing')
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
    }
}
