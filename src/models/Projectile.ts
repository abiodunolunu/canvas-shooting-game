import { Circle } from "./Circle";

export class Projectile extends Circle {
    velocity: { x: number; y: number; };
    #_hasHitSomething = false

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, velX: number, velY: number) {
        super(ctx, x, y, radius, color)
        this.velocity = {
            x: velX,
            y: velY
        }
    }

    update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        super.draw()
    }

    set hasHitSomething(val: boolean) {
        this.#_hasHitSomething = val
    }

    get hasHitSomething() {
        return this.#_hasHitSomething
    }
}