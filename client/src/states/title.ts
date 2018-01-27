// import * as Assets from '../assets';
import * as Colyseus from 'colyseus.js';

export default class Title extends Phaser.State {

    private thing: Phaser.Sprite;

    private client: Colyseus.Client;
    private room: Colyseus.Room;
    private cursors: Phaser.CursorKeys;

    public preload(): void {
        console.log('preloading title');

        this.game.stage.backgroundColor = '#4585e1';
    }

    public create(): void {
        console.log('creating title');

        this.thing = this.game.add.sprite(100, 200, 'thing');

        this.client = new Colyseus.Client('ws://' + '127.0.0.1:2657');
        this.room = this.client.join("GameRoom");

        const heroes = {};

        this.cursors = this.game.input.keyboard.createCursorKeys();

        // // listen to patches coming from the server
        // this.room.listen("heroes/:id", (change: any) => {
        //     if (change.operation === "add") {
        //         var dom = document.createElement("div");
        //         dom.className = "player";
        //         dom.style.left = change.value.x + "px";
        //         dom.style.top = change.value.y + "px";
        //         dom.style.background = colors[Math.floor(Math.random() * colors.length)];
        //         dom.innerHTML = `Player '${change.path.id}'`;

        //         heroes[change.path.id] = dom;
        //         document.body.appendChild(dom);
        //     } else if (change.operation === "remove") {
        //         document.body.removeChild(heroes[change.path.id]);
        //         delete heroes[change.path.id];
        //     }
        // });

        this.room.listen("heroes/:id/:axis", (change: any) => {
            console.log(change);

            if (change.path.axis === 'x') {
                this.thing.position.x = change.value;
            } else {
                this.thing.position.y = change.value;
            }
        });
    }

    public update(): void {
        const motion: any = {};
        let shouldSend = false;

        if (this.cursors.left.isDown) {
            motion.x = -1;
            shouldSend = true;
        } else if (this.cursors.right.isDown) {
            motion.x = +1;
            shouldSend = true;
        }

        if (this.cursors.up.isDown) {
            motion.y = -1;
            shouldSend = true;
        } else if (this.cursors.down.isDown) {
            motion.y = +1;
            shouldSend = true;
        }

        if (shouldSend) {
            this.room.send(motion)
        }
    }

}
