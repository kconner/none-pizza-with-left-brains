import * as Colyseus from 'colyseus.js';

export default class EventProcessor {

    public checkCursors(
        cursors: Phaser.CursorKeys,
        room: Colyseus.Room
    ): void {

        const motion: any = {};
        let shouldSend = false;

        if (cursors.left.isDown) {
            motion.x = -1;
            shouldSend = true;
        } else if (cursors.right.isDown) {
            motion.x = +1;
            shouldSend = true;
        }

        if (cursors.up.isDown) {
            motion.y = -1;
            shouldSend = true;
        } else if (cursors.down.isDown) {
            motion.y = +1;
            shouldSend = true;
        }

        if (shouldSend) {
            room.send(motion)
        }
    }
}