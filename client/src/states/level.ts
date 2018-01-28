import * as Colyseus from 'colyseus.js'
import { spawn } from 'child_process'

import AppState from './appState'
import { Actions } from '../models'
import { DirectionalMotion } from '../controls'
import HeroSprite from '../sprites/heroSprite'

const levelSong = ''

const dayHexColor = 'd7dee8'
const nightHexColor = '4a4b4c'

export default class Level extends AppState {
    private heroSprites: {
        [id: string]: HeroSprite
    }

    private lastArrowMotion: DirectionalMotion | null = null

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

        connection.listen('map', (change: Colyseus.DataChange) => {
            if (!change.value) {
                return
            }

            const map = change.value as GameMap
            this.game.world.setBounds(0, 0, map.size.width, map.size.height)
        })

        connection.listen('heroes/:id/attackedAt', (change: Colyseus.DataChange) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showAttacking()
        })

        connection.listen('heroes/:id/position/:axis', (change: Colyseus.DataChange) => {
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

        connection.listen('heroes/:id/facingDirection', (change: Colyseus.DataChange) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showFacingDirection(change.value)
        })

        connection.listen('heroes/:id/activity', (change: Colyseus.DataChange) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showActivity(change.value)
        })

        connection.listen('heroes/:id/hp', (change: Colyseus.DataChange) => {
            const sprite = this.heroSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showHP(change.value)

            if (change.path.id === this.clientHeroSpriteID()) {
                if (change.value <= 0) {
                    // You're dead; big shake.
                    this.game.camera.shake(0.02, 300)
                } else {
                    // You're hit / respawning; little shake.
                    this.game.camera.shake(0.01, 100)
                }
            }
        })

        connection.listen('heroes/:id', (change: Colyseus.DataChange) => {
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
            .directionalMotion()

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
                .attackButtonIsDown()
        ) {
            this.app()
                .connection()
                .send(Actions.attack())
        }

        this.moveCamera()
    }

    private clientHeroSpriteID(): string | null {
        return this.app()
            .connection()
            .id()
    }

    private moveCamera() {
        const heroSpriteID = this.clientHeroSpriteID()
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
