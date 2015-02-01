define(['core', 'snake'], function (C, S) {
// Cons Point, Point, Cons Point, Int, Int, Dir -> SnakeCursor
function snake_cursor(toward_head, current, toward_tail, offset, length, dir) {
    return {
        toward_head: toward_head,
        current: current,
        toward_tail: toward_tail,
        offset: offset,
        length: length,
        dir: dir
    };
}

function point_toward_head(sc) {
    return sc.toward_head && sc.toward_head.car;
}

function point_toward_tail(sc) {
    return sc.toward_tail && sc.toward_tail.car;
}

function current(sc) {
    return sc.current;
}

// Snake -> SnakeCursor
function differentiate(s) {
    return snake_cursor(null, s.body.car, s.body.cdr, 0, s.length, s.dir);
}

// SnakeCursor -> Bool
function cursor_at_head(sc) {
    return sc.toward_head === null;
}

// SnakeCursor -> Bool
function cursor_at_tail(sc) {
    return sc.offset === sc.length - 1;
}

// SnakeCursor -> SnakeCursor
function move_cursor_toward_head(sc) {
    return cursor_at_head(sc) ? sc :
        snake_cursor(
            sc.toward_head.cdr,
            sc.toward_head.car,
            C.cons(sc.current, sc.toward_tail),
            sc.offset - 1,
            sc.length,
            sc.dir);
}

// SnakeCursor -> SnakeCursor
function move_cursor_toward_tail(sc) {
    return cursor_at_tail(sc) ? sc :
        snake_cursor(
            C.cons(sc.current, sc.toward_head),
            sc.toward_tail.car,
            sc.toward_tail.cdr,
            sc.offset + 1,
            sc.length,
            sc.dir);
}

// SnakeCursor -> SnakeCursor
function cursor_to_head(sc) {
    return cursor_at_head(sc) ? sc : cursor_to_head(move_cursor_to_head(sc));
}

// SnakeCursor -> SnakeCursor
function cursor_to_tail(sc) {
    return cursor_at_tail(sc) ? sc : cursor_to_tail(move_cursor_to_tail(sc));
}

// SnakeCursor -> Snake
function integrate(sc) {
    var sc_at_head = cursor_to_head(sc);
    return S.snake(
        C.cons(sc_at_head.current, sc_at_head.toward_tail),
        sc_at_head.length,
        sc_at_head.dir);
}

return { snake_cursor:            snake_cursor
       , point_toward_head:       point_toward_head
       , point_toward_tail:       point_toward_tail
       , current:                 current
       , differentiate:           differentiate
       , cursor_at_head:          cursor_at_head
       , cursor_at_tail:          cursor_at_tail
       , move_cursor_toward_head: move_cursor_toward_head
       , move_cursor_toward_tail: move_cursor_toward_tail
       , cursor_to_head:          cursor_to_head
       , cursor_to_tail:          cursor_to_tail
       , integrate:               integrate
};
});
