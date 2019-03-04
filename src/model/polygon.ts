import { Edge } from "./edge";
import { Point, pointState } from "./point";

enum direction {
    backward = 0,
    forward = 1
}

export class Polygon {
    private edges: Edge[];
    private edgesIndex = 0;
    private direction = direction.forward;

    constructor(private points: Point[] = [], private intersectionEnd = false) {
        this.edges = this.points.map((item, i, arr) => {
            return new Edge(item, arr[(i + 1) % arr.length]);
        });
    }

    public isIntersectionEnd(): boolean {
        return this.intersectionEnd;
    }

    public endIntersection() {
        this.intersectionEnd = true;
    }

    public getEdges(): Edge[] {
        return this.edges;
    }

    public getNextEdge(): Edge {
        if (this.direction === direction.backward) {
            this.edgesIndex =
                --this.edgesIndex < 0 ? this.edges.length - 1 : this.edgesIndex;
        } else {
            this.edgesIndex = ++this.edgesIndex % this.edges.length;
        }
        return this.edges[this.edgesIndex];
    }

    public isEdgeExist(edge: Edge): boolean {
        return this.edges.indexOf(edge) > -1;
    }

    public setDirection(intersectEdge: Edge, nextEdge: Edge) {
        const ind1 = this.edges.indexOf(intersectEdge);
        const ind2 = this.edges.indexOf(nextEdge);
        this.edgesIndex = ind2;
        this.direction =
            ind2 % (this.edges.length - 1) <= ind1
                ? direction.backward
                : direction.forward;
    }

    public getPoints(): Point[] {
        return this.points;
    }
    public getPath(): object[] {
        return this.points.map(point => point.getCoords());
    }

    public isPointsOnEdgesAndOut(): boolean {
        for (const point of this.points) {
            if (
                point.state !== pointState.outPoly &&
                point.state !== pointState.onEdge
            ) {
                return false;
            }
        }
        return true;
    }

    public addPoint(point: Point): void {
        this.points.push(point);
    }

    public isPointExist(point: Point): boolean {
        return (
            this.points.filter(pointItem => point.isCoordEqual(pointItem))
                .length > 0
        );
    }

    public calcPointsInPoly(poly: Polygon): number {
        let count = 0;
        this.points.forEach(point => {
            if (poly.isPointInPoly(point)) {
                count++;
            }
        });
        return count;
    }

    public isPointInPoly(point: Point): boolean {
        let isIn = false;
        let intersectX;
        this.edges.forEach(edge => {
            if (edge.isIntersectHorizontalRayPoint(point)) {
                intersectX = edge.getIntersectionRayX(point);
                if (point.x === intersectX) {
                    point.state = pointState.onEdge;
                }
                isIn = point.x <= intersectX ? !isIn : isIn;
            }
        });
        if (point.state === pointState.undefined) {
            point.state = isIn ? pointState.inPoly : pointState.outPoly;
        }
        return isIn;
    }
}
