class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.spritesheet('rock', './assets/rock.png', {frameWidth: 16, frameHeight: 64});
        this.load.spritesheet('plane', './assets/plane.png', {frameWidth: 64, frameHeight: 32});
        this.load.spritesheet('scissor', './assets/scissor.png', {frameWidth: 64, frameHeight: 32});
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64,
        frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setScale(2,2).
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
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9,
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
             first: 0}), frameRate: 30,
        });

        // add rock (p1)
        this.p1Rock = new Rock(this, game.config.width/2, 38,
        'rock').setOrigin(0, 0);
        this.p1Rock.setFrame(this.p1Rock.rockNum * 2);

        // add scissor (p2)
        this.p2Scissor = new Scissor(this, game.config.width/2, 38,
            'scissor').setOrigin(0, 0);

        // add plane (x3)
        this.plane01 = new Plane(this, game.config.width + 192, 196, 
        'plane', 0, 30).setOrigin(0, 0);
        this.plane02 = new Plane(this, game.config.width + 96, 260, 
        'plane', 0, 20).setOrigin(0, 0);
        this.plane03 = new Plane(this, game.config.width, 324, 
        'plane', 0, 10).setOrigin(0, 0);

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
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100,
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2,
                'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64,
                '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.plane01.anims.pause();
            this.plane02.anims.pause();
            this.plane03.anims.pause();
        }, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyScisCut)) {
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRockLeft)) {
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 2;

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
            if(this.checkCollision(this.p1Rock, this.p2Scissor)) {
                this.p1Rock.isFiring = true;
                this.p1Rock.setFrame(this.p1Rock.rockNum * 2 + 1);
            }
        }

        // check collisions
        if(this.checkCollision(this.p1Rock, this.plane01)) {
            this.p1Rock.reset();
            this.shipExplode(this.plane01);
        }
        if(this.checkCollision(this.p1Rock, this.plane02)) {
            this.p1Rock.reset();
            this.shipExplode(this.plane02);
        }
        if(this.checkCollision(this.p1Rock, this.plane03)) {
            this.p1Rock.reset();
            this.shipExplode(this.plane03);
        }
    }

    checkCollision(obj1, obj2) {
        // simple AABB checking
        if(obj1.x < obj2.x + obj2.width && 
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.height + obj1.y > obj2.y) {
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
        this.sound.play('sfx_explosion');
    }
}