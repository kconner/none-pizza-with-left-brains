// import * as Assets from '../assets';
import * as Colyseus from 'colyseus.js';

export default class Title extends Phaser.State {

    private thing: Phaser.Sprite;

    private synth: beepbox.Synth;

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
        //         dom.className = "hero";
        //         dom.style.left = change.value.x + "px";
        //         dom.style.top = change.value.y + "px";
        //         dom.style.background = colors[Math.floor(Math.random() * colors.length)];
        //         dom.innerHTML = `Hero '${change.path.id}'`;

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

        this.synth = new beepbox.Synth("5sbk4l00e0ftaa7g0fj7i0r1w1100f0000d1110c0000h0000v2200o3320b4z8Ql6hkpUsiczhkp5hDxN8Od5hAl6u74z8Ql6hkpUsp24ZFzzQ1E39kxIceEtoV8s66138l1S0L1u2139l1H39McyaeOgKA0TxAU213jj0NM4x8i0o0c86ywz7keUtVxQk1E3hi6OEcB8Atl0q0Qmm6eCexg6wd50oczkhO8VcsEeAc26gG3E1q2U406hG3i6jw94ksf8i5Uo0dZY26kHHzxp2gAgM0o4d516ej7uegceGwd0q84czm6yj8Xa0Q1EIIctcvq0Q1EE3ihE8W1OgV8s46Icxk7o24110w0OdgqMOk392OEWhS1ANQQ4toUctBpzRxx1M0WNSk1I3ANMEXwS3I79xSzJ7q6QtEXgw0");
        this.synth.play();
        //... this.synth.pause();
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
