import { Circle } from "./Circle";

export class Enemy extends Circle {
    velocity: { x: number; y: number; };
    originalColor: string

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, velX: number, velY: number) {
        super(ctx, x, y, radius, color)
        this.velocity = {
            x: velX,
            y: velY
        }
        this.originalColor = color
    }

    update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        super.draw()
    }

    displayDamage(damage: number): void {
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 32px serif";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${damage}`, this.x + 20, this.y + 20)
        super.draw()
    }
}