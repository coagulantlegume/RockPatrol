let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    turtleSpeed: 3,
    gameTimer: 60000
}

// reserve some keyboard variables
let keyScisCut, keyScisLeft, keyScisRight, keyRockLeft, keyRockRight;