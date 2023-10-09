export function isTwoCirclesColliding(x1: number, x2: number, y1: number, y2: number, r1: number, r2: number) {
    const dy = y1 - y2
    const dx = x1 - x2
    const sumOfRadii = r1 + r2
    const distance = Math.hypot(dy, dx)

    const isColliding = distance <= sumOfRadii
    return isColliding
}

export function randomNumber(num: number) {
    return Math.round(Math.random() * num)
}

export function getRandomNumberInRange(min: number, max: number) {
    const random = Math.random()

    const range = max - min + 1

    const result = Math.floor(random * range) + min

    return result
}

export function randomColor(type: 'hex' | 'rgb') {
    const red = getRandomNumberInRange(0, 255)
    const green = getRandomNumberInRange(0, 255)
    const blue = getRandomNumberInRange(0, 255)

    if (type === 'rgb') {
        return `rgba(${getRandomNumberInRange(0, 255)},${getRandomNumberInRange(0, 255)},${getRandomNumberInRange(0, 255)})`
    } else {
        return rgbToHex(red, green, blue)
    }
}

export function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace(/^#/, '');

    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
}

const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (value: number): string => {
        let hex = Number(value).toString(16);
        return hex.length < 2 ? "0" + hex : hex;
    };

    return "#" + toHex(r) + toHex(g) + toHex(b);
};