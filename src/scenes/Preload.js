export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.spritesheet('fly', 'assets/fly.png', {
            frameWidth: 19,
            frameHeight: 13
        });

        // Obstacles
        this.load.spritesheet('gas', 'assets/gas.png', {  
            frameWidth: 25,
            frameHeight: 66
        }); 
         
        this.load.image('telaraña', 'public/assets/telarana.png');

        this.load.image('escenario', 'public/assets/escenario.png');     
    
    }    

    create() {
        this.scene.start('Menu');
    }
}