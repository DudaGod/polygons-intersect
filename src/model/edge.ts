import { EdgeIntersection } from "./edgeIntersection";
import { Point, pointState } from "./point";

export enum edgeState {
    inIn = 4,
    inOut = 3,
    outIn = 2,
    outOut = 1,
    undefined = 0
}

export class Edge {
    private state: edgeState = edgeState.undefined;
    private intersectElements: EdgeIntersection[] = [];
    private intersectCount = 0;

    constructor(public startPoint: Point, public endPoint: Point) {}

    public changePoints() {
        const temp = this.startPoint;
        this.startPoint = this.endPoint;
        this.endPoint = temp;
    }

    public isPointExist(point): boolean {
        return (
            (this.startPoint.x === point.x && this.startPoint.y === point.y) ||
            (this.endPoint.x === point.x && this.endPoint.y === point.y)
        );
    }

    public setState(pState) {
        switch (pState) {
            case pointState.outPoly:
                this.state =
                    this.intersectCount % 2
                        ? edgeState.outIn
                        : edgeState.outOut;
                break;
            case pointState.inPoly:
            case pointState.onEdge:
                this.state =
                    this.intersectCount % 2 ? edgeState.inOut : edgeState.inIn;
                break;
        }
    }

    public getState(): edgeState {
        return this.state;
    }

    public getIntersectElements(): EdgeIntersection[] {
        return this.intersectElements;
    }

    public addIntersectElement(edge: Edge, point: Point) {
        this.intersectCount++;
        this.intersectElements.push(new EdgeIntersection(point, edge));
    }

    public getIntersectCount(): number {
        return this.intersectCount;
    }

    public isIntersectHorizontalRayPoint(point) {
        return (
            (point.y >= this.startPoint.y && point.y < this.endPoint.y) ||
            (point.y >= this.endPoint.y && point.y < this.startPoint.y)
        );
    }
    public isIntersectVerticalRayPoint(point) {
        return (
            (point.x >= this.startPoint.x && point.x < this.endPoint.x) ||
            (point.x >= this.endPoint.x && point.x < this.startPoint.x)
        );
    }

    public getIntersectionRayX(point) {
        return (
            ((this.endPoint.x - this.startPoint.x) *
                (point.y - this.startPoint.y)) /
                (this.endPoint.y - this.startPoint.y) +
            this.startPoint.x
        );
    }
    public getIntersectionRayY(point) {
        return (
            ((this.endPoint.y - this.startPoint.y) *
                (point.x - this.startPoint.x)) /
                (this.endPoint.x - this.startPoint.x) +
            this.startPoint.y
        );
    }

    public findIntersectingPoint(edge: Edge): Point {
        const divider =
            (edge.endPoint.y - edge.startPoint.y) *
                (this.endPoint.x - this.startPoint.x) -
            (edge.endPoint.x - edge.startPoint.x) *
                (this.endPoint.y - this.startPoint.y);
        const numerA =
            (edge.endPoint.x - edge.startPoint.x) *
                (this.startPoint.y - edge.startPoint.y) -
            (edge.endPoint.y - edge.startPoint.y) *
                (this.startPoint.x - edge.startPoint.x);
        const numerB =
            (this.endPoint.x - this.startPoint.x) *
                (this.startPoint.y - edge.startPoint.y) -
            (this.endPoint.y - this.startPoint.y) *
                (this.startPoint.x - edge.startPoint.x);

        if (!divider || (!numerA && !numerB)) {
            return;
        }

        const uA = numerA / divider;
        const uB = numerB / divider;

        if (uA < 0 || uA > 1 || uB < 0 || uB > 1) {
            return;
        }
        const x =
            Math.round(
                (this.startPoint.x +
                    uA * (this.endPoint.x - this.startPoint.x)) *
                    100
            ) / 100;
        const y =
            Math.round(
                (this.startPoint.y +
                    uA * (this.endPoint.y - this.startPoint.y)) *
                    100
            ) / 100;

        return new Point(x, y);
    }

    public setEdgeIntersections(edges: Edge[]) {
        let intersectPoint;
        edges.forEach(intersectEdge => {
            intersectPoint = this.findIntersectingPoint(intersectEdge);
            if (intersectPoint) {
                this.addIntersectElement(intersectEdge, intersectPoint);
            }
        });
    }
}
