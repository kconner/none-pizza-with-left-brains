import * as Colyseus from 'colyseus.js'
import { spawn } from 'child_process'

import AppState from './appState'
import { Actions } from '../models'
import { ArrowMotion } from '../controls'
import HeroSprite from '../sprites/heroSprite'

const levelSong = ''

const dayHexColor = 'd7dee8'
const nightHexColor = '4a4b4c'

export default class Level extends AppState {
    private heroSprites: {
        [id: string]: HeroSprite
    }

    private lastArrowMotion: ArrowMotion | null = null

    preload() {
        this.game.stage.backgroundColor = '#202020'

        this.heroSprites = {}
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

        connection.listen('heroes/:id/attackedAt', (change: any) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showAttacking()
        })

        connection.listen('heroes/:id/position/:axis', (change: any) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            switch (change.path.axis) {
                case 'x':
                    sprite.showX(change.value)
                    break
                case 'y':
                    sprite.showY(change.value)
                    break
            }
        })

        connection.listen('heroes/:id/facingDirection', (change: any) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showFacingDirection(change.value)
        })

        connection.listen('heroes/:id/activity', (change: any) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showActivity(change.value)
        })

        connection.listen('heroes/:id/hp', (change: any) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showHP(change.value)
        })

        connection.listen('heroes/:id', (change: any) => {
            switch (change.operation) {
                case 'add': {
                    console.log('add hero of team ' + change.value.team + ' facing ' + change.value.facingDirection)

                    const sprite = new HeroSprite(this.game, change.path.id, change.value)
                    this.heroSprites[change.path.id] = sprite
                    this.game.add.existing(sprite)
                    break
                }
                case 'remove': {
                    const sprite = this.heroSprites[change.path.id]
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

        const heroSprite = this.heroSprites[heroSpriteID]
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
