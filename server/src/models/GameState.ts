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
    tickTock() {
        this.timeOfDay.realTime = Date.now() / 1000;
        this.timeOfDay.hour -= (this.timeOfDay.realTime - this.timeOfDay.lastTimeUpdated);

        /*console.log("realTime " + this.timeOfDay.realTime);
        console.log("lastTimeUpdated " + this.timeOfDay.lastTimeUpdated);

        console.log("realTime - lastTimeUpdated")


        console.log("Current hour " + this.timeOfDay.hour);
        console.log();*/

        if (this.timeOfDay.hour <= 0) {
            this.timeOfDay.hour = this.timeOfDay.lengthOfDay;
            this.timeOfDay.dayOrNight = 'Night';
            // send message to client that it is nighttime 
        } else if (this.timeOfDay.hour < 30) {
            this.timeOfDay.dayOrNight = 'Day';
            // daytime
            // send message to client that it is daytime 
        } else {
            // no changes needed (yet)
            // this will contain gradual change to lighting 
        }
        this.timeOfDay.lastTimeUpdated = this.timeOfDay.realTime;
    };
}
