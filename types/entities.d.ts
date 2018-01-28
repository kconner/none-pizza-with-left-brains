type Team = 'Human' | 'Zombie'
type FacingDirection = 'Left' | 'Right'
type Activity = 'Standing'

interface Hero {
    x: number
    y: number
    facingDirection: FacingDirection
    activity: Activity
    hp: number
    team: Team
}
