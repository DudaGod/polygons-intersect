import { Edge } from "../lib/edge";
import { pointState } from "./model/point";
import { Polygon } from "./model/polygon";

export default "./services/intersection";

function addIntersectPoint(point, poly, intersectPolies) {
    if (point.getState() === pointState.undefined) {
        poly.isPointInPoly(point);
    }
    const intersectPoly = intersectPolies.getLast();
    if (intersectPoly.isIntersectionEnd()) {
        intersectPolies.add(new Polygon());
    }
    intersectPoly.addPoint(point);
}

function findPointInPoly(point, poly, intersectPolies) {
    if (
        point.compare(intersectPolies.getPoints()) &&
        poly.isPointInPoly(point)
    ) {
        addIntersectPoint(point, poly, intersectPolies);
    }
}

function getFirstIntersectElem(edge, point, intersectPolies) {
    let intersections = edge.getIntersectElements();
    intersections = intersections.filter(intersect =>
        intersect.point.compare(intersectPolies.getPoints())
    );
    if (!intersections.length) {
        intersectPolies.getLast().endIntersection();
        return false;
    }

    edge.setState(point.getState());

    if (intersections.length > 1) {
        intersections.forEach(intersect => intersect.point.calcDistance(point));
        intersections.sort((a, b) => a.point.distance - b.point.distance);
    }
    return intersections[0];
}

function findNextIntersectPoint(
    edge,
    poly1,
    poly2,
    elem,
    intersectPolies,
    point
) {
    const poly = poly1.isEdgeExist(elem.edge) ? poly2 : poly1;
    const ownPoly = poly === poly1 ? poly2 : poly1;

    const point1 = elem.edge.getStartPoint();
    const point2 = elem.edge.getEndPoint();
    poly.isPointInPoly(point1);
    poly.isPointInPoly(point2);

    const edgePart1 = new Edge(elem.point, point1);
    const edgePart2 = new Edge(elem.point, point2);

    let edges = [].slice.call(poly.getEdges());
    reduceEdges(edges, edge);

    findEdgeIntersection(edgePart1, edges);
    findEdgeIntersection(edgePart2, edges);

    edgePart1.setState(point1.getState());
    edgePart2.setState(point2.getState());

    let nextStartPoint;
    let nextPart;
    if (
        (point1.getState() === pointState.outPoly &&
            edgePart1.getIntersectCount() % 2) ||
        (point1.getState() === (pointState.inPoly || pointState.onEdge) &&
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
            elem.point,
            intersectPolies
        );
        if (element) {
            edge = elem.edge;
            elem = element;
            addIntersectPoint(element.point, poly, intersectPolies);
            return findNextIntersectPoint(
                edge,
                poly1,
                poly2,
                elem,
                intersectPolies,
                point
            );
        }
    }

    edges = [].slice.call(ownPoly.getEdges());
    reduceEdges(edges, elem.edge);

    let nextEdge = edges.findFirst(edgeItem =>
        edgeItem.isPointExist(nextStartPoint)
    );

    if (!nextEdge.getStartPoint().isCoordEqual(nextStartPoint)) {
        nextEdge.changePoints();
    }
    ownPoly.setDirection(elem.edge, nextEdge);

    for (let i = 0; i < ownPoly.getEdges().length; i++) {
        if (i !== 0) {
            nextEdge = ownPoly.getNextEdge();
        }

        point = nextEdge.getStartPoint();
        findPointInPoly(point, poly, intersectPolies);
        findEdgeIntersection(nextEdge, poly.getEdges());

        if (!nextEdge.getIntersectCount()) {
            continue;
        }

        elem = getFirstIntersectElem(nextEdge, point, intersectPolies);
        if (!elem) {
            return;
        }

        addIntersectPoint(elem.point, poly, intersectPolies);
        return findNextIntersectPoint(
            nextEdge,
            poly1,
            poly2,
            elem,
            intersectPolies,
            point
        );
    }
}

function testInputValues(poly1, poly2) {
    if (!Array.isArray(poly1) || !Array.isArray(poly2)) {
        throw new TypeError("Both of input values must be an array");
    } else if (poly1.length < 3 || poly2.length < 3) {
        throw new RangeError(
            "Lengths of input values must be greater than two"
        );
    }
}

function isOnePolyInOther(poly1, poly2) {
    let countPointsIn;
    for (const poly of [poly1, poly2]) {
        const secondPoly = poly === poly1 ? poly2 : poly1;
        countPointsIn = poly.calcPointsInPoly(secondPoly);
        if (countPointsIn === poly.getPoints().length) {
            return poly.getPointsResult();
        } else if (countPointsIn) {
            break;
        }
    }
    return false;
}

function findEdgeIntersection(edge, edges) {
    if (edge.getIntersectElements().length) {
        return;
    }
    let intersectPoint;
    edges.forEach(intersectEdge => {
        intersectPoint = edge.findIntersectingPoint(intersectEdge);
        if (intersectPoint.toString() === "Point") {
            edge.addIntersectElement(intersectEdge, intersectPoint);
        }
    });
}

function reduceEdges(edges, edge) {
    const index = edges.indexOf(edge);
    if (index > -1) {
        edges.splice(index, 1);
    }
    return edges;
}
