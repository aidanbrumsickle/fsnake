define({ LEFT:  0
       , UP:    1
       , RIGHT: 2
       , DOWN:  3
       , combine: function (dir1, dir2) {
           return (dir1 << 2) | dir2;
       }
});
