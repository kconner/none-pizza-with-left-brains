import * as Colyseus from 'colyseus.js'
import AnimationLoader from '../animationLoader'
import { Animation } from 'phaser-ce'

import AppState from './appState'
import { Actions } from '../models'
import { ArrowMotion } from '../controls'
import { spawn } from 'child_process'

const levelSong = ''
const dayHexColor = 'd7dee8'
const nightHexColor = '4a4b4c'

export default class Level extends AppState {
    private spriteMap: {
        [id: string]: Phaser.Sprite
    }

    private lastArrowMotion: ArrowMotion | null = null

    private animationLoader: AnimationLoader

    preload() {
        this.game.stage.backgroundColor = '#202020'

        this.spriteMap = {}

        this.animationLoader = new AnimationLoader()
        this.animationLoader.loadSprite(this.app())

        this.game.world.setBounds(0, 0, 1920 * 3, 1280 * 3)
    }

    create() {
        this.app().setSongAndPlay(levelSong)

        this.app().connect('ws://127.0.0.1:2657')

        const connection = this.app().connection()

        connection.listen('timeOfDay/dayOrNight', (change: any) => {
            switch (change.value) {
                case 'Night':
                    this.game.stage.backgroundColor = nightHexColor
                    break
                case 'Day':
                    this.game.stage.backgroundColor = dayHexColor
                    break
            }
        })

        connection.listen('world', (change: any) => {
            if (!change.value) {
                return
            }

            this.game.world.setBounds(0, 0, change.value.width, change.value.height)
        })

        connection.listen('heroes/:id/:attribute', (change: any) => {
            switch (change.path.attribute) {
                case 'facingDirection':
                    console.log('direction changed ', change.value)
                    break
            }
        })

        connection.listen('heroes/:id/attackedAt', (change: any) => {
            console.log(`Hero<${change.path.id}>.attackedAt`, change.value)
        })

        connection.listen('heroes/:id/:axis', (change: any) => {
            const sprite = this.spriteMap[change.path.id]

            if (!sprite) {
                return
            }

            const gameState = connection.data()
            if (!gameState || !gameState.heroes) {
                return
            }
            const hero = gameState.heroes[change.path.id]

            if (change.path.axis === 'x') {
                sprite.position.x = change.value
                if (hero != null) {
                    if (hero.facingDirection == 'Left') {
                        if (sprite.animations.currentAnim.complete) {
                            sprite.animations.play(AnimationLoader.ANIM_LEFT_WALK)
                            //sprite.animations.currentAnim.onUpdate
                        }
                    } else {
                        if (sprite.animations.currentAnim.complete) {
                            sprite.animations.play(AnimationLoader.ANIM_RIGHT_WALK)
                        }
                    }
                }
            } else {
                sprite.animations.stop()
                sprite.animations.frame = 18
                sprite.position.y = change.value
            }
        })

        connection.listen('heroes/:id/activity', (change: any) => {
            const sprite = this.spriteMap[change.path.id]
            if (!sprite) {
                return
            }

            console.log(change.value)
            switch (change.value) {
                case 'Standing':
                    // TODO: play stand animation
                    break
                case 'Walking':
                    // TODO: play walk animation
                    break
                case 'Dead':
                    // TODO: play die animation
                    break
            }
        })

        connection.listen('heroes/:id/hp', (change: any) => {
            const sprite = this.spriteMap[change.path.id]
            if (!sprite) {
                return
            }

            console.log(change.value)
            // TODO: Update life bar
        })

        connection.listen('heroes/:id', (change: any) => {
            switch (change.operation) {
                case 'add': {
                    console.log('add hero of team ' + change.value.team + ' facing ' + change.value.facingDirection)
                    const sprite = this.animationLoader.loadAnimations(this.app())
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
            const movement = Actions.movement(arrowMotion.x, arrowMotion.y)
            this.app()
                .connection()
                .send(movement)
        } else if (this.lastArrowMotion) {
            this.app()
                .connection()
                .send(Actions.movement(0, 0))
        }
        this.lastArrowMotion = arrowMotion

        if (
            this.app()
                .controls()
                .spacebarIsDown()
        ) {
            this.app()
                .connection()
                .send(Actions.attack())
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
