export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.image('fly', 'public/assets/fly.png');
        this.load.image('obstacle', 'public/assets/obstacle.png');
        this.load.image('background', 'public/assets/background.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}