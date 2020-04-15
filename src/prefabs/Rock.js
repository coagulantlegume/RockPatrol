// Rock prefab
class Rock extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add object to existing scene, displayList, updateList
        this.isFiring = false;    // track rock's firing status
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyLeft.isDown && this.x >= 47) {
                this.x -= 3;
            } else if(keyRight.isDown && this.x <= 578) {
                this.x += 3;
            }
        }
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            //this.sfxRocket.play(); // play sfx
        }
        // if fired, move down
        if(this.isFiring && this.y <= 455) {
            this.y += 3;
        }
        // reset on miss
        if(this.y >= 455) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = 106;
    }
}