import * as Colyseus from 'colyseus.js'
import { spawn } from 'child_process'

import AppState from './appState'
import { Actions } from '../models'
import { DirectionalMotion } from '../controls'
import HeroSprite from '../sprites/heroSprite'
import FogSprite from '../sprites/fogSprite'
import MiniMapSprite from '../sprites/miniMapSprite'
import HeroMiniMapSprite from '../sprites/heroMiniMapSprite'
import BaseMiniMapSprite from '../sprites/baseMiniMapSprite'
import HouseMiniMapSprite from '../sprites/houseMiniMapSprite'
import BaseSprite from '../sprites/baseSprite'
import HouseSprite from '../sprites/houseSprite'
import FoodSprite from '../sprites/foodSprite'
import { Sounds } from './preloader'
import MinionSprite from '../sprites/minionSprite'

const daySong =
    '5n31sbk4l00e0ftdm0a7g0fj7i0r1w1011f0000d2112c0000h0000v0443o2330b4x8i4x8i4x8i4x8i4x8i4x8i4x8i4x8i4h4h4h4h4h4p236FFY3jf7OytctayyzoEQ39Au9zOYIDjbWyyzoTcCg2juNOd6NgQRtBp4bc3ntS6jwp3IdsTpmKXIz9LpW88eBV4bb79M510BW9GNx9FxAIzjjimFAqqqhiqC77QxFAHj96jPGWqqqqqitdddddddcD0RQQQQQQAWqqqqqqg1j4UdUr0INaEei6AdgqgR85yaqgH2ro0'
const nightSong =
    '5n31sbk4l00e0ftdm0a7g0fj7i0r1w1011f0000d2112c0000h0000v0443o2330bd3gQd3gQd3gQd3gQd3gQd3gQd3gQd3gQ8y8y8y8y8y8p236FFY3jf7OytctayyzoEQ39Au9zOYIDjbWyyzoTcCg2juNOd6NgQRtBp4bc3ntS6jwp3IdsTpmKXIz9LpW88eBV4bb79M510BW9GNx9FxAIzjjimFAqqqhiqC77QxFAHj96jPGWqqqqqitdddddddcD0RQQQQQQAWqqqqqqg1j4UdUr0INaEei6AdgqgR85yaqgH2ro0'
const outroSong =
    '5n31sbkbl00e03tdm2a7g0fj7i0r1w0111f2000d2111c5000h6060v2440o2140b4h404h4h4h0PcM0h4h4h44hk014h4h4g4h4h4h4h4h0p22YFK7Uiq8bh8QQExjjjiy7ddddddddddddddd8a8okxjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjuNmcceOHVx0PlAgrcP2Jllwpd46baqkgFFFFVCCCCCCCCCCCCCCCA1j3w481cswNc5gcHa1i2I5ocHb1AUy3e3Mw19wPcA5EcHa1i2w58cDa1AVEcQ800'

const dayHexColor = 'd7dee8'
const nightHexColor = '4a4b4c'

export default class Level extends AppState {
    private backgroundSprite: Phaser.Sprite

    private _fogSprite: FogSprite

    private _miniMapSprite: MiniMapSprite

    private heroSprites: {
        [id: string]: HeroSprite
    }

    private heroMiniMapSprites: {
        [id: string]: HeroMiniMapSprite
    }
    private minionSprites: {
        [id: string]: MinionSprite
    }

    private baseSprites: {
        [id: string]: BaseSprite
    }

    private baseMiniMapSprites: {
        [id: string]: BaseMiniMapSprite
    }

    private houseSprites: {
        [id: string]: HouseSprite
    }

    private houseMiniMapSprites: {
        [id: string]: HouseMiniMapSprite
    }
    private foodSprites: {
        [id: string]: FoodSprite
    }

    private soundFx: {
        [id: string]: Phaser.Sound
    }

    private lastArrowMotion: DirectionalMotion | null = null

    preload() {
        this.game.stage.backgroundColor = '#86C351'

        this.heroSprites = {}
        this.baseSprites = {}
        this.houseSprites = {}
        this.heroMiniMapSprites = {}
        this.baseMiniMapSprites = {}
        this.houseMiniMapSprites = {}
        this.foodSprites = {}
        this.minionSprites = {}
    }

