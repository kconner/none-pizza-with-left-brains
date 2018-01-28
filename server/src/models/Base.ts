export class Base implements MapPositionable {
    public static readonly RADIUS: number = 120

    id: string
    position = {
        x: 0,
        y: 0,
    }

    hp: number = 500
    team: Team = 'Human'

    constructor(team: Team, mapBase: MapBase) {
        this.team = team
        this.id = mapBase.id
        this.position.x = mapBase.position.x
        this.position.y = mapBase.position.y
    }
}
