import { Point } from "./point";

describe("Point", () => {
    describe("getCoords", () => {
        it("should return new object with coords", () => {
            const point = new Point(1, 2);
            const expectedResult = { x: 1, y: 2 };
            expect(point.getCoords()).toEqual(expectedResult);
        });
    });
    describe("isCoordEqual", () => {
        it("should return true when coords are same", () => {
            const point1 = new Point(1, 2);
            const point2 = new Point(1, 2);
            expect(point1.isCoordEqual(point2)).toBeTruthy();
        });
        it("should return false when coords are not equal", () => {
            const point1 = new Point(1, 2);
            const point2 = new Point(1, 3);
            expect(point1.isCoordEqual(point2)).toBeFalsy();
        });
    });
    describe("calcDistance", () => {
        it("should return 1 when 2 points are at 1 of distance", () => {
            const point1 = new Point(1, 2);
            const point2 = new Point(1, 3);
            expect(point1.calcDistance(point2)).toBe(1);
        });
        it("should return V2 when 2 points are at 1,1 of distance", () => {
            const point1 = new Point(1, 1);
            const point2 = new Point(0, 0);
            expect(point1.calcDistance(point2)).toBe(Math.SQRT2);
        });
    });
});
