import { Edge } from "../model/edge";
import { Point, pointState } from "../model/point";
import { Polygon } from "../model/polygon";

export default function intersection(
    poly1: Polygon,
    poly2: Polygon
): Polygon[] {
    if (poly1.calcPointsInPoly(poly2) === poly1.getPoints().length) {
        return [poly1];
    }
    if (poly2.calcPointsInPoly(poly1) === poly2.getPoints().length) {
        return [poly2];
    }

    const intersectPolies = new Array<Polygon>();

    for (const edge of poly1.getEdges()) {
        const point = edge.startPoint;
        if (
            poly2.isPointInPoly(point) &&
            isNotPointInPolies(point, intersectPolies)
        ) {
            addIntersectPoint(point, poly2, intersectPolies);
        }

        edge.setEdgeIntersections(poly2.getEdges());

        if (edge.getIntersectCount() === 0) {
            continue;
        }

        const intersect = getFirstIntersectElem(edge, point, intersectPolies);
        if (!intersect) {
            continue;
        }

        addIntersectPoint(intersect.point, poly2, intersectPolies);

        findNextIntersectPoint(
            edge,
            poly1,
            poly2,
            intersect,
            intersectPolies,
            point
        );
    }

    return intersectPolies;
}

function isNotPointInPolies(point: Point, intersectPolies: Polygon[]) {
    return intersectPolies
        .map(poly => poly.isPointExist(point))
        .every(result => !result);
}

function getFirstIntersectElem(
    edge: Edge,
    point: Point,
    intersectPolies: Polygon[]
) {
    const intersections = edge
        .getIntersectElements()
        .filter(intersect =>
            isNotPointInPolies(intersect.point, intersectPolies)
        );

    if (intersections.length === 0) {
        intersectPolies.slice(-1)[0].endIntersection();
        return;
    }

    edge.setState(point.state);

    if (intersections.length > 1) {
        intersections.forEach(intersect => {
            intersect.distance = intersect.point.calcDistance(point);
            return intersect;
        });
        intersections.sort(
            (intersectA, intersectB) =>
                intersectA.distance - intersectB.distance
        );
    }
    return intersections[0];
}

function addIntersectPoint(
    point: Point,
    poly: Polygon,
    intersectPolies: Polygon[]
) {
    if (point.state === pointState.undefined) {
        poly.isPointInPoly(point); // this line sets point state
    }
    const intersectPoly = intersectPolies.slice(-1)[0];
    if (intersectPoly.isIntersectionEnd()) {
        intersectPolies.push(new Polygon());
    }
    intersectPoly.addPoint(point);
}
