// import * as Assets from '../assets';

export default class Title extends Phaser.State {
    private thing: Phaser.Sprite;

    public preload(): void {
        console.log('preloading title');

        this.game.stage.backgroundColor = '#4585e1';
    }

    public create(): void {
        console.log('creating title');

        this.thing = this.game.add.sprite(100, 200, 'thing');
    }
}
