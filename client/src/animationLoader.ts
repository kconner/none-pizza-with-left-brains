

export default class AnimationLoader {

    public static readonly ANIM_RIGHT_WALK = 'walkRight'
    public static readonly ANIM_LEFT_WALK = 'walkLeft'

    public loadSprite(game: Phaser.Game): void {
        game.load.spritesheet('myguy', 'walker.png', 48, 92);
    }

    public loadAnimations(game: Phaser.Game): Phaser.Sprite {
        let sprite: Phaser.Sprite = game.add.sprite(15, 30, 'myguy');
        sprite.animations.add(AnimationLoader.ANIM_LEFT_WALK, [18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true)
        sprite.animations.add(AnimationLoader.ANIM_RIGHT_WALK, [54, 55, 56, 57, 58, 59, 60, 61, 62], 10, true)
        return sprite
    }
}