export class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('white', 'assets/white-pixel.png');
        this.load.spritesheet('fly', 'assets/fly.png', {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        this.cameras.main.setBackgroundColor('#232221');

        // 🎞️ Crear animación 'fly_anim' antes de usarla
        if (!this.anims.exists('fly_anim')) {
            this.anims.create({
                key: 'fly_anim',
                frames: this.anims.generateFrameNumbers('fly', { start: 0, end: 1 }),
                frameRate: 25,
                repeat: -1
            });
        }

        // 🪰 Crear una sola mosca
        const fly = this.add.sprite(400, 300, 'fly').setScale(2);
        fly.play('fly_anim');

        // Movimiento vertical en zig-zag y rebote
        this.tweens.add({
            targets: fly,
            y: {
                from: 100, // Desde la parte superior de la pantalla
                to: 500,   // Hasta la parte inferior
                ease: 'Sine.easeInOut',
                duration: 1500,
                yoyo: true,  // Rebote (vuelve al inicio)
                repeat: -1   // Repetir indefinidamente
            },
            x: {
                from: 400,
                to: 450, // Movimiento leve horizontal
                ease: 'Sine.easeInOut',
                duration: 800,
                yoyo: true,
                repeat: -1
            },
            delay: 0
        });

        // Rotación leve para dar vida
        this.tweens.add({
            targets: fly,
            angle: { from: -5, to: 5 },
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // 🟥 Fondo del título con marco
        const titleBg = this.add.rectangle(400, 200, 420, 100, 0x000000, 0.6)
            .setOrigin(0.5)
            .setStrokeStyle(4, 0xcb2f2c)
            .setDepth(1);

        // 🕹️ Texto del título
        const title = this.add.text(400, 200, 'THE FLY', {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            fill: '#cb2f2c'
        }).setOrigin(0.5).setDepth(2).setScale(0);

        this.tweens.add({
            targets: [title, titleBg],
            scale: 1,
            ease: 'Back.easeOut',
            duration: 1000
        });

        // 📣 Texto para comenzar
        const startText = this.add.text(400, 350, 'Press ENTER to Start', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            fill: '#e2e9e9'
        }).setOrigin(0.5).setDepth(2).setAlpha(0);

        this.tweens.add({
            targets: startText,
            alpha: 1,
            y: '+=10',
            ease: 'Sine.easeInOut',
            duration: 800,
            yoyo: true,
            repeat: -1,
            delay: 1000
        });

        // ENTER para iniciar
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('Game');
        });
    }
}
