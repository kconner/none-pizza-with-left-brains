import { v4 as uuid } from 'uuid'

export class Minion {
    position = {
        x: 0,
        y: 0,
    }
    team: Team
    id: number = uuid()

    constructor(team: Team, x: number, y: number) {
        this.position.x = x
        this.position.y = y

        this.team = team
    }
}