    create() {
        this.app().pauseSong()

        const anyWindow = window as any
        const serverHost = anyWindow.queryParameters.serverhost || '127.0.0.1'
        const serverURL = `ws://${serverHost}:2657`
        this.app().connect(serverURL, () => {
            this.game.state.start('title')
        })

        this.backgroundSprite = this.game.add.sprite(0, 0, 'Pizza-Zombie-Game-Background')
        this.backgroundSprite.sendToBack()

        const connection = this.app().connection()

        connection.listen('timeOfDay/dayOrNight', (change: any) => {
            this.fogSprite().showPhase(change.value)

            if (
                !this.app()
                    .connection()
                    .data().winningTeam
            ) {
                switch (change.value) {
                    case 'Day':
                        this.app().setSongAndPlay(daySong)
                        break
                    case 'Night':
                        this.app().setSongAndPlay(nightSong)
                        break
                }
            }

            // TODO: Instead of setting the background color,
            // tint the background sprite
            // switch (change.value) {
            //     case 'Night':
            //         this.game.stage.backgroundColor = nightHexColor
            //         break
            //     case 'Day':
            //         this.game.stage.backgroundColor = dayHexColor
            //         break
            // }
        })

        connection.listen('map', (change: Colyseus.DataChange) => {
            if (!change.value) {
                return
            }

            const map = change.value as GameMap
            this.game.world.setBounds(0, 0, map.size.width, map.size.height)
            this.backgroundSprite.width = map.size.width
            this.backgroundSprite.height = map.size.height
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
            const miniSprite = this.heroMiniMapSprites[change.path.id]
            if (!sprite) {
                return
            }

            switch (change.path.axis) {
                case 'x':
                    sprite.showX(change.value)
                    miniSprite.showX(change.value)
                    break
                case 'y':
                    sprite.showY(change.value)
                    miniSprite.showY(change.value)
                    break
            }
        })

        connection.listen('foods/:id/position/:axis', (change: Colyseus.DataChange) => {
            const sprite = this.foodSprites[change.path.id]
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

        connection.listen('minions/:id/position/:axis', (change: Colyseus.DataChange) => {
            const sprite = this.minionSprites[change.path.id]
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

        connection.listen('minions/:id/facingDirection', (change: Colyseus.DataChange) => {
            const sprite = this.minionSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showFacingDirection(change.value)
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

            if (change.value <= 0) {
                // Death
                this.playSound(Sounds.HERO_DIES)
            } else {
                // Hit
                const heroes = this.app()
                    .connection()
                    .data().heroes
                if (heroes) {
                    const hero = heroes[change.path.id]
                    if (hero) {
                        if (hero.team === 'Human') {
                            this.playSound(Sounds.HUMAN_HERO_GETS_HIT)
                        } else {
                            this.playSound(Sounds.ZOMBIE_HERO_GETS_HIT)
                        }
                    }
                }
            }
        })

        connection.listen('minions/:id/hp', (change: Colyseus.DataChange) => {
            const sprite = this.minionSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showHP(change.value)

            if (change.value <= 0) {
                this.playSound(Sounds.MINION_DIES)
                sprite.destroy()
                delete this.minionSprites[change.path.id]
            } else if (change.value < 50) {
                if (change.value.team == 'Human') {
                    this.playSound(Sounds.HUMAN_MINION_GETS_HIT)
                } else {
                    this.playSound(Sounds.ZOMBIE_MINION_GETS_HIT)
                }
            }
        })

        connection.listen('heroes/:id', (change: Colyseus.DataChange) => {
            switch (change.operation) {
                case 'add': {
                    const sprite = new HeroSprite(this.game, change.path.id, change.value, 100)
                    this.heroSprites[change.path.id] = sprite
                    this.game.add.existing(sprite)

                    const miniSprite = new HeroMiniMapSprite(this.game, change.path.id, change.value, 100)
                    this.heroMiniMapSprites[change.path.id] = miniSprite
                    this.game.add.existing(miniSprite)
                  
                    if (change.path.id === this.clientHeroSpriteID()) {
                        const fogSprite = this.fogSprite()
                        fogSprite.setTeam(change.value.team)
                        fogSprite.showPhase(
                            this.app()
                                .connection()
                                .data().timeOfDay.dayOrNight
                        )
                        const miniMap = this.miniMapSprite()
                    }
                    break
                }
                case 'remove': {
                    const sprite = this.heroSprites[change.path.id]
                    if (sprite) {
                        sprite.destroy()
                        delete this.heroSprites[change.path.id]
                    }
                    break
                }
            }
        })

        connection.listen('minions/:id', (change: Colyseus.DataChange) => {
            switch (change.operation) {
                case 'add': {
                    const sprite = new MinionSprite(this.game, change.path.id, change.value, 50)
                    this.minionSprites[change.path.id] = sprite
                    this.game.add.existing(sprite)

                    if (change.value.team == 'human') {
                        this.playSound(Sounds.HUMAN_MINION_SPAWN)
                    } else {
                        this.playSound(Sounds.ZOMBIE_MINION_SPAWN)
                    }

                    break
                }
                case 'remove': {
                    const sprite = this.minionSprites[change.path.id]
                    if (sprite) {
                        sprite.destroy()
                        delete this.minionSprites[change.path.id]
                    }
                    break
                }
            }
        })

        connection.listen('bases/:id', (change: Colyseus.DataChange) => {
            switch (change.operation) {
                case 'add': {
                    const base: Base = change.value
                    const sprite = new BaseSprite(this.game, base.position.x, base.position.y, base.hp, base.team)
                    this.baseSprites[base.id] = sprite
                    this.game.add.existing(sprite)
                    const miniSprite = new BaseMiniMapSprite(
                        this.game,
                        base.position.x,
                        base.position.y,
                        base.hp,
                        base.team
                    )
                    this.baseMiniMapSprites[base.id] = miniSprite
                    this.game.add.existing(miniSprite)
                    break
                }
                case 'remove': {
                    const base: Base = change.value
                    const sprite = this.baseSprites[base.id]
                    if (sprite) {
                        sprite.destroy()
                        delete this.baseSprites[base.id]
                    }
                    break
                }
            }
        })

        connection.listen('houses/:id', (change: Colyseus.DataChange) => {
            switch (change.operation) {
                case 'add': {
                    const house: House = change.value
                    const sprite = new HouseSprite(this.game, house.position.x, house.position.y, house.hp, house.team)
                    this.houseSprites[house.id] = sprite
                    this.game.add.existing(sprite)
                    const miniSprite = new HouseMiniMapSprite(
                        this.game,
                        house.position.x,
                        house.position.y,
                        house.hp,
                        house.team
                    )
                    this.houseMiniMapSprites[house.id] = miniSprite
                    this.game.add.existing(miniSprite)
                    break
                }
                case 'remove': {
                    const house: House = change.value
                    const sprite = this.houseSprites[house.id]
                    if (sprite) {
                        sprite.destroy()
                        delete this.houseSprites[house.id]
                    }
                    break
                }
            }
        })

        connection.listen('foods/:id', (change: Colyseus.DataChange) => {
            switch (change.operation) {
                case 'add': {
                    console.info(`Listen.foods<${change.path.id}> Added`)
                    const food: Food = change.value
                    const sprite = new FoodSprite(this.game, food)
                    this.foodSprites[food.id] = sprite
                    this.game.add.existing(sprite)
                    break
                }
                case 'remove': {
                    console.info(`Listen.foods<${change.path.id}> Removed`)
                    const sprite = this.foodSprites[change.path.id]
                    if (sprite) {
                        sprite.destroy()
                        delete this.foodSprites[change.path.id]
                    }
                    break
                }
            }
        })

        connection.listen('houses/:id/hp', (change: Colyseus.DataChange) => {
            const sprite = this.houseSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showHP(change.value)
            this.updateItemOnMinimap('house', change)

            if (change.value <= 0) {
                // You're dead; big shake.
                this.game.camera.shake(0.02, 300)
                this.playSound(Sounds.HOUSE_DESTRYOYED)
            } else {
                this.playSound(Sounds.HOUSE_GETS_HIT)
            }
        })

        connection.listen('bases/:id/hp', (change: Colyseus.DataChange) => {
            const sprite = this.baseSprites[change.path.id]
            if (!sprite) {
                return
            }

            sprite.showHP(change.value)

            if (change.value <= 0) {
                this.game.camera.shake(0.02, 300)
                this.playSound(Sounds.BASE_DESTROYED)
            } else {
                this.playSound(Sounds.BASE_GETS_HIT)
            }
        })

        connection.listen('winningTeam', (change: Colyseus.DataChange) => {
            if (change.value) {
                this.app().setSongAndPlay(outroSong)
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

        this.moveCameraAndFog
        this.updateMinimap()
    }

    private updateMinimap() {
        const miniMap = this.miniMapSprite()

        miniMap.bringToTop()

        for (let item in this.baseMiniMapSprites) {
            const baseSprite = this.baseMiniMapSprites[item]
            baseSprite.bringToTop()
        }
        for (let item in this.houseMiniMapSprites) {
            const houseSprite = this.houseMiniMapSprites[item]
            houseSprite.bringToTop()
        }

        for (let item in this.heroMiniMapSprites) {
            const heroSprite = this.heroMiniMapSprites[item]
            heroSprite.bringToTop()
        }
    }

    private updateItemOnMinimap(type: string, change: Colyseus.DataChange) {
        const miniMap = this.miniMapSprite()

        switch (type) {
            case 'house':
                break

            case 'hero_move':
                break

            default:
                break
        }

        //player =
        this.updateMinimap()
    }

    private miniMapSprite(): MiniMapSprite {
        /// generate the minimap sprite
        if (!this._miniMapSprite) {
            this._miniMapSprite = new MiniMapSprite(this.game, 0, 0)
            this.game.add.existing(this._miniMapSprite)
        }

        return this._miniMapSprite
        this.orderSprites()
    }

    private fogSprite(): FogSprite {
        if (!this._fogSprite) {
            this._fogSprite = new FogSprite(this.game, 0, 0)
            this.game.add.existing(this._fogSprite)
        }

        return this._fogSprite
    }

    private clientHeroSpriteID(): string | null {
        return this.app()
            .connection()
            .id()
    }

    private moveCameraAndFog() {
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

        const fogSprite = this.fogSprite()
        fogSprite.x = heroSprite.x
        fogSprite.y = heroSprite.y
    }

    private orderSprites() {
        for (const foodID of Object.keys(this.foodSprites)) {
            const sprite = this.foodSprites[foodID]
            sprite.bringToTop()
        }

        this.fogSprite().bringToTop()
    }

    private playSound(sound: Sounds) {
        const sfx = this.game.add.audio(sound)
        sfx.volume = 5
        sfx.play()
    }
}
