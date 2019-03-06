import { Point } from "./model/point";
import { Polygon } from "./model/polygon";
import intersect from "./services/intersection";

export default (poly1, poly2) => {
    const p1 = new Polygon(poly1.map(p => new Point(p.x, p.y)));
    const p2 = new Polygon(poly2.map(p => new Point(p.x, p.y)));
    const polygons = intersect(p1, p2);
    return polygons.map(poly => poly.getPath());
};
