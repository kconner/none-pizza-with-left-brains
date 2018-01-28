import * as Colyseus from 'colyseus.js'
import AnimationLoader from '../animationLoader';
import { Animation } from 'phaser-ce';

import AppState from './appState'
import { Actions } from '../models'
import { spawn } from 'child_process';

const levelSong = ''

export default class Level extends AppState {
    private spriteMap: {
        [id: string]: Phaser.Sprite
    }

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

            const gameState = connection.data()

            const hero = gameState.heroes[change.path.id]

            console.log(gameState)
            console.log(change)
            if (!sprite) {
                return
            }

            if (change.path.axis === 'x') {
                sprite.position.x = change.value
                if (hero != null) {
                    if (hero.facingDirection == 'Left') {
                        if (sprite.animations.currentAnim.complete) {
                            sprite.animations.play(AnimationLoader.ANIM_LEFT_WALK)
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
        }

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
