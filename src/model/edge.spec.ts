import { Edge } from "./edge";
import { Point } from "./point";

describe("Edge", () => {
    describe("findIntersectingPoint", () => {
        it("should find intersecting point", () => {
            const edge1 = new Edge(new Point(1, 0), new Point(-1, 0));
            const edge2 = new Edge(new Point(0, 1), new Point(0, -1));
            expect(edge1.findIntersectingPoint(edge2)).toEqual(new Point(0, 0));
        });
        it("should find intersecting point", () => {
            const edge1 = new Edge(new Point(3, 2), new Point(1, 4));
            const edge2 = new Edge(new Point(0, 13), new Point(2, 1));
            expect(edge1.findIntersectingPoint(edge2)).toEqual(
                new Point(1.6, 3.4)
            );
        });
    });
});
