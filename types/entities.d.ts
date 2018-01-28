type Team = 'Human' | 'Zombie'
type FacingDirection = 'Left' | 'Right'
type Activity = 'Standing'
type DayOrNight = 'Day' | 'Night'
interface Hero {
    x: number
    y: number
    facingDirection: FacingDirection
    activity: Activity
    hp: number
    team: Team
    attackedAt?: Date
}
