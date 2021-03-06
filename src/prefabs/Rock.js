// Rock prefab
class Rock extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add object to existing scene, displayList, updateList
        this.isFiring = false;    // track rock's firing status
        this.isExploding = false; // track if currently running exploding animation
        //this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        this.rockNum = Math.floor(Math.random() * 3);
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyRockLeft.isDown && this.x >= 10) {
                this.x -= 3;
            } else if(keyRockRight.isDown && this.x <= 610) {
                this.x += 3;
            }
        }
        // if fired, move down
        if(this.isFiring && this.y <= 455 && !this.isExploding) {
            this.y += 4;
        }
        // reset on miss
        if(this.y >= 455) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = 0;
        this.rockNum = Math.floor(Math.random() * 3);
        this.setFrame(this.rockNum * 2);
    }
}