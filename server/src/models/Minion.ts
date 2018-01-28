import { v4 as uuid } from 'uuid'

export class Minion {

    public static readonly RADIUS: number = 40

    facingDirection: FacingDirection = 'Right'
    position = {
        x: 0,
        y: 0,
    }
    team: Team
    id: number = uuid()
    hp: number = 50

    constructor(team: Team, x: number, y: number) {
        this.position.x = x
        this.position.y = y

        this.team = team
    }
}
