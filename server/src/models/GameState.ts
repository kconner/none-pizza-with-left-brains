import { EntityMap, nosync } from 'colyseus'

import { Hero } from './Hero'
import { TimeOfDay } from './TimeOfDay'

export class GameState {
    heroes: EntityMap<Hero> = {}

    timeOfDay: TimeOfDay = new TimeOfDay()
    @nosync something = "This attribute won't be sent to the client-side"

    createHero(id: string) {
        this.heroes[id] = new Hero()
    }

    removeHero(id: string) {
        delete this.heroes[id]
    }

    moveHero(id: string, movement: Movement) {
        var hero = this.heroes[id]

        if (movement.x < 0) {
            hero.facingDirection = 'Left'
        } else if (movement.x > 0) {
            hero.facingDirection = 'Right'
        }
        hero.x += movement.x * 10
        hero.y += movement.y * 10
    }

    advanceFrame() {
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
}
