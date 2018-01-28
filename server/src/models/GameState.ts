import { EntityMap, nosync } from 'colyseus'

import { Constants } from '../config'
import { World } from './World'
import { Hero } from './Hero'
import { TimeOfDay } from './TimeOfDay'

export class GameState {
    world = new World()
    heroes: EntityMap<Hero> = {}

    timeOfDay: TimeOfDay = new TimeOfDay()
    @nosync something = "This attribute won't be sent to the client-side"

    createHero(id: string) {
        const team = Object.keys(this.heroes).length % 2 === 0 ? 'Human' : 'Zombie'
        this.heroes[id] = new Hero(team)
    }

    removeHero(id: string) {
        delete this.heroes[id]
    }

    moveHero(id: string, movement: Movement) {
        var hero = this.heroes[id]

        if (hero.activity === 'Dead') {
            return
        }

        if (movement.x < 0) {
            hero.facingDirection = 'Left'
        } else if (movement.x > 0) {
            hero.facingDirection = 'Right'
        }

        const dx: number = movement.x
        const dy: number = movement.y
        const length = Math.sqrt(dx * dx + dy * dy)
        if (length === 0) {
            hero.activity = 'Standing'
            return
        }

        const normalizedDx = dx / length
        const normalizedDy = dy / length
        hero.position.x = Math.max(0, Math.min(this.world.width, hero.position.x + normalizedDx * 12))
        hero.position.y = Math.max(0, Math.min(this.world.height, hero.position.y + normalizedDy * 12))
        hero.activity = 'Walking'
    }

    attackWithHero(id: string) {
        const now = Date.now()
        var hero = this.heroes[id]

        if (hero.activity === 'Dead') {
            return
        }

        // Determine if we are attacking or cannot right now
        if (!hero.attackedAt) {
            hero.attackedAt = now
        } else if (now - hero.attackedAt >= Constants.Timeouts.heroAttack) {
            hero.attackedAt = now
        } else {
            return
        }

        // Hurt nearby heroes
        const doubleHeroRadius = 60 * 2
        const doubleHeroRadiusSquared = doubleHeroRadius * doubleHeroRadius
        for (const heroID of Object.keys(this.heroes)) {
            if (heroID === id) {
                continue
            }

            const opponent = this.heroes[heroID]
            if (opponent.activity === 'Dead') {
                continue
            }

            if (opponent.team === hero.team) {
                continue
            }

            const dx = opponent.position.x - hero.position.x
            const dy = opponent.position.y - hero.position.y
            const distanceSquared = dx * dx + dy * dy
            if (doubleHeroRadiusSquared < distanceSquared) {
                continue
            }

            opponent.hp = Math.max(0, opponent.hp - 25)

            if (opponent.hp === 0) {
                opponent.activity = 'Dead'
                opponent.diedAt = now
            }
        }
    }

    advanceFrame() {
        this.advanceTimeOfDay()
        this.advanceRespawnTimers()
    }

    private advanceTimeOfDay() {
        this.timeOfDay.currentFrameTimestamp = Date.now() / 1000
        const frameDuration = this.timeOfDay.currentFrameTimestamp - this.timeOfDay.previousFrameTimestamp
        this.timeOfDay.dayCountdownInSeconds -= frameDuration

        if (this.timeOfDay.dayCountdownInSeconds <= 0) {
            // Dusk! Start counting down to next dusk.
            this.timeOfDay.dayCountdownInSeconds = TimeOfDay.lengthOfDayInSeconds
            this.timeOfDay.dayOrNight = 'Night'
            // send message to client that it is nighttime
        } else if (this.timeOfDay.dayCountdownInSeconds < TimeOfDay.lengthOfDayInSeconds / 2) {
            // Dawn!
            this.timeOfDay.dayOrNight = 'Day'
            // send message to client that it is daytime
        } else {
            // no changes needed (yet)
            // this will contain gradual change to lighting
        }

        this.timeOfDay.previousFrameTimestamp = this.timeOfDay.currentFrameTimestamp
    }

    private advanceRespawnTimers() {
        for (const heroID of Object.keys(this.heroes)) {
            const hero = this.heroes[heroID]
            if (hero.activity !== 'Dead') {
                continue
            }

            // Don't respawn until they have been dead for three seconds
            if (Date.now() < hero.diedAt + 3000) {
                continue
            }

            console.log('respawning')
            hero.respawn()
        }
    }
}
