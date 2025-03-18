export class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        this.add.text(400, 300, 'Press ENTER to Start', { fontSize: '32px', fill: '#000' }).setOrigin(0.5); // Cambiado el color del texto a negro para contraste
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('Game');
        });
    }
}
