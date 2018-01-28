import Preloader from './states/preloader'
import Title from './states/title'
import Level from './states/level'

import Controls from './controls'
import Connection from './connection'
import AnimationLoader from './animationLoader';

export default class App extends Phaser.Game {
    private _controls: Controls = null
    private _connection: Connection = null
    private synth: beepbox.Synth

    constructor(config: Phaser.IGameConfig) {
        super(config)

        this.state.add('preloader', Preloader)
        this.state.add('title', Title)
        this.state.add('level', Level)

        this.state.start('preloader')
    }

    controls() {
        if (!this._controls) {
            this._controls = new Controls(this.input)
        }

        return this._controls
    }

    connection() {
        return this._connection
    }

    connect(serverURL: string) {
        this.disconnect()
        this._connection = new Connection(serverURL)
    }

    disconnect() {
        if (this._connection) {
            this._connection.destroy()
            this._connection = null
        }
    }

    setSongAndPlay(song: string) {
        this.pauseSong()
        this.synth = new beepbox.Synth(song)
        this.playSong()
    }

    playSong() {
        if (this.synth) {
            this.synth.play()
        }
    }

    pauseSong() {
        if (this.synth) {
            this.synth.pause()
        }
    }
}
