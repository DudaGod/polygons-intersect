import { Point, pointState } from "../model/point";
import { Polygon } from "../model/polygon";
import intersection from "./intersection";

describe("intersection", () => {
    describe("polygons intersect", () => {
        it("should return array with one new polygon", () => {
            const poly1 = new Polygon([
                new Point(10, 100),
                new Point(40, 100),
                new Point(80, 60),
                new Point(20, 20)
            ]);
            const poly2 = new Polygon([
                new Point(30, 70),
                new Point(90, 90),
                new Point(110, 50),
                new Point(70, 10)
            ]);
            const expectedResult = new Polygon(
                [
                    new Point(60, 80),
                    new Point(30, 70),
                    new Point(50, 40),
                    new Point(80, 60)
                ],
                true
            );
            const result = intersection(poly1, poly2);
            expect(result.length).toBe(1);
            expect(result[0].getPath()).toEqual(expectedResult.getPath());
        });
        it("should return array with one new polygon float", () => {
            const poly1 = new Polygon([
                new Point(40, 100),
                new Point(80, 60),
                new Point(30, 30),
                new Point(110, 5),
                new Point(30, 5),
                new Point(20, 20),
                new Point(10, 100)
            ]);
            const poly2 = new Polygon([
                new Point(20, 10),
                new Point(10, 30),
                new Point(40, 30),
                new Point(40, 10)
            ]);
            const expectedResult = new Polygon([
                new Point(30, 30),
                new Point(18.75, 30),
                new Point(20, 20),
                new Point(26.67, 10),
                new Point(40, 10),
                new Point(40, 26.88)
            ]);
            const result = intersection(poly1, poly2);
            expect(result.length).toBe(1);
            expect(result[0].getPath()).toEqual(expectedResult.getPath());
        });

        it("should return array with two new polygons", () => {
            const poly1 = new Polygon([
                new Point(40, 100),
                new Point(80, 60),
                new Point(30, 30),
                new Point(110, 5),
                new Point(30, 5),
                new Point(20, 20),
                new Point(10, 100)
            ]);
            const poly2 = new Polygon([
                new Point(30, 70),
                new Point(90, 90),
                new Point(110, 50),
                new Point(70, 10)
            ]);
            const expectedResult = [
                new Polygon(
                    [
                        new Point(60, 80),
                        new Point(30, 70),
                        new Point(49.05, 41.43),
                        new Point(80, 60),
                        new Point(63.68, 19.47)
                    ],
                    true
                ),
                new Polygon([
                    new Point(70, 10),
                    new Point(75.71, 15.71),
                    new Point(63.69, 19.47)
                ])
            ];
            const result = intersection(poly1, poly2);
            expect(result.length).toBe(2);
            expect(result[0].getPath()).toEqual(expectedResult[0].getPath());
            expect(result[1].getPath()).toEqual(expectedResult[1].getPath());
        });
    });

    describe("polygons touch each other without intersection", () => {
        it("should return empty array (touch in two tops)", () => {
            const poly1 = new Polygon([
                new Point(30, 10),
                new Point(30, 20),
                new Point(20, 15)
            ]);
            const poly2 = new Polygon([
                new Point(30, 10),
                new Point(30, 20),
                new Point(40, 20),
                new Point(40, 10)
            ]);
            const result = intersection(poly1, poly2);
            expect(result).toEqual([]);
        });

        it("should return empty array (touch in two tops and one point on the edge)", () => {
            const poly1 = new Polygon([
                new Point(10, 20),
                new Point(30, 10),
                new Point(30, 20),
                new Point(30, 30)
            ]);
            const poly2 = new Polygon([
                new Point(30, 10),
                new Point(30, 30),
                new Point(50, 20)
            ]);
            const result = intersection(poly1, poly2);
            expect(result).toEqual([]);
        });
    });

    describe("all points of one polygon in another", () => {
        it("should return array with one new polygon", () => {
            const poly1 = new Polygon([
                new Point(10, 10),
                new Point(10, 40),
                new Point(40, 40),
                new Point(40, 10)
            ]);
            const poly2 = new Polygon([
                new Point(20, 20),
                new Point(20, 30),
                new Point(30, 30),
                new Point(30, 20)
            ]);
            const result = intersection(poly1, poly2);
            expect(result.length).toBe(1);
            expect(result[0].getPath()).toEqual(poly2.getPath());
        });
    });

    describe("polygons don't intersect each other", () => {
        it("should return empty array", () => {
            const poly1 = new Polygon([
                new Point(10, 10),
                new Point(10, 20),
                new Point(20, 20),
                new Point(20, 10)
            ]);
            const poly2 = new Polygon([
                new Point(30, 10),
                new Point(30, 20),
                new Point(40, 20),
                new Point(40, 10)
            ]);
            const result = intersection(poly1, poly2);
            expect(result).toEqual([]);
        });
    });
});
