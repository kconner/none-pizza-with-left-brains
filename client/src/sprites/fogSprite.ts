import AppSprite from './appSprite'

export default class FogSprite extends AppSprite {
    private foggyPhase: DayOrNight = 'Night'
    private wantedAlpha = 0

    static loadAsset(game: Phaser.Game): void {
        game.load.image('fog', 'fog.png')
    }

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'fog')

        this.width = 1280 * 2
        this.height = 720 * 2

        this.anchor.x = 0.5
        this.anchor.y = 0.5
    }

    update() {
        super.update()

        const factor = 0.03
        this.alpha += factor * (this.wantedAlpha - this.alpha)
    }

    setTeam(team: Team) {
        switch (team) {
            case 'Human':
                this.foggyPhase = 'Night'
                this.tint = 0x000022
                break
            case 'Zombie':
                this.foggyPhase = 'Day'
                this.tint = 0xffffee
                break
        }
    }

    showPhase(phase: DayOrNight) {
        this.wantedAlpha = phase === this.foggyPhase ? 1.0 : 0.0
    }
}
