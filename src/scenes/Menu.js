class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');

        // load background
        this.load.atlas('background', './assets/background.png', './assets/background.json',
            Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }

    create() {
        // menu display
        let menuConfig = {
            fontFamily: 'Tandysoft',
            fontSize: '50px',
            backgroundColor: '#FF0013',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }

        // place tile sprite backgrounds
        this.back0 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back0').setScale(1,1).
            setOrigin(0, 0);
        this.back1 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back1').setScale(1,1).
            setOrigin(0, 0).setPosition(0, 25);
        this.back2 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back2').setScale(1,1).
            setOrigin(0, 0).setPosition(0, 60);
        this.back3 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back3').setScale(1,1).
            setOrigin(0, 0).setPosition(0, 85);
        this.back7 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back7').setScale(1,1).
            setOrigin(0, 0);
        this.back8 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back8').setScale(1,1).
            setOrigin(0, 0);
        this.back9 = this.add.tileSprite(0, 0, 640, 480, 'background', 'back9').setScale(1,1).
            setOrigin(0, 0);

        // display menu text
        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let textSpacer = 32;

        this.add.text(centerX, centerY - 64, ' ROCK PATROL ', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '20px';
        this.add.text(centerX, centerY + 35, ' Rock(P1): Use ← & → arrows to move ', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer + 45, ' Scissors(P2): Use (A) & (D) to move & (SPACE) to cut ', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#AEFF51';
        this.add.text(centerX, centerY + 200, ' Press ← for Easy or → for Hard ', menuConfig).setOrigin(0.5);

        // launch next scene
        //this.scene.start("playScene");

        // define keys
        keyRockLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRockRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRockLeft)) {
            // easy mode
            game.settings = {
                planeSpeed: 3,
                gameTimer: 60000    
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRockRight)) {
            // hard mode
            game.settings = {
                planeSpeed: 4,
                gameTimer: 4500    
            }
            //this.sound.play('sfx_select');
            this.scene.start("playScene");    
        }
        this.back1.tilePositionX -= .05;
        this.back2.tilePositionX -= .3;
        this.back3.tilePositionX -= .45;
        this.back7.tilePositionX -= .05;
        this.back8.tilePositionX -= .1;
        this.back9.tilePositionX -= .15;
    }
}