import AppState from './appState'

const titleSong =
    '5n31sbkbl00e0ft2m1a7g0fj7i0r1w4211f0300d2311c0000h0600v0000o3210b4h4h4h4h4h4h8y8y4i8y8x4hcN4h4jch4kh4h154h4gp21HFE_aosokV6jehAOCv2D6n7w4yVzx2x4qGEzll3uPMq140aouicztjj8Oddcx8QQOcB4cz8O5dcz8QQO4zjj8Og1j4UaC003jg6CCwd8Wqgw'

export default class Title extends AppState {
    preload() {
        this.game.stage.backgroundColor = '#404040'

        this.app().disconnect()
    }

    create() {
        this.app().setSongAndPlay(titleSong)
    }

    update() {
        const controls = this.app().controls()
        if (controls.startButtonIsDown() || controls.attackButtonIsDown() || controls.dodgeButtonIsDown()) {
            this.game.state.start('level')
        }
    }
}
