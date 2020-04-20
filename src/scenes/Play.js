class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
        this.currClouds = [];
        this.cloudWidth = 0;
    }

    preload() {
        // load images/tile sprite
        this.load.spritesheet('rock', './assets/rock.png', {frameWidth: 16, frameHeight: 64});
        this.load.spritesheet('plane', './assets/plane.png', {frameWidth: 64, frameHeight: 32});
        this.load.spritesheet('scissor', './assets/scissor.png', {frameWidth: 64, frameHeight: 32});
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64,
            frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.atlas('clouds', './assets/clouds.png', './assets/clouds.json',
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }

    create() {
        // place tile sprite backgrounds
        this.back0 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back0').setScale(1,1).
            setOrigin(0, 0);
        this.back1 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back1').setScale(1,1).
            setOrigin(0, 0);
        this.back2 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back2').setScale(1,1).
            setOrigin(0, 0);
        this.back3 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back3').setScale(1,1).
            setOrigin(0, 0);
        this.back4 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back4').setScale(1,1).
            setOrigin(0, 0);
        this.back5 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back5').setScale(1,1).
            setOrigin(0, 0);
        this.back6 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back6').setScale(1,1).
            setOrigin(0, 0);
        this.back7 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back7').setScale(1,1).
            setOrigin(0, 0);
        this.back8 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back8').setScale(1,1).
            setOrigin(0, 0);
        this.back9 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back9').setScale(1,1).
            setOrigin(0, 0);

        // white rectangle borders
        //this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        //this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 6,
                first: 0}), frameRate: 30,
        });

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('plane', { start: 0, end: 8,
                first: 0}), frameRate: 8,
        });

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('plane', { start: 2, end: 6,
                first: 2}), frameRate: 15,
        });

        this.anims.create({
            key: 'cut',
            frames: this.anims.generateFrameNumbers('scissor', { start: 0, end: 4,
                first: 0}), frameRate: 35,
        });

        // add rock (p1)
        this.p1Rock = new Rock(this, game.config.width/2, 0,
            'rock').setOrigin(0,0).setScale(1.2);
        this.p1Rock.setFrame(this.p1Rock.rockNum * 2);

        // add scissor (p2)
        this.p2Scissor = new Scissor(this, game.config.width/2, 5,
            'scissor').setOrigin(0,0).setScale(1.2);

        // add plane (x3)
        this.plane01 = new Plane(this, game.config.width + 192, 260, 
            'plane', 0, 10).setOrigin(0, 0);
        this.plane02 = new Plane(this, game.config.width + 96, 324, 
            'plane', 0, 20).setOrigin(0, 0);
        this.plane03 = new Plane(this, game.config.width, 388, 
            'plane', 0, 30).setOrigin(0, 0);

        // start plane animation (x3)
        this.plane01.fly();
        this.plane02.fly();
        this.plane03.fly();

        // define keyboard keys
        keyScisCut = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyScisLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyScisRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyRockLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRockRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // score
        this.p1Score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Tandysoft',
            fontSize: '28px',
            backgroundColor: '#AEFF51',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100,
        }
        this.scoreLeft = this.add.text(510, 410, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2 + 64,
                ' (SPACE) to Restart or ← for Menu ', scoreConfig).setOrigin(0.5);
            scoreConfig.backgroundColor = '#FF0013';
            scoreConfig.fontSize = '50px';
            this.add.text(game.config.width / 2, game.config.height / 2,
                ' GAME OVER ', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.plane01.anims.pause();
            this.plane02.anims.pause();
            this.plane03.anims.pause();
        }, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyScisCut)) {
            this.sound.play('sfx_thunk');
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRockLeft)) {
            this.sound.play('sfx_thunk');
            this.scene.start("menuScene");
        }

        // scroll backgrounds
        this.back1.tilePositionX -= .25;
        this.back2.tilePositionX -= .5;
        this.back3.tilePositionX -= .75;
        this.back4.tilePositionX -= 1;
        this.back5.tilePositionX -= 1.1;
        this.back6.tilePositionX -= 2.5;
        this.back7.tilePositionX -= .1;
        this.back8.tilePositionX -= .15;
        this.back9.tilePositionX -= .2;

        // add clouds
        while(this.cloudWidth < game.config.width) {
            let newCloud = this.add.sprite(game.config.width - this.cloudWidth, Math.floor(Math.random() * 125 + 100),
            'clouds', Math.floor(Math.random() * 6 + 1)).setOrigin(1,0); // new random cloud
            this.currClouds.push(newCloud); // add to array of current clouds
            this.cloudWidth += newCloud.width * game.settings.cloudGap; // recalculate end of cloud
        }

        // scroll clouds
        for(let element of this.currClouds) {
            element.x += 1;
        }
        this.cloudWidth -= 1;

        // remove clouds
        for(let element of this.currClouds) {
            if(element.x > game.config.width + element.width) {
                element.destroy();
                this.currClouds.shift();
            }
        }


        if(!this.gameOver) {
            // update rock
            this.p1Rock.update();

            // update scissor
            this.p2Scissor.update();

            // update plane
            this.plane01.update();
            this.plane02.update();
            this.plane03.update();
        }

        // check if scissors cutting
        if(this.p2Scissor.anims.currentFrame.index == 4) {
            if((this.p1Rock.x - this.p2Scissor.x) >= this.p2Scissor.width / 2 - 8 &&
            (this.p1Rock.x - this.p2Scissor.x) <= this.p2Scissor.width) {
                this.p1Rock.isFiring = true;
                this.p1Rock.setFrame(this.p1Rock.rockNum * 2 + 1);
            }
        }

        // check collisions
        if(this.checkCollisionPlane(this.p1Rock, this.plane01)) {
            this.p1Rock.reset();
            this.shipExplode(this.plane01);
        }
        if(this.checkCollisionPlane(this.p1Rock, this.plane02)) {
            this.p1Rock.reset();
            this.shipExplode(this.plane02);
        }
        if(this.checkCollisionPlane(this.p1Rock, this.plane03)) {
            this.p1Rock.reset();
            this.shipExplode(this.plane03);
        }
    }

    checkCollisionPlane(rock, plane) {
        // simple AABB checking
        if(rock.x < plane.x + plane.width &&
            rock.x + rock.width > plane.x &&
            rock.y + rock.height / 2 < plane.y + plane.height &&
            rock.y + rock.height > plane.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0                        // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => {  // callback after animation completes
            ship.reset();                     // reset ship position
            ship.alpha = 1;                   // make ship visible again
            boom.destroy();                   // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_tear');
    }
}