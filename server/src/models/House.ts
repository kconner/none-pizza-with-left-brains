export class House {

    public static readonly RADIUS: number = 120

    position: {
        x: number
        y: number
    } = { x: 0, y: 0 }

    hp: number = 500
    team: Team = 'Human'

    constructor(team: Team) {
        this.team = team
    }
}