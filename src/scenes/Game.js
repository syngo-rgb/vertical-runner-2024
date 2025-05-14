import gameOptions from '../utils/gameOptions';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.controlsInverted = false;
        this.isGameOver = false;
        this.inversionTime = 10;

        const savedBestTime = localStorage.getItem('bestTime');
        gameOptions.bestTime = savedBestTime ? parseFloat(savedBestTime) : 0;
    }

    create() {
        this.controlsInverted = false;
        this.isGameOver = false;
        this.backgrounds = [];

        for (let i = 0; i < 2; i++) {
            const bg = this.add.image(gameOptions.width / 2, i * 600, 'background').setOrigin(0.5, 0);
            this.backgrounds.push(bg);
        }

        // Animaciones
        this.anims.create({
            key: "fly-anim",
            frames: this.anims.generateFrameNumbers("fly", { start: 0, end: 1 }),
            frameRate: 19,
            repeat: -1
        });

        this.anims.create({
            key: "gas-anim",
            frames: this.anims.generateFrameNumbers("gas", { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });

        this.cameras.main.setBackgroundColor('#232221');

        this.player = this.physics.add.sprite(400, 550, 'fly').setScale(2);
        this.player.setCollideWorldBounds(true);
        this.player.play("fly-anim", true);

        this.obstacles = this.add.group(); // grupo sin físicas

        this.timerObstacule = this.time.addEvent({
            delay: 1000,
            callback: this.addObstacle,
            callbackScope: this,
            loop: true
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.startTime = new Date();

        this.timerText = this.add.text(10, 10, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fill: '#fff1e8'
        });

        this.inversionText = this.add.text(400, 50, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            fill: '#cb2f2c'
        }).setOrigin(0.5);

        this.dangerTween = this.tweens.add({
            targets: this.inversionText,
            alpha: 0,
            ease: 'Linear',
            duration: 500,
            repeat: 7,
            yoyo: true,
            paused: true
        });

        this.timerControl = this.time.addEvent({
            delay: this.inversionTime * 1000,
            loop: true,
            callbackScope: this,
            callback: () => {
                this.time.delayedCall(6000, () => {
                    if (this.dangerTween) this.dangerTween.stop();
                    this.dangerTween = this.tweens.add({
                        targets: this.inversionText,
                        alpha: 0,
                        ease: 'Linear',
                        duration: 500,
                        repeat: 7,
                        yoyo: true
                    });
                });

                this.controlsInverted = !this.controlsInverted;
                this.inversionText.setText(this.controlsInverted ? '¡DANGER! invert controls' : '');
            }
        });

        this.physics.add.overlap(this.player, this.obstacles, this.gameOver, null, this);
    }

    update() {
        if (this.isGameOver) return;
    
        const elapsedTime = (new Date() - this.startTime) / 1000;
        this.elapsedTime = elapsedTime;
        this.timerText.setText(`Time: ${elapsedTime.toFixed(2)}s`);
    
        const speed = 200;
        const minX = 47;
        const maxX = 549;
    
        // Parallax background
        this.backgrounds.forEach(bg => {
            bg.y += gameOptions.scrollSpeed;
            if (bg.y >= this.game.config.height) {
                const otherBg = this.backgrounds.find(b => b !== bg);
                bg.y = otherBg.y - bg.displayHeight + 1;
            }
        });
    
        // Movimiento y límite horizontal de obstáculos
        this.obstacles.getChildren().forEach(obstacle => {
            obstacle.y += gameOptions.scrollSpeed;
    
            // Limitar posición horizontal del obstáculo
            if (obstacle.x < 275) {
                obstacle.x = 275;
            } else if (obstacle.x > 525) {
                obstacle.x = 525;
            }
    
            if (obstacle.y > 600) {
                obstacle.destroy();
            }
        });
    
        // Controles
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
            this.inversionText.setText('');
        }
    
        // Limitar posición del jugador al área jugable
        if (this.player.x < 275) {
            this.player.x = 275;
        } else if (this.player.x > 525) {
            this.player.x = 525;
        }
    }
    
    addObstacle() {
        const obstacleType = Phaser.Math.Between(1, 2) === 1 ? 'gas' : 'telaraña';

        const minX = 47;
        const maxX = 549;

        const obstacle = this.physics.add.sprite(
            Phaser.Math.Between(minX, maxX),
            -50,
            obstacleType
        ).setScale(2);

        obstacle.scrollSpeed = gameOptions.scrollSpeed;
        obstacle.setImmovable(true);
        obstacle.setCollideWorldBounds(false);

        if (obstacleType === "gas") {
            obstacle.play("gas-anim", true);
            obstacle.body.setSize(obstacle.width * 0.5, obstacle.height * 0.5);
            obstacle.body.setOffset(obstacle.width * 0.25, obstacle.height * 0.25);
        } else if (obstacleType === "telaraña") {
            // Reducir área de colisión para la telaraña
            obstacle.body.setSize(obstacle.width * 0.5, obstacle.height * 0.5);
            obstacle.body.setOffset(obstacle.width * 0.25, obstacle.height * 0.25);
    
        }

        this.obstacles.add(obstacle);
    }

    gameOver() {
        this.physics.pause();
        this.timerControl.destroy();
        this.timerObstacule.destroy();
        this.isGameOver = true;

        const currentTime = this.elapsedTime;
        gameOptions.bestTime = Math.max(gameOptions.bestTime, currentTime);
        localStorage.setItem('bestTime', gameOptions.bestTime);

        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000).setAlpha(0.6).setDepth(10);

        const gameOverText = this.add.text(400, 200, 'GAME OVER', {
            fontFamily: '"Press Start 2P"',
            fontSize: '48px',
            fill: '#cb2f2c'
        }).setOrigin(0.5).setDepth(11).setScale(0);

        this.tweens.add({
            targets: gameOverText,
            scale: 1,
            ease: 'Bounce',
            duration: 800
        });

        const timeText = this.add.text(400, 270, `Time: ${currentTime.toFixed(2)}s`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#f3ef7d'
        }).setOrigin(0.5).setDepth(11).setAlpha(0);

        this.tweens.add({
            targets: timeText,
            alpha: 1,
            duration: 500,
            delay: 600
        });

        const bestTimeText = this.add.text(400, 310, `Best Time: ${gameOptions.bestTime.toFixed(2)}s`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            fill: '#7afec6'
        }).setOrigin(0.5).setDepth(11).setAlpha(0);

        this.tweens.add({
            targets: bestTimeText,
            alpha: 1,
            duration: 500,
            delay: 900
        });

        const restartText = this.add.text(400, 380, 'Press ENTER to Restart', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            fill: '#fff1e8'
        }).setOrigin(0.5).setDepth(11).setAlpha(0);

        this.tweens.add({
            targets: restartText,
            alpha: 1,
            y: '+=10',
            ease: 'Sine.easeInOut',
            duration: 600,
            yoyo: true,
            repeat: -1,
            delay: 1300
        });

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.restart();
        });
    }
}
