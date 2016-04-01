'use strict';

const intersection = require('../');
const expect = require('chai').expect;

let poly1;
let poly2;
let expectedPoly;
let polyRes;

describe('intersection', function () {
    describe('polygons intersect', () => {
        it('should return array with one new polygon', () => {
            poly1 = [{x: 10, y: 100}, {x: 40, y: 100}, {x: 80, y: 60}, {x: 20, y: 20}];
            poly2 = [{x: 30, y: 70}, {x: 90, y: 90}, {x: 110, y: 50}, {x: 70, y: 10}];
            expectedPoly = [{x: 30, y: 70}, {x: 60, y: 80}, {x: 80, y: 60}, {x: 50, y: 40}];
            polyRes = intersection(poly1, poly2);
            expect(polyRes).to.deep.have.members(expectedPoly);
        });
        it('should return array with one new polygon', () => {
            poly1 = [{x: 40, y: 100}, {x: 80, y: 60}, {x: 30, y: 30}, {x: 110, y: 5},
                {x: 30, y: 5}, {x: 20, y: 20}, {x: 10, y: 100}];
            poly2 = [{x: 20, y: 10}, {x: 10, y: 30}, {x: 40, y: 30}, {x: 40, y: 10}];
            expectedPoly = [{x: 30, y: 30}, {x: 18.75, y: 30}, {x: 20, y: 20}, {x: 26.67, y: 10},
                {x: 40, y: 10}, {x: 40, y: 26.88}];
            polyRes = intersection(poly1, poly2);
            expect(polyRes).to.deep.have.members(expectedPoly);
        });

        it('should return array with two new polygons', () => {
            poly1 = [{x: 40, y: 100}, {x: 80, y: 60}, {x: 30, y: 30}, {x: 110, y: 5},
                {x: 30, y: 5}, {x: 20, y: 20}, {x: 10, y: 100}];
            poly2 = [{x: 30, y: 70}, {x: 90, y: 90}, {x: 110, y: 50}, {x: 70, y: 10}];
            expectedPoly = [[{x: 60, y: 80}, {x: 30, y: 70}, {x: 49.05, y: 41.43}, {x: 80, y: 60},
                {x: 63.68, y: 19.47}], [{x: 70, y: 10}, {x: 75.71, y: 15.71},
                {x: 63.69, y: 19.47}]];
            polyRes = intersection(poly1, poly2);
            expect(polyRes).to.deep.have.members(expectedPoly);
        });
    });

    describe('polygons touch each other without intersection', () => {
        it('should return empty array (touch in two tops)', () => {
            poly1 = [{x: 30, y: 10}, {x: 30, y: 20}, {x: 20, y: 15}];
            poly2 = [{x: 30, y: 10}, {x: 30, y: 20}, {x: 40, y: 20}, {x: 40, y: 10}];
            polyRes = intersection(poly1, poly2);
            expect(polyRes).to.be.instanceof(Array);
            expect(polyRes).to.have.lengthOf(0);
        });

        it('should return empty array (touch in two tops and one point on the edge)', () => {
            poly1 = [{x: 10, y: 20}, {x: 30, y: 10}, {x: 30, y: 20}, {x: 30, y: 30}];
            poly2 = [{x: 30, y: 10}, {x: 30, y: 30}, {x: 50, y: 20}];
            polyRes = intersection(poly1, poly2);
            expect(polyRes).to.be.instanceof(Array);
            expect(polyRes).to.have.lengthOf(0);
        });
    });

    describe('all points of one polygon in another', () => {
        it('should return array with one new polygon', () => {
            poly1 = [{x: 10, y: 10}, {x: 10, y: 40}, {x: 40, y: 40}, {x: 40, y: 10}];
            poly2 = [{x: 20, y: 20}, {x: 20, y: 30}, {x: 30, y: 30}, {x: 30, y: 20}];
            polyRes = intersection(poly1, poly2);
            expect(polyRes).to.deep.have.members(poly2);
        });
    });

    describe('polygons don\'t intersect each other', () => {
        it('should return empty array', () => {
            poly1 = [{x: 10, y: 10}, {x: 10, y: 20}, {x: 20, y: 20}, {x: 20, y: 10}];
            poly2 = [{x: 30, y: 10}, {x: 30, y: 20}, {x: 40, y: 20}, {x: 40, y: 10}];
            polyRes = intersection(poly1, poly2);
            expect(polyRes).to.be.instanceof(Array);
            expect(polyRes).to.have.lengthOf(0);
        });
    });
});
