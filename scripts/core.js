define(['direction'], function (Dir) {
// Num, Num -> Point
function point( x, y ) {
    return { x: x, y: y };
}

// Point, Point -> Point
function offset( delta, p ) {
    return delta.x == 0 && delta.y === 0 ? p : point( p.x + delta.x, p.y + delta.y );
}

// Point, Point -> Bool
function point_eq( p1, p2 ) {
    return p1.x === p2.x && p1.y === p2.y;
}

// Num, Num -> Dim
function dim( w, h ) {
    return { w: w, h: h };
}

// Dim, Dim -> Bool
function dim_eq( d1, d2 ) {
    return d1.w === d2.w && d1.h === d2.h;
}

// Dim, Dim -> Dim
function resize_by( delta, d ) {
    return delta.w === 0 && delta.h === 0 ? d : dim( d.w + delta.w, d.h + delta.h );
}

// Point, Dim -> Rect
function rect( origin, dimensions ) {
    return {
        pos: origin,
        dim: dimensions
    };
}

// Point, Rect -> Rect
function update_origin( o, r ) {
    return o === r.pos || point_eq( o, r.pos ) ? r : rect( o, r.dim );
}

// Dim, Rect -> Rect
function update_dim( d, r ) {
    return d === r.dim || dim_eq( d, r.dim ) ? r : rect(r.pos, d);
}


// Point, Rect -> Bool
function in_rect( p, r ) {
    return p.x > r.pos.x && p.x < (r.pos.x + r.dim.w)
        && p.y > r.pos.y && p.y < (r.pos.y + r.dim.h);
}


// Point, Dir -> Point
function neighbor( p, dir ) {
    switch ( dir ) {
        case Dir.LEFT:
            return point( p.x - 1, p.y );
        case Dir.UP:
            return point( p.x, p.y - 1 );
        case Dir.RIGHT:
            return point( p.x + 1, p.y );
        case Dir.DOWN:
            return point( p.x, p.y + 1 );
        default:
            return p;
    }
}

// Point, Point, Point -> Point
function transform( p, scale, offset ) {
    return point( p.x*scale.x + offset.x, p.y*scale.y + offset.y );
}

// data Cons a = Cons a (Cons a) | NilCons
// a, (Cons a) -> Cons a
function cons( p, next ) {
    return { car: p, cdr: next };
}


// class Iter where
//     head :: Iter a -> a
//     tail :: Iter a -> a

// Iter a -> a
function head( iter ) {
    return iter ? iter.car : null;
}

// Iter a -> a
function tail( iter ) {
    return iter ? typeof iter.cdr === 'function' ? iter.cdr() : iter.cdr : null;
}

// Iter a, Int -> a
function nth( iter, n ) {
    return n === 1 ? head( iter ) : nth( tail( iter ), n - 1 );
}

return { point:         point
       , offset:        offset
       , point_eq:      point_eq
       , dim:           dim
       , dim_eq:        dim_eq
       , resize_by:     resize_by
       , rect:          rect
       , update_origin: update_origin
       , update_dim:    update_dim
       , in_rect:       in_rect
       , neighbor:      neighbor
       , transform:     transform
       , cons:          cons
       , head:          head
       , tail:          tail
       , nth:           nth
};
});
