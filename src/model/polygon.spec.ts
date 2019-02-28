import { Point } from "./point";
import { Polygon } from "./polygon";

const poly = new Polygon([
    new Point(0, 0),
    new Point(0, 2),
    new Point(2, 2),
    new Point(2, 0)
]);

describe("Polygon", () => {
    describe("isPointInPoly", () => {
        it("should return true when point is in poly", () => {
            expect(poly.isPointInPoly(new Point(1, 1))).toBeTruthy();
        });
        it("should return false when point is not in poly", () => {
            expect(poly.isPointInPoly(new Point(1, 3))).toBeFalsy();
        });
        it("should return true when point is on edge of poly", () => {
            expect(poly.isPointInPoly(new Point(2, 1))).toBeTruthy(); // not good !!!
            //expect(poly.isPointInPoly(new Point(1, 2))).toBeTruthy();
        });
    });
});
