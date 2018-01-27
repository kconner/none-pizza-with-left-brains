
import AppState from './appState'
import Connection from '../connection'
import EventProcessor from './eventProcessor';

const titleSong =
    '5n31s0kbl00e09t6m0a7g0fj7i0r1w1110f0000d1111c0000h0000v0000o3210b018id38h4h4h4h4h4h4h4h4h8Ocz4h4h4i8ycP0h4h4p22Lzj7A2pr1B6u5ce0p63V09kPNINYU5K0JUPMIMVA6jekgVcwL83e01pzwyFxOocwwOj1OaOiGC7f2uPuOoehuiikMYe5dCZAM0zpylN5c22mj9785E11wOGOwkwF1ji6A58cGIE58agkQwEQwF1BlBll0G1jiC9mk2E6Rmllk2E5deQ0'

export default class Title extends AppState {
    private thing: Phaser.Sprite

    private cursors: Phaser.CursorKeys

    private eventProcessor: EventProcessor

    public preload(): void {
        console.log('preloading title')


        this.game.stage.backgroundColor = '#4585e1'
        this.app().disconnect()
    }

    public create(): void {
        console.log('creating title')

        //this.thing = this.game.add.sprite(100, 200, 'thing')
        this.thing = this.game.add.sprite(100, 200, 'myguy');

        this.thing.animations.add('left', [1, 2, 3, 4, 5, 6], 10, true);
        this.thing.animations.add('attack', [20, 21, 22, 23], 10, true);

        this.app().connect('ws://127.0.0.1:2657')

        this.cursors = this.game.input.keyboard.createCursorKeys()

        this.app().setSongAndPlay(titleSong)

        this.eventProcessor = new EventProcessor()

        this.app()
            .connection()
            .listen('heroes/:id/:axis', (change: any) => {
                console.log(change)

                if (change.path.axis === 'x') {
                    this.thing.position.x = change.value
                    this.thing.animations.play("left")
                } else if (change.path.axis === 'y') {
                    this.thing.position.y = change.value
                    this.thing.animations.play("attack")
                } else {
                    this.thing.animations.stop()
                }


            })
    }

    public update(): void {
        this.eventProcessor.checkCursors(this.cursors, this.app().connection())
    }
}
