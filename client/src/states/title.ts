// import * as Assets from '../assets';
import * as Colyseus from 'colyseus.js';
import EventProcessor from './event_processor';
 

export default class Title extends Phaser.State {

    private thing: Phaser.Sprite;

    private client: Colyseus.Client;
    private room: Colyseus.Room;
    private cursors: Phaser.CursorKeys;

    private eventProcessor: EventProcessor;

    public preload(): void {
        console.log('preloading title');

        this.game.stage.backgroundColor = '#4585e1';
        this.eventProcessor = new EventProcessor();
    }

    public create(): void {
        console.log('creating title');

        this.thing = this.game.add.sprite(100, 200, 'thing');

        this.client = new Colyseus.Client('ws://' + '127.0.0.1:2657');
        this.room = this.client.join("GameRoom");

        const players = {};

        this.cursors = this.game.input.keyboard.createCursorKeys();

        // // listen to patches coming from the server
        // this.room.listen("players/:id", (change: any) => {
        //     if (change.operation === "add") {
        //         var dom = document.createElement("div");
        //         dom.className = "player";
        //         dom.style.left = change.value.x + "px";
        //         dom.style.top = change.value.y + "px";
        //         dom.style.background = colors[Math.floor(Math.random() * colors.length)];
        //         dom.innerHTML = `Player '${change.path.id}'`;

        //         players[change.path.id] = dom;
        //         document.body.appendChild(dom);
        //     } else if (change.operation === "remove") {
        //         document.body.removeChild(players[change.path.id]);
        //         delete players[change.path.id];
        //     }
        // });

        this.room.listen("players/:id/:axis", (change: any) => {
            console.log(change);

            if (change.path.axis === 'x') {
                this.thing.position.x = change.value;
            } else {
                this.thing.position.y = change.value;
            }
        });
    }

    public update(): void {
        this.eventProcessor.checkCursors(this.cursors, this.room);
    }

}
