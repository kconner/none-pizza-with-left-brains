export class Hero {
    x: number = 0
    y: number = 0

    facingDirection: FacingDirection = 'Right'
    activity: Activity = 'Standing'
    hp: number = 100
    team: Team = 'Human'
    attackedAt?: number = null
    diedAt?: number = null

    constructor(team: Team) {
        this.team = team
        this.respawn()
    }

    respawn() {
        this.x = Math.floor(Math.random() * 400)
        this.y = Math.floor(Math.random() * 400)
        this.activity = 'Standing'
        this.hp = 100
        this.facingDirection = this.team === 'Human' ? 'Left' : 'Right'
    }
}
