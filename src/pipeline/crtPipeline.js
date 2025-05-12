export default class CRTPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader: `
            precision mediump float;
            uniform sampler2D uMainSampler;
            varying vec2 outTexCoord;
            uniform float time;

            void main() {
                vec2 uv = outTexCoord;

                // Curvatura
                uv = uv * 2.0 - 1.0;
                uv *= vec2(1.1, 1.1);
                uv.x *= 1.0 + pow((abs(uv.y) / 4.0), 2.0);
                uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
                uv = uv * 0.5 + 0.5;

                // RGB split
                float r = texture2D(uMainSampler, uv + vec2(0.002, 0.0)).r;
                float g = texture2D(uMainSampler, uv).g;
                float b = texture2D(uMainSampler, uv - vec2(0.002, 0.0)).b;

                vec3 color = vec3(r, g, b);

                // Barrido horizontal animado
                float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.04;

                // Ruido sutil
                float noise = (fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453));
                color += noise * 0.03;

                gl_FragColor = vec4(color + scanline, 1.0);
            }
            `
        });
    }

    onPreRender() {
        this.set1f('time', this.game.loop.time / 1000);
    }
}
