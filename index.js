'use strict';

const Polygon = require('./lib/polygon');
const PolygonArray = require('./lib/polygonArray');
const Edge = require('./lib/edge').Edge;
const pointState = require('./lib/point').pointState;

function intersection(poly1, poly2) {
    try {
        testInputValues(poly1, poly2);
    } catch (e) {
        return e;
    }

    poly1 = new Polygon(poly1);
    poly2 = new Polygon(poly2);

    let result = isOnePolyInOther(poly1, poly2);
    if (result) {
        return result;
    }

    let intersectPolies = new PolygonArray();
    intersectPolies.add(new Polygon());

    let point;
    let elem;
    let edges = poly1.getEdges();

    for (let edge of edges) {
        point = edge.getStartPoint();
        findPointInPoly(point, poly2);
        findEdgeIntersection(edge, poly2.getEdges());

        if (!edge.getIntersectCount()) {
            continue;
        }

        elem = getFirstIntersectElem(edge, point);
        if (!elem) {
            continue;
        }

        addIntersectPoint(elem.point, poly2);
        findNextIntersectPoint(edge);
    }

    return intersectPolies.getResult();


    function findNextIntersectPoint(edge) {
        let poly = poly1.isEdgeExist(elem.edge) ? poly2 : poly1;
        let ownPoly = (poly === poly1) ? poly2 : poly1;

        let point1 = elem.edge.getStartPoint();
        let point2 = elem.edge.getEndPoint();
        poly.isPointInPoly(point1);
        poly.isPointInPoly(point2);

        let edgePart1 = new Edge(elem.point, point1);
        let edgePart2 = new Edge(elem.point, point2);

        let edges = [].slice.call(poly.getEdges());
        reduceEdges(edges, edge);

        findEdgeIntersection(edgePart1, edges);
        findEdgeIntersection(edgePart2, edges);

        edgePart1.setState(point1.getState());
        edgePart2.setState(point2.getState());

        let nextStartPoint;
        let nextPart;
        if (point1.getState() === pointState.outPoly && (edgePart1.getIntersectCount() % 2) ||
            point1.getState() === (pointState.inPoly || pointState.onEdge) &&
            !(edgePart1.getIntersectCount() % 2)) {
            nextStartPoint = point1;
            nextPart = edgePart1;
        } else {
            nextStartPoint = point2;
            nextPart = edgePart2;
        }
        if (nextPart.getIntersectCount()) {
            let element = getFirstIntersectElem(nextPart, elem.point);
            if (element) {
                edge = elem.edge;
                elem = element;
                addIntersectPoint(element.point, poly);
                return findNextIntersectPoint(edge);
            }
        }

        edges = [].slice.call(ownPoly.getEdges());
        reduceEdges(edges, elem.edge);

        let nextEdge;
        for (let edge of edges) {
            if (edge.isPointExist(nextStartPoint)) {
                nextEdge = edge;
                break;
            }
        }

        if (!nextEdge.getStartPoint().isCoordEqual(nextStartPoint)) {
            nextEdge.changePoints();
        }
        ownPoly.setDirection(elem.edge, nextEdge);

        for (var i = 0; i < ownPoly.getEdges().length; i++) {
            if (i !== 0) {
                nextEdge = ownPoly.getNextEdge();
            }

            point = nextEdge.getStartPoint();
            findPointInPoly(point, poly);
            findEdgeIntersection(nextEdge, poly.getEdges());

            if (!nextEdge.getIntersectCount()) {
                continue;
            }

            elem = getFirstIntersectElem(nextEdge, point);
            if (!elem) {
                return;
            }

            addIntersectPoint(elem.point, poly);
            return findNextIntersectPoint(nextEdge);
        }
    }


    function addIntersectPoint(point, poly) {
        if (point.getState() === pointState.undefined) {
            poly.isPointInPoly(point);
        }
        let intersectPoly = intersectPolies.getLast();
        if (intersectPoly.isIntersectionEnd()) {
            intersectPolies.add(new Polygon());
        }
        intersectPoly.addPoint(point);
    }

    function findPointInPoly(point, poly) {
        if (point.compare(intersectPolies.getPoints()) && poly.isPointInPoly(point)) {
            addIntersectPoint(point, poly);
        }
    }

    function getFirstIntersectElem(edge, point) {
        let intersections = edge.getIntersectElements();
        intersections = intersections.filter(intersect =>
            intersect.point.compare(intersectPolies.getPoints()));
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
}


function testInputValues(poly1, poly2) {
    if (!Array.isArray(poly1) || !Array.isArray(poly2)) {
        throw new TypeError('Both of input values must be an array');
    } else if (poly1.length < 3 || poly2.length < 3) {
        throw new RangeError('Lengths of input values must be greater than two');
    }
}

function isOnePolyInOther(poly1, poly2) {
    let countPointsIn;
    for (let poly of [poly1, poly2]) {
        let secondPoly = (poly === poly1) ? poly2 : poly1;
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
        if (intersectPoint.toString() === 'Point') {
            edge.addIntersectElement(intersectEdge, intersectPoint);
        }
    });
}

function reduceEdges(edges, edge) {
    let index = edges.indexOf(edge);
    if (index + 1) {
        edges.splice(index, 1);
    }
    return edges;
}

module.exports = intersection;
