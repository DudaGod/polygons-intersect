import { Edge } from "../model/edge";
import { EdgeIntersection } from "../model/edgeIntersection";
import { Point, pointState } from "../model/point";
import { Polygon } from "../model/polygon";

export default function intersection(
    poly1: Polygon,
    poly2: Polygon
): Polygon[] {
    if (poly1.calcPointsInPoly(poly2) === poly1.getPoints().length) {
        // poly1 est dans poly2
        return [poly1];
    }
    if (poly2.calcPointsInPoly(poly1) === poly2.getPoints().length) {
        // poly2 est dans poly1
        return [poly2];
    }

    const intersectPolies: Polygon[] = [];

    poly1.getEdges().forEach(edge => {
        const point = edge.startPoint;

        addPointToPoliesIfInPoly(point, poly2, intersectPolies);

        edge.setEdgeIntersections(poly2.getEdges());

        const intersect = getFirstIntersectElem(edge, point, intersectPolies);

        if (!intersect) {
            return;
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
    });

    return intersectPolies.filter(poly => poly.getPoints().length > 2);
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
        if (intersectPolies.length > 0) {
            intersectPolies.slice(-1)[0].endIntersection();
        }
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
        // mise à jour de l'état du point
        poly.isPointInPoly(point);
    }
    if (
        intersectPolies.length === 0 ||
        intersectPolies.slice(-1)[0].isIntersectionEnd()
    ) {
        // ajout d'un polygone d'intersection
        intersectPolies.push(new Polygon());
    }
    // ajout du point dans le polygone
    intersectPolies.slice(-1)[0].addPoint(point);
}

function findNextIntersectPoint(
    edge: Edge,
    poly1: Polygon,
    poly2: Polygon,
    intersect: EdgeIntersection,
    intersectPolies: Polygon[],
    point: Point
) {
    const poly = poly1.isEdgeExist(intersect.edge) ? poly2 : poly1;
    const ownPoly = poly === poly1 ? poly2 : poly1;

    const point1 = intersect.edge.startPoint;
    const point2 = intersect.edge.endPoint;

    poly.isPointInPoly(point1);
    poly.isPointInPoly(point2);

    const edgePart1 = new Edge(intersect.point, point1);
    const edgePart2 = new Edge(intersect.point, point2);

    let edges = poly.getEdges().slice();
    removeEdgeFromEdges(edges, edge);

    setEdgeIntersections(edgePart1, edges);
    setEdgeIntersections(edgePart2, edges);

    edgePart1.setState(point1.state);
    edgePart2.setState(point2.state);

    let nextStartPoint: Point;
    let nextPart: Edge;
    if (
        (point1.state === pointState.outPoly &&
            edgePart1.getIntersectCount() % 2) ||
        (point1.state === (pointState.inPoly || pointState.onEdge) &&
            !(edgePart1.getIntersectCount() % 2))
    ) {
        nextStartPoint = point1;
        nextPart = edgePart1;
    } else {
        nextStartPoint = point2;
        nextPart = edgePart2;
    }
    if (nextPart.getIntersectCount()) {
        const element = getFirstIntersectElem(
            nextPart,
            intersect.point,
            intersectPolies
        );
        if (element) {
            edge = intersect.edge;
            intersect = element;
            addIntersectPoint(element.point, poly, intersectPolies);
            return findNextIntersectPoint(
                edge,
                poly1,
                poly2,
                intersect,
                intersectPolies,
                point
            );
        }
    }

    edges = ownPoly.getEdges().slice();
    removeEdgeFromEdges(edges, intersect.edge);

    let nextEdge: Edge;
    edges.forEach(edgeItem => {
        if (edgeItem.isPointExist(nextStartPoint)) {
            nextEdge = edgeItem;
        }
    });

    if (!nextEdge.startPoint.isCoordEqual(nextStartPoint)) {
        nextEdge.changePoints();
    }
    ownPoly.setDirection(intersect.edge, nextEdge);

    for (let i = 0; i < ownPoly.getEdges().length; i++) {
        if (i !== 0) {
            nextEdge = ownPoly.getNextEdge();
        }

        point = nextEdge.startPoint;

        addPointToPoliesIfInPoly(point, poly, intersectPolies);
        nextEdge.setEdgeIntersections(poly.getEdges());

        if (!nextEdge.getIntersectCount()) {
            continue;
        }

        intersect = getFirstIntersectElem(nextEdge, point, intersectPolies);
        if (!intersect) {
            return;
        }

        addIntersectPoint(intersect.point, poly, intersectPolies);
        return findNextIntersectPoint(
            nextEdge,
            poly1,
            poly2,
            intersect,
            intersectPolies,
            point
        );
    }
}

function removeEdgeFromEdges(edges: Edge[], edge: Edge) {
    const edgeIndex = edges.indexOf(edge);
    edges.splice(edgeIndex, edgeIndex !== -1 ? 1 : 0);
}

function setEdgeIntersections(edge: Edge, edges: Edge[]) {
    if (edge.getIntersectElements().length) {
        return;
    }
    edges.forEach(intersectEdge => {
        const intersectPoint = edge.findIntersectingPoint(intersectEdge);
        if (intersectPoint) {
            edge.addIntersectElement(intersectEdge, intersectPoint);
        }
    });
}
// ajoute le point si dans le polygone
function addPointToPoliesIfInPoly(
    point: Point,
    poly: Polygon,
    intersectPolies: Polygon[]
) {
    if (
        isNotPointInPolies(point, intersectPolies) &&
        poly.isPointInPoly(point)
    ) {
        addIntersectPoint(point, poly, intersectPolies);
    }
}
