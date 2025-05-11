// main.js
//import Phaser from 'phaser';
import gameOptions from './utils/gameOptions.js';
import { PreloadScene } from './scenes/Preload.js';
import { MenuScene } from './scenes/Menu.js';
import { GameScene } from './scenes/Game.js';

const config = {
    type: Phaser.AUTO,
    width: gameOptions.width,
    height: gameOptions.height,
    backgroundColor: '#232221',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    pixelArt: true,
    scene: [PreloadScene, MenuScene, GameScene],
    parent: 'game-container'
};

new Phaser.Game(config);
