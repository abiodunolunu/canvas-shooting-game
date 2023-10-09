import { hexToRgb } from "../helpers/functions";
import { Circle } from "./Circle";

export class MovingCircle extends Circle {
    ttl = 100
    opacity = 1
    velocity: { x: number; y: number; };
    colorRGB: [number, number, number]


    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, velX: number, velY: number) {
        super(ctx, x, y, radius, color)
        this.velocity = {
            x: velX,
            y: velY
        }

        this.colorRGB = hexToRgb(color)
    }

    update() {
        this.ttl--
        this.x += this.velocity.x
        this.y += this.velocity.y

        this.adjustOpacityAndColorAccordingToTTL()
        super.draw()
    }

    get isAlive() {
        return this.ttl > 4
    }

    adjustOpacityAndColorAccordingToTTL() {
        this.opacity = this.opacity - 1 / this.ttl;
        let [r, g, b] = this.colorRGB
        this.color = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    }
}