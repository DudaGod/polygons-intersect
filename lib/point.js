'use strict';

const pointState = {
    undefined: 0,
    outPoly: 1,
    inPoly: 2,
    onEdge: 3
};

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.distance = 0;
        this._state = pointState.undefined;
    }
    toString() {
        return 'Point';
    }
    setState(value) {
        this._state = value;
    }
    getState() {
        return this._state;
    }
    calcDistance(point) {
        this.distance = Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
        this.distance = Math.round(this.distance * 100) / 100;
    }
    valueOf() {
        return {x: this.x, y: this.y};
    }
    isCoordEqual(point) {
        return this.x === point.x && this.y === point.y;
    }
    compare(value) {
        if (Array.isArray(value) && value.length) {
            for (var point of value) {
                if (this.isCoordEqual(point)) {
                    return false;
                }
            }
        } else if (value.toString() === 'Point') {
            if (this.isCoordEqual(value)) {
                return false;
            }
        }
        return true;
    }
}

exports.Point = Point;
exports.pointState = pointState;
