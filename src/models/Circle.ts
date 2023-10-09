export class Circle {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    radius: number
    color: string

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        this.ctx.fillStyle = this.color
        this.ctx.fill()
        this.ctx.closePath()
    }

    get canvas() {
        return this.ctx.canvas
    }

    get isNotInView() {
        const isOffYView = this.y + this.radius < 0 || this.y + this.radius > this.canvas.height
        const isOffXView = this.x + this.radius < 0 || this.x + this.radius > this.canvas.width
        return isOffXView || isOffYView
    }
}