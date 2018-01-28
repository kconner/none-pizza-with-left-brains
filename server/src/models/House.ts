export class House implements MapPositionable {
    public static readonly RADIUS: number = 120

    id: string
    position = {
        x: 0,
        y: 0,
    }

    hp: number = 500
    team: Team = 'Human'

    constructor(team: Team, mapHouse: MapHouse) {
        this.team = team
        this.id = mapHouse.id
        this.position.x = mapHouse.position.x
        this.position.y = mapHouse.position.y
    }
}
