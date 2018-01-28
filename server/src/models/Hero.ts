export class Hero {

    public static readonly RADIUS: number = 60
    position: {
        x: number
        y: number
    } = { x: 0, y: 0 }

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
        // TODO: Spawn near your team's base instead
        this.position.x = Math.floor(Math.random() * 400)
        this.position.y = Math.floor(Math.random() * 400)
        this.activity = 'Standing'
        this.hp = 100
        this.facingDirection = this.team === 'Human' ? 'Left' : 'Right'
    }
}
