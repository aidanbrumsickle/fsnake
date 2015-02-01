define(['direction', 'core'], function (Dir, C) {
// Cons Point, Num, Dir -> Snake
function snake(body, length, direction) {
    return {
        body: body,
        length: length,
        dir: direction
    };
}

// Snake -> Point
// O(1)
function next_head(s) {
    return C.neighbor(s.body.car, s.dir);
}

// Snake, Point -> Snake
// O(1)
function move(s, new_head) {
    return snake(
            C.cons(new_head, s.body),
            s.length,
            s.dir);
}

// Snake -> Snake
// O(1)
function grow(s) {
    return snake(s.body, s.length + 1, s.dir);
}

// Snake, Dir -> Snake
// O(1)
function change_dir(s, new_dir) {
    return new_dir === s.dir ? s : snake(s.body, s.length, new_dir);
}

// Snake -> Snake
// O(1)
function move_back(s) {
    return snake(s.body.cdr, s.length, s.dir);
}

// Snake -> Snake
// O(1)
function shrink(s) {
    return snake(s.body, s.length - 1, s.dir);
}

// Point, Cons Point, Int -> Bool
// O(length)
function in_body(p, body, length) {
    if (length === 0) {
        return false;
    }
    if (C.point_eq(p, body.car)) {
        return true;
    }
    return in_body(p, body.cdr, length - 1);
}

// Point, Snake -> Bool
// O(s.length)
function in_snake(p, s) {
    return in_body(p, s.body, s.length);
}

// Snake, Dir -> Bool
// O(1)
function can_change_to(s, new_dir) {
    return ((s.dir ===Dir.LEFT || s.dir === Dir.RIGHT) && (new_dir ===   Dir.UP || new_dir ===  Dir.DOWN))
        || ((s.dir ===  Dir.UP || s.cir ===  Dir.DOWN) && (new_dir === Dir.LEFT || new_dir === Dir.RIGHT));
}

// Snake, Dir -> Snake
// O(1)
function change_dir_if_possible(s, new_dir) {
    return can_change_to(s, new_dir) ? change_dir(s, new_dir) : s;
}

return {
    snake: snake
    , next_head: next_head
    , move: move
    , grow: grow
    , change_dir: change_dir
    , move_back: move_back
    , shrink: shrink
    , in_body: in_body
    , in_snake: in_snake
    , can_change_to: can_change_to
    , change_dir_if_possible: change_dir_if_possible
};
});
