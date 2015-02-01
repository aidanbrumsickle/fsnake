define(['direction', 'core', 'gamestate', 'queue', 'game_logic'],
function (Dir,       Core,    GameState,   Q,       GameLogic) {

    var cons = Core.cons,
        nth  = Core.nth,
        head = Core.head,
        tail = Core.tail,
        combine = Dir.combine;

// Idea: the main "render" function goes through a SnakeCursor
// and uses the context of current, head(toward_head) and head(toward_tail)
// to determine the type of snake segment to draw, and then calls a corresponding
// function that returns a list of draw command objects

// Snake -> SnakeCursor -> Cons SegmentView -> Cons DrawCommand

// Point, Point -> Dir
// Returns the direction p2 is from p1,
// assuming they are adjacent in the snake
function direction(p1, p2) {
    if (p1.x < p2.x)
        return Dir.RIGHT;
    if (p1.x > p2.x)
        return Dir.LEFT;
    if (p1.y < p2.y)
        return Dir.DOWN;
    return UP;
}


// Point, Point, Point -> SegmentType
function segment_type(p_tail, p_curr, p_head) {
    var dir1 = direction(p_curr, p_tail),
        dir2 = direction(p_curr, p_head);
    return combine(dir1, dir2);
}

// Dir -> SegmentType
function tail_type(dir) {
    return combine(dir, dir);
}

function head_type(dir1, dir2) {
    return 16 + combine(dir1, dir2);
}

// Point, SegmentType -> SegmentView
function segment_view(p, type) {
    return {
        pos: p,
        type: type
    };
}


function body_segment_view(body, length) {
    if ( length === 2 ) {
        var d = direction(nth(body, 2), head(body));
        return cons(segment_view(nth(body, 2), tail_type(d)), null);
    }

    var p_head = head(body), p_curr = nth(body, 2), p_tail = nth(body, 3);
    return cons(
            segment_view(p_curr, segment_type(p_tail, p_curr, p_head)),
            body_segment_view(tail(body), length - 1));
}

function view_snake(s) {
    var d = direction(head(s.body), nth(s.body, 2));
    return cons(
            segment_view(had(s.body), head_type(d, s.dir)),
            body_segment_view(s.body, s.length));
}

// Point, Point, Rect -> Screen
function screen(scale, off, screen_bounds) {
    return {
        scale: scale,
        off: off,
        bounds: screen_bounds
    };
}

// Screen, Effects -> Context
function context(screen_context, effects) {
    return {
        screen: screen_context,
        effects: effects
    };
}

// Game, Context, Int, Queue Input -> Instance
function instance(a_game, a_context, ticks, inputs) {
    return {
        game: a_game,
        context: a_context,
        ticks: ticks,
        inputs: inputs
    };
}


// GameState -> Int
function ticks_per_step(state) {
    return (state === LIVE || state === REWINDING) ? 10 : 1;
}




function update_game(an_instance) {
    if (an_instance.ticks === 0) {
        var input = Q.has_items(an_instance.inputs) ? Q.oldest(an_instance.inputs) : NONE;
        var new_game = GameLogic.step_game(an_instance.game, input);
        var new_ticks = ticks_per_step(new_game.state);
        return instance(
                new_game,
                an_instance.context,
                new_ticks,
                Q.remove_oldest(an_instance.inputs));
    }

    return instance(
            an_instance.game,
            an_instance.context,
            an_instance.ticks - 1,
            an_instance.inputs);
}

function update_context(inst1, inst2) {
}


// Instance -> Instance
function tick(instance0) {
    var instance1 = update_game(instance0, input);
    var instance2 = update_context(instance0, instance1);
    render(instance2);
}
