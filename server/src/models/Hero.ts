export class Hero {
    x: number = Math.floor(Math.random() * 400)
    y: number = Math.floor(Math.random() * 400)

    facingDirection: FacingDirection = 'Right'
    activity: Activity = 'Standing'
    hp: number = 100
    team: Team = 'Human'
    attackedAt?: number = null
}
