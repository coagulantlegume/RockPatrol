// Turtle prefab
class Turtle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add object to existing scene, displayList, updateList
        this.points = pointValue;
        this.anims.load('fly');
        this.anims.load('fall');
        this.anims.play('fly');
    }

    update() {
        // move turtle left
        this.x -= game.settings.turtleSpeed;
        // wrap around screen bounds
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
        this.anims.setRepeat(-1);
        this.anims.setYoyo(true);
        this.anims.play('fly');
    }

    fly() {
        this.anims.setRepeat(-1);
        this.anims.setYoyo(true);
        this.anims.play('fly');
    }

    fall() {
        this.anims.setRepeat(1);
        this.anims.setYoyo(false);
        this.anims.play('fall');
    }
}