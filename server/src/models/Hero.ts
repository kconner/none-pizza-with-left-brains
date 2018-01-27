export class Hero {
    x: number = Math.floor(Math.random() * 400)
    y: number = Math.floor(Math.random() * 400)

    direction: Direction = Direction.Right
    activity: Activity = Activity.Standing
    hp: number = 100
}

enum Direction {
    Left,
    Right,
}

enum Activity {
    Standing,
}
