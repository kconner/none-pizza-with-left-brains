export class Hero implements MapPositionable {
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
    spawnPoint: MapSpawnPoint

    constructor(team: Team, spawnPoint: MapSpawnPoint) {
        this.team = team
        this.spawnPoint = spawnPoint
        this.position.x = spawnPoint.position.x
        this.position.y = spawnPoint.position.y
        this.respawn()
    }

    respawn() {
        this.position.x = this.spawnPoint.position.x
        this.position.y = this.spawnPoint.position.y
        this.activity = 'Standing'
        this.hp = 100
        this.facingDirection = this.team === 'Human' ? 'Left' : 'Right'
    }
}
