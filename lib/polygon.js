'use strict';

const Edge = require('./edge').Edge;
const Point = require('./point').Point;
const pointState = require('./point').pointState;
const direction = {
    backward: 0,
    forward: 1
};

class Polygon {
    constructor(arrPoints) {
        if (!Array.isArray(arrPoints) || !arrPoints.length) {
            arrPoints = [];
        }
        this._points = arrPoints.map(item => new Point(item.x, item.y));
        this._edges = this._points.map((item, i, arr) => {
            return new Edge(item, arr[(i + 1) % arr.length]);
        });
        this._edgesIndex = 0;
        this._direction = direction.forward;
        this._intersectionEnd = false;
    }
    isIntersectionEnd() {
        return this._intersectionEnd;
    }
    endIntersection() {
        this._intersectionEnd = true;
    }
    getEdges() {
        return this._edges;
    }
    getNextEdge() {
        if (this._direction === direction.backward) {
            this._edgesIndex = (--this._edgesIndex < 0) ? this._edges.length - 1 : this._edgesIndex;
        } else {
            this._edgesIndex = ++this._edgesIndex % this._edges.length;
        }
        return this._edges[this._edgesIndex];
    }
    isEdgeExist(edge) {
        return this._edges.indexOf(edge) + 1;
    }
    setDirection(intersectEdge, nextEdge) {
        let ind1 = this._edges.indexOf(intersectEdge);
        let ind2 = this._edges.indexOf(nextEdge);
        this._edgesIndex = ind2;
        this._direction = (ind2 % (this._edges.length - 1) <= ind1) ? direction.backward :
            direction.forward;
    }
    getPoints() {
        return this._points;
    }
    isPointsOnEdgesAndOut() {
        for (let point of this._points) {
            if (point.getState() !== pointState.outPoly &&
                point.getState() !== pointState.onEdge) {
                return false;
            }
        }
        return true;
    }
    getPointsResult() {
        return this._points.map(point => point.valueOf());
    }
    addPoint(point) {
        this._points.push(point);
    }
    isPointExist(point) {
        return this._points.indexOf(point) + 1;
    }
    calcPointsInPoly(poly) {
        let count = 0;
        this._points.forEach(point => {
            if (poly.isPointInPoly(point)) {
                count++;
            }
        });
        return count;
    }
    isPointInPoly(point) {
        let isIn = false;
        let intersectX;
        this._edges.forEach(edge => {
            if (edge.isIntersectHorizontalRayPoint(point)) {
                intersectX = edge.getIntersectionRayX(point);
                if (point.x === intersectX) {
                    point.setState(pointState.onEdge);
                }
                isIn = (point.x <= intersectX) ? !isIn : isIn;
            }
        });
        if (point.getState() === pointState.undefined) {
            point.setState(isIn ? pointState.inPoly : pointState.outPoly);
        }
        return isIn;
    }
}

module.exports = Polygon;
