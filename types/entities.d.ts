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

interface Minion {
    position: {
        x: number
        y: number
    }
    team: Team
}

interface TeamEntity {
    id: string
    position: {
        x: number
        y: number
    }
    hp: number
    team: Team
}

interface House extends TeamEntity {}

interface Base extends TeamEntity {
    spawnedFoodAt?: number
}

interface Food {
    id: string
    position: {
        x: number
        y: number
    }
    team: Team
    spawnedAt: number
}
