class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.spritesheet('rock', './assets/rock.png', {frameWidth: 15, frameHeight: 36,
        startFrame: 0, endFrame: 1});
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64,
        frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').
        setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        //this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // add rock (p1)
        this.p1Rock = new Rock(this, game.config.width/2, 38,
        'rock').setScale(1, 1).setOrigin(0, 0);

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 196, 
        'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 260, 
        'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 324, 
        'spaceship', 0, 10).setOrigin(0, 0);

        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9,
            first: 0}),
            frameRate: 30,
        });

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
        }, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver) {
            // update rock
            this.p1Rock.update();

            // update spaceship
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rock, this.ship01)) {
            this.p1Rock.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rock, this.ship02)) {
            this.p1Rock.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rock, this.ship03)) {
            this.p1Rock.reset();
            this.shipExplode(this.ship03);
        }
    }

    checkCollision(rock, ship) {
        // simple AABB checking
        if(rock.x < ship.x + ship.width && 
           rock.x + rock.width > ship.x &&
           rock.y < ship.y + ship.height &&
           rock.height + rock.y > ship.y) {
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