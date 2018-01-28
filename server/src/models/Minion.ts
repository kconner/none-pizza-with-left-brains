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
<<<<<<< HEAD

    attackedAt?: number = null
=======
>>>>>>> 8d9e33f27e59290308913e501428959e559a1fcf

    constructor(team: Team, x: number, y: number) {
        this.position.x = x
        this.position.y = y

        this.team = team
    }
}
