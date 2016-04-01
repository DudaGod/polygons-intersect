'use strict';

const Point = require('./point').Point;
const pointState = require('./point').pointState;

const edgeState = {
    undefined: 0,
    outOut: 1,
    outIn: 2,
    inOut: 3,
    inIn: 4
};

class Edge {
    constructor(point1, point2) {
        this._p1 = point1;
        this._p2 = point2;
        this._state = edgeState.undefined;
        this._intersectElements = [];
        this._intersectCount = 0;
    }
    getStartPoint() {
        return this._p1;
    }
    getEndPoint() {
        return this._p2;
    }
    changePoints() {
        let temp = this._p1;
        this._p1 = this._p2;
        this._p2 = temp;
    }
    isPointExist(point) {
        return (this._p1.x === point.x && this._p1.y === point.y) ||
            (this._p2.x === point.x && this._p2.y === point.y);
    }
    setState(pState) {
        switch (pState) {
            case pointState.outPoly:
                this._state = (this._intersectCount % 2) ? edgeState.outIn : edgeState.outOut;
                break;
            case pointState.inPoly:
            case pointState.onEdge:
                this._state = (this._intersectCount % 2) ? edgeState.inOut : edgeState.inIn;
                break;
        }
    }
    getState() {
        return this._state;
    }
    getIntersectElements() {
        return this._intersectElements;
    }
    addIntersectElement(edge, point) {
        this._intersectCount++;
        this._intersectElements.push({edge: edge, point: point});
    }
    getIntersectCount() {
        return this._intersectCount;
    }
    isIntersectHorizontalRayPoint(point) {
        return point.y >= this._p1.y && point.y < this._p2.y ||
            point.y >= this._p2.y && point.y < this._p1.y;
    }
    getIntersectionRayX(point) {
        return (this._p2.x - this._p1.x) * (point.y - this._p1.y) /
            (this._p2.y - this._p1.y) + this._p1.x;
    }
    findIntersectingPoint(edge) {
        const divider = (edge._p2.y - edge._p1.y) * (this._p2.x - this._p1.x) -
            (edge._p2.x - edge._p1.x) * (this._p2.y - this._p1.y);
        const numerA = (edge._p2.x - edge._p1.x) * (this._p1.y - edge._p1.y) -
            (edge._p2.y - edge._p1.y) * (this._p1.x - edge._p1.x);
        const numerB = (this._p2.x - this._p1.x) * (this._p1.y - edge._p1.y) -
            (this._p2.y - this._p1.y) * (this._p1.x - edge._p1.x);

        if (!divider || (!numerA && !numerB)) {
            return false;
        }

        const uA = numerA / divider;
        const uB = numerB / divider;

        if (uA < 0 || uA > 1 || uB < 0 || uB > 1) {
            return false;
        }
        const x = Math.round((this._p1.x + uA * (this._p2.x - this._p1.x)) * 100) / 100;
        const y = Math.round((this._p1.y + uA * (this._p2.y - this._p1.y)) * 100) / 100;

        return new Point(x, y);
    }
}

exports.Edge = Edge;
exports.edgeState = edgeState;
