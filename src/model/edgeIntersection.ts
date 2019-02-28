import { Edge } from "./edge";
import { Point } from "./point";

export class EdgeIntersection {
    constructor(
        public point: Point,
        public edge: Edge,
        public distance: number = 0
    ) {}
}
