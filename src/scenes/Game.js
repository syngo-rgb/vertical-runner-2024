import gameOptions from '../utils/gameOptions';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.controlsInverted = false;
        this.isGameOver = false
        this.inversionTime = 10; // tiempo en segundos para invertir controles
        const savedBestTime = localStorage.getItem('bestTime');
        gameOptions.bestTime = savedBestTime ? parseFloat(savedBestTime) : 0;
    }


    create() {
        this.controlsInverted = false;
        this.isGameOver = false
        // create animations
        this.anims.create({
            key: "fly-anim",
            frames: this.anims.generateFrameNumbers("fly", {
            start: 0,
            end: 1
            }),
            frameRate: 19,
            repeat: -1
        });

        this.anims.create({
            key: "gas-anim",
            frames: this.anims.generateFrameNumbers("gas", {
            start: 0,
            end: 6
            }),
            frameRate: 12,
            repeat: -1
        });

    
        this.cameras.main.setBackgroundColor('#232221');
        this.player = this.physics.add.sprite(400, 550, 'fly').setScale(2); 
        this.player.setCollideWorldBounds(true);
        this.player.play("fly-anim", true)
        
        this.obstacles = this.physics.add.group({
            defaultKey: "obstacleSprite",
            velocityY: 200, // Establece velocidad inicial para nuevos elementos
            collideWorldBounds: false,
            immovable: true
        });

        this.timerObstacule = this.time.addEvent({
            delay: 1000,
            callback: this.addObstacle,
            callbackScope: this,
            loop: true
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.startTime = new Date();

        // Mostrar tiempo
        this.timerText = this.add.text(10, 10, '', { fontSize: '16px', fill: '#fff1e8' });

        // Texto de aviso de inversión de controles
        this.inversionText = this.add.text(400, 50, '', {
            fontSize: '36px',
            fill: '#cb2f2c'
        }).setOrigin(0.5);

        this.dangerTween = this.tweens.add({
            targets: this.inversionText,
            alpha: 0,
            ease: 'Linear',
            duration: 500, // Tiempo en milisegundos
            repeat: 7, // 7 ciclos de parpadeo (~4 segundos)
            yoyo: true, // Alterna entre visible e invisible
            paused: true // No inicia hasta que lo activemos
        });        

        // Invertir controles tras cierto tiempo
        this.timerControl = this.time.addEvent({ 
            delay: this.inversionTime * 1000,
            loop: true,
            callbackScope: this,
            callback: () => {
                // Activar el parpadeo 4 segundos antes de cambiar controles
                this.time.delayedCall(6000, () => {
                    if (this.dangerTween) { // Verifica que el tween exista antes de usarlo
                        this.dangerTween.restart();  
                    }
                });
        
                // Cambiar el estado de los controles
                this.controlsInverted = !this.controlsInverted;
        
                // Mostrar texto cuando los controles cambien
                this.inversionText.setText(this.controlsInverted ? '¡DANGER! invert controls' : '');
            }
        });

        this.physics.add.overlap(this.player, this.obstacles, this.gameOver, null, this);
    }

    update() {
        if (this.isGameOver) { return }
        const elapsedTime = (new Date() - this.startTime) / 1000;
        this.elapsedTime = elapsedTime;
        this.timerText.setText(`Time: ${elapsedTime.toFixed(2)}s`);

        const speed = 200;

        // Configurar la velocidad de caída para cada obstáculo
        this.obstacles.children.iterate((obstacle) => {
            if (obstacle) { // Verifica que el objeto exista antes de modificarlo
                if (obstacle.y > 600) {
                    obstacle.destroy();
                }
            }
        });

        // DEBUG opcional
        // console.log('Controles invertidos:', this.controlsInverted);

        if (this.controlsInverted) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(speed);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(-speed);
            } else {
                this.player.setVelocityX(0);
            }
            this.inversionText.setText('¡DANGER!');
        } else {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
            } else {
                this.player.setVelocityX(0);
            }
            this.inversionText.setText("");
        }
    }

    addObstacle() {
        const random = Phaser.Math.Between(1, 2);
        let obstacleType = (random === 1) ? "gas" : "telaraña";
    
        // Crear obstáculo con física
        const obstacle = this.physics.add.sprite(Phaser.Math.Between(50, 750), -50, obstacleType).setScale(2);
        
        // Agregarlo manualmente al grupo de obstáculos
        this.obstacles.add(obstacle);
    
        // Establecer movimiento
        obstacle.setVelocityY(200);
        obstacle.setCollideWorldBounds(false);
        obstacle.setImmovable(true);
        if (random === 1) {
            obstacle.play("gas-anim", true) // : obstacle.play("telaraña-anim", true);
        } 
    }

    gameOver() {
        this.physics.pause();
        this.timerControl.destroy();
        this.timerObstacule.destroy();
        this.isGameOver = true
        const currentTime = this.elapsedTime;
        gameOptions.bestTime = Math.max(gameOptions.bestTime, currentTime);
        localStorage.setItem('bestTime', gameOptions.bestTime);
        this.add.text(400, 300, 
            `Game Over\nTime: ${currentTime.toFixed(2)}s\nBest Time: ${gameOptions.bestTime.toFixed(2)}s\nPress ENTER to Restart`, 
            { fontSize: '32px', fill: '#fff1e8', align: 'center' }).setOrigin(0.5);

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.restart();
        });
    }
}
