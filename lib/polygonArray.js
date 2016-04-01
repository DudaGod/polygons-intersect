'use strict';

class PolygonArray {
    constructor() {
        this._polygons = [];
    }
    add(poly) {
        this._polygons.push(poly);
    }
    getLast() {
        return this._polygons[this.getLength() - 1];
    }
    getLength() {
        return this._polygons.length;
    }
    getPoints() {
        let points = this._polygons.map(poly => poly.getPoints());
        return [].concat(...points);
    }
    getResult() {
        this._polygons = this._polygons.filter(poly => {
            return poly.getPoints().length && !poly.isPointsOnEdgesAndOut();
        });
        if (!this._polygons.length) {
            return this._polygons;
        }
        let points = this._polygons.map(poly => poly.getPointsResult());
        return (points.length > 1 && this.getLast().getPoints().length) ? points :
            [].concat(...points);
    }
}

module.exports = PolygonArray;
