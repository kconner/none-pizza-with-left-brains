import Preloader from './states/preloader'
import Title from './states/title'
import Level from './states/level'

import Connection from './connection'

export default class App extends Phaser.Game {
    private _connection: Connection = null
    private synth: beepbox.Synth

    constructor(config: Phaser.IGameConfig) {
        super(config)

        this.state.add('preloader', Preloader)
        this.state.add('title', Title)
        this.state.add('level', Level)

        this.state.start('preloader')
    }

    public connection() {
        return this._connection
    }

    public connect(serverURL: string) {
        this.disconnect()
        this._connection = new Connection(serverURL)
    }

    public disconnect() {
        if (this._connection) {
            this._connection.destroy()
            this._connection = null
        }
    }

    public setSongAndPlay(song: string) {
        this.pauseSong()
        this.synth = new beepbox.Synth(song)
        this.playSong()
    }

    public playSong() {
        if (this.synth) {
            this.synth.play()
        }
    }

    public pauseSong() {
        if (this.synth) {
            this.synth.pause()
        }
    }
}
