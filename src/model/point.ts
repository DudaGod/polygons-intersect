export enum pointState {
    undefined = 0,
    outPoly = 1,
    inPoly = 2,
    onEdge = 3
}

export class Point {
    public state: pointState = pointState.undefined;
    constructor(public x, public y) {}

    public calcDistance(point) {
        return Math.sqrt(
            Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
        );
    }

    public getCoords() {
        return { x: this.x, y: this.y };
    }

    public isCoordEqual(point) {
        return this.x === point.x && this.y === point.y;
    }
}
