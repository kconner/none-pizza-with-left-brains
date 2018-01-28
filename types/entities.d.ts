type Team = 'Human' | 'Zombie'
type FacingDirection = 'Left' | 'Right'
type Activity = 'Standing' | 'Walking' | 'Dead'
type DayOrNight = 'Day' | 'Night'
interface TimeOfDay {
    lengthOfDayInSeconds: number
    dayCountdownInSeconds: number
    currentFrameTimestamp: number
    previousFrameTimestamp: number
    dayOrNight: DayOrNight
}
interface World {
    width: number
    height: number
}
interface Hero {
    position: {
        x: number
        y: number
    }
    facingDirection: FacingDirection
    activity: Activity
    hp: number
    team: Team
    attackedAt?: Date
    diedAt?: Date
}

interface House {
    id: string
    position: {
        x: number
        y: number
    }
    hp: number
    team: Team
}
