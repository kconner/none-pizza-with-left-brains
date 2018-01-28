import AppState from './appState'

const titleSong =
    '5n31s0kbl00e09t6m0a7g0fj7i0r1w1110f0000d1111c0000h0000v0000o3210b018id38h4h4h4h4h4h4h4h4h8Ocz4h4h4i8ycP0h4h4p22Lzj7A2pr1B6u5ce0p63V09kPNINYU5K0JUPMIMVA6jekgVcwL83e01pzwyFxOocwwOj1OaOiGC7f2uPuOoehuiikMYe5dCZAM0zpylN5c22mj9785E11wOGOwkwF1ji6A58cGIE58agkQwEQwF1BlBll0G1jiC9mk2E6Rmllk2E5deQ0'

export default class Title extends AppState {
    preload() {
        this.game.stage.backgroundColor = '#404040'

        this.app().disconnect()
    }

    create() {
        this.app().setSongAndPlay(titleSong)
    }

    update() {
        if (
            this.app()
                .controls()
                .enterIsDown()
        ) {
            this.game.state.start('level')
        }
    }
}
