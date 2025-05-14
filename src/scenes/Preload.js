export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.image('background', 'public/assets/escenario.png');
        this.load.spritesheet('fly', 'assets/fly.png', {
            frameWidth: 19,
            frameHeight: 20
        });

        // Obstacles
        this.load.spritesheet('gas', 'assets/gas.png', {  
            frameWidth: 25,
            frameHeight: 66
        }); 
         
        this.load.image('telaraña', 'public/assets/telarana.png');

        this.load.image('escenario', 'public/assets/escenario.png');     
        //this.game.renderer.pipelines.add('crt', new CRTPipeline(this.game));
        this.load.audio('alarm', 'public/assets/audio/alarm.wav');
        this.load.audio('backgroundMusic', 'public/assets/audio/age out 120.wav');
    }    

    create() {
        this.scene.start('Menu');
                this.background = this.add.image(gameOptions.width / 2, 0, 'background').setOrigin(0.5, 0);
    }
}