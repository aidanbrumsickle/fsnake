// Cons a, Int, a -> Queue a
function queue(items, length, oldest) {
    return {
        items: items,
        length: length,
        oldest: oldest
    };
}

// Queue a -> Bool
// O(1)
function has_items(q) {
    return q.length !== 0;
}

// Queue a, a -> Queue a
// O(1)
function add_item(q, item) {
    return queue(cons(item, q.items), q.length + 1, q.oldest);
}

// Queue a -> a
// O(1)
function oldest(q) {
    return q.oldest;
}

// Queue a -> Queue a
// O(n)
function remove_oldest(q) {
    return queue(q.items, q.length - 1, nth(q.items, q.length - 1));
}
