// Scissor prefab
class Scissor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add object to existing scene, displayList, updateList
        this.isCutting = false;    // track scissor's cutting status
        this.anims.load('cut');
        this.sfxCut = scene.sound.add('sfx_cut'); // add cut sfx
    }

    update() {
        // left/right movement
        if(!this.isCutting) {
            if(keyScisLeft.isDown && this.x >= 0) {
                this.x -= 3;
            } else if(keyScisRight.isDown && this.x <= 565) {
                this.x += 3;
            }
        }
        // cut button
        if(Phaser.Input.Keyboard.JustDown(keyScisCut) && !this.isCutting) {
            this.isCutting = true;
            this.cut();
        }
    }

    reset() {
        this.isCutting = false;
        this.setFrame(0);
    }

    cut() {
        // play animation
        this.anims.setRepeat(0);
        this.anims.setYoyo(true);
        this.anims.play('cut');
        this.sfxCut.play();

        this.on('animationcomplete', () => { 
            this.isCutting = false;
        });
    }
}