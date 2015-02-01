define (['direction', 'core', 'snake', 'gamestate', 'input'],
function (Dir,         Core,   S,       GameState,   In) {

// Snake, Point, Rect -> World
function world(snake, apple, bounds) {
    return {
        snake: snake,
        apple: apple,
        bounds: bounds
    };
}

// data Action = NOTHING | EAT_APPLE | DIE
var NOTHING = 0, EAT_APPLE = 1, DIE = 2;

// World -> Action
// O(a_world.snake.length)
function snake_action(a_world) {
    var head = a_world.snake.body.car;
    if (Core.point_eq(head, a_world.apple)) {
        return EAT_APPLE;
    }
    if (S.in_snake(head, a_world.snake) || !Core.in_rect(head, a_world.bounds)) {
        return DIE;
    }
    return NOTHING;
}

// World, Iter Point -> Iter Point
// O(?)
function next_apple(a_world, apples) {
    var apple = apples.car;
    if (apple && (S.in_snake(apple, a_world.snake) || !Core.in_rect(apple, a_world.bounds)) {
        return next_apple(a_world, Core.tail(apples));
    }
    return apples;
}

// Snake, World -> World
function update_snake_in_world(s, w) {
    return s === w.snake ? w : world(s, w.apple, w.bounds);
}

// Point, World -> World
function update_apple_in_world(a, w) {
    return a === w.apple || Core.point_eq(a, w.apple) ? w : world(w.snake, a, w.bounds);
}


// World, Int, GameState, Iter Point -> Game
function game(a_world, score, state, apples) {
    return {
        world: a_world,
        score: score,
        state: state,
        apples: apples
    };
}

// World, Game -> Game
function update_world_in_game(w, g) {
    return w === g.world ? g : game(w, g.score, g.state, g.apples);
}

// Int, Game -> Game
function update_score_in_game(score, g) {
    return score === g.score ? g : game(g.world, score, g.state, g.apples);
}

// GameState, Game -> Game
function update_state_in_game(state, g) {
    return state === g.state ? g : game(g.world, g.score, state, g.apples);
}

// Iter Point, Game -> Game
function update_apples_in_game(apples, g) {
    return apples === g.apples ? g : game(g.world, g.score, g.state, apples);
}

var APPLE_POINTS = 8, REWIND_POINTS = -1;


// Snake, Input -> Snake
function turn_snake(s, input) {
    switch (input) {
        case In.MOVE_LEFT:
            return change_dir_if_possible(s, Dir.LEFT);
        case In.MOVE_UP:
            return change_dir_if_possible(s, Dir.UP);
        case In.MOVE_RIGHT:
            return change_dir_if_possible(s, Dir.RIGHT);
        case In.MOVE_DOWN:
            return change_dir_if_possible(s, Dir.DOWN);
        default:
            return s;
    }
}

// Game, Input -> Game
function step_game_live(g, input) {
    var _snake = g.world.snake;
    if (input === In.TOGGLE_PAUSE) {
        return update_state_in_game(GameState.PAUSED, g);
    }
    var turned_snake = turn_snake(_snake, input);
    var moved_snake = move(turned_snake);
    var world_with_moved_snake = update_snake_in_world(moved_snake, g.world);
    var current_score = g.score;
    switch (snake_action(world_with_moved_snake)) {
        case NOTHING:
            return update_world_in_game(world_with_moved_snake, g);
        case EAT_APPLE:
            var grown_snake = grow(moved_snake);
            var world_with_grown_snake = update_snake_in_world(grown_snake, g.world);
            var new_apples = next_apple(world_with_grown_snake, apples);
            var new_world = update_apple_in_world(head(new_apples), world_with_grown_snake);
            return game(new_world, g.score + 1, GameState.LIVE, new_apples);
        case DIE:
            return update_state_in_game(GameState.DEAD, g);
    }
}

// Game, Input -> Game
function step_game_paused(g, input) {
    if (input === In.TOGGLE_PAUSE) {
        return update_state_in_game(GameState.LIVE, g);
    }
    return g;
}

// Game, Input -> Game
function step_game_dead(g, input) {
    if (input === In.REWIND) {
        return update_state_in_game(GameState.REWINDING, g);
    }
    if (input === In.SUBMIT_SCORE) {
        return update_state_in_game(GameState.SUBMITTING_SCORE, g);
    }
    return g;
}

// Game, Input -> Game
function step_game_rewinding(g, input) {
    if (input === In.REWIND) {
        var moved_back_snake = move_back(g.world.snake);
        return game(
                update_snake_in_world(moved_back_snake, world),
                g.score + REWIND_POINTS,
                GameState.REWINDING,
                g.apples);
    }
    if (input === In.FORWARD) {
        var new_apples = next_apple(g.world, g.apples);
        return game(
                g.snake,
                g.score,
                GameState.LIVE,
                new_apples);
    }
    return g;
}

// Game, Input -> Game
function step_game(g, input) {
    switch (g.state) {
        case GameState.LIVE:
            return step_game_live(g, input);
        case GameState.PAUSED:
            return step_game_paused(g, input);
        case GameState.DEAD:
            return step_game_dead(g, input);
        case GameState.REWINDING:
            return step_game_rewinding(g, input);
        default:
            return g;
    }
}

return { world: world
       , game:  game
       , step_game: step_game
};
});
