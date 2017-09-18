var Shape =
{
    Rect        : 0,
    Rectangle   : 0,
    Square      : 0,

    Circ        : 1,
    Circle      : 1,
    Ellipse     : 1,
    Oval        : 1,

    Poly        : 2,
    Polygon     : 2
};

function ButtonHotSpot(shape, coords, id, width, height, index, click)
{
    this.Coord          = coords;
    this.Enabled        = false;
    this.Height         = height;
    this.ID             = id;
    this.Index          = index;
    this.IsButton       = true;
    this.IsCapturing    = false;
    this.IsHovering     = false;
    this.Object         = Obj(this.ID);
    this.Shape          = shape;
    this.Width          = width;

    this.Click          = click || function(a, c, s) { };
    this.DoubleClick    = function(a, c, s) { if (MSIE) { this.Click(); } };
    this.Hover          = function(a, c, s) { for (var h in Game.HotSpot) { if (h != this.ID) { Game.HotSpot[h].Leave(); } } this.Object.style.backgroundPosition = (this.Index * this.Width * -1) + "px " + (this.Height * -1) + "px"; };
    this.Down           = function(a, c, s) { this.Object.style.backgroundPosition = (this.Index * this.Width * -1) + "px " + (this.Height * -2) + "px"; };
    this.Up             = function(a, c, s) { this.Object.style.backgroundPosition = (this.Index * this.Width * -1) + "px " + (this.Height * -1) + "px"; };
    this.Leave          = function(a, c, s) { this.Object.style.backgroundPosition = (this.Index * this.Width * -1) + "px " + (this.Enabled ? 0 : (this.Height * -3) + "px"); };

    this.Disable        = function()        { this.Enabled = false; this.Object.style.backgroundPosition = (this.Index * this.Width * -1) + "px " + (this.Height * -3) + "px"; this.Object.Show(); };
    this.Enable         = function()        { this.Enabled = true; this.Object.style.backgroundPosition = (this.Index * this.Width * -1) + "px 0"; this.Object.Show(); };
    this.EnableIf       = function(c)       { if (c) { this.Enable(); } else { this.Disable(); } };
    this.Update         = function()        { this.EnableIf(this.Enabled); };

    this.Hide           = function()        { this.Object.style.display = "none"; };
    this.Show           = function()        { this.Object.style.display = "block"; };
    this.ShowIf         = function(c)       { this.Object.style.display = c ? "block" : "none"; };

    switch (this.Shape)
    {
        case Shape.Rectangle:
        {
            this.Contains = function(x, y)
            {
                return (x >= this.Coord[0]) && (x <= this.Coord[2]) && (y >= this.Coord[1]) && (y <= this.Coord[3]);
            };

            break;
        }

        case Shape.Ellipse:
        {
            this.cx = (this.Coord[0] + this.Coord[2]) >> 1;
            this.cy = (this.Coord[1] + this.Coord[3]) >> 1;
            this.rx = (this.Coord[2] - this.Coord[0]) >> 1;
            this.ry = (this.Coord[3] - this.Coord[1]) >> 1;

            this.Contains = function(x, y)
            {
                var dx = x - this.cx;
                var dy = y - this.cy;

                return ((((dx * dx) / (this.rx * this.rx)) + ((dy * dy) / (this.ry * this.ry))) <= 1);
            };

            break;
        }

        case Shape.Polygon:
        {
            this.Points = this.Coord.length >> 1;

            if (this.Points < 3)
            {
                this.Contains = function(x, y)
                {
                    return false;
                };
            }
            else
            {
                this.Contains = function(x, y)
                {
                    var inside = false;
                    var newX, oldX, x1, x2;
                    var newY, oldY, y1, y2;

                    oldX = this.Coord[this.Coord.length - 2];
                    oldY = this.Coord[this.Coord.length - 1];

                    for (var p = 0; p < this.Points; p++)
                    {
                        newX = this.Coord[(p << 1) + 0];
                        newY = this.Coord[(p << 1) + 1];

                        if (newX > oldX)
                        {
                            x1 = oldX; x2 = newX; y1 = oldY; y2 = newY;
                        }
                        else
                        {
                            x1 = newX; x2 = oldX; y1 = newY; y2 = oldY;
                        }

                        if (((newX < x) == (x <= oldX)) && (((y - y1) * (x2 - x1)) < ((y2 - y1) * (x - x1))))
                        {
                            inside = !inside;
                        }

                        oldX = newX;
                        oldY = newY;
                    }

                    return inside;
                };
            }

            break;
        }
    }
}

function HotSpot(shape, coords, over, out, down, up, click, dblclick)
{
    this.Coord          = coords;
    this.Enabled        = false;
    this.IsButton       = false;
    this.IsCapturing    = false;
    this.IsHovering     = false;
    this.Shape          = shape;

    this.Click          = click     || function(a, c, s) { };
    this.DoubleClick    = dblclick  || function(a, c, s) { };
    this.Down           = down      || function(a, c, s) { };
    this.Hover          = function(a, c, s) { for (var h in Game.HotSpot) { if (h != this.ID) { Game.HotSpot[h].Leave(); } } (over || function(a, c, s) { })(a, c, s); };
    this.Leave          = out       || function(a, c, s) { };
    this.Up             = up        || function(a, c, s) { };

    this.Disable        = function()  { this.Enabled = false; };
    this.Enable         = function()  { this.Enabled = true;  };
    this.EnableIf       = function(c) { this.Enabled = c;     };

    switch (this.Shape)
    {
        case Shape.Rectangle:
        {
            this.Contains = function(x, y)
            {
                return (x >= this.Coord[0]) && (x <= this.Coord[2]) && (y >= this.Coord[1]) && (y <= this.Coord[3]);
            };

            break;
        }

        case Shape.Ellipse:
        {
            this.cx = (this.Coord[0] + this.Coord[2]) >> 1;
            this.cy = (this.Coord[1] + this.Coord[3]) >> 1;
            this.rx = (this.Coord[2] - this.Coord[0]) >> 1;
            this.ry = (this.Coord[3] - this.Coord[1]) >> 1;

            this.Contains = function(x, y)
            {
                var dx = x - this.cx;
                var dy = y - this.cy;

                return ((((dx * dx) / (this.rx * this.rx)) + ((dy * dy) / (this.ry * this.ry))) <= 1);
            };

            break;
        }

        case Shape.Polygon:
        {
            this.Points = this.Coord.length >> 1;

            if (this.Points < 3)
            {
                this.Contains = function(x, y)
                {
                    return false;
                };
            }
            else
            {
                this.Contains = function(x, y)
                {
                    var inside = false;
                    var newX, oldX, x1, x2;
                    var newY, oldY, y1, y2;

                    oldX = this.Coord[this.Coord.length - 2];
                    oldY = this.Coord[this.Coord.length - 1];

                    for (var p = 0; p < this.Points; p++)
                    {
                        newX = this.Coord[(p << 1) + 0];
                        newY = this.Coord[(p << 1) + 1];

                        if (newX > oldX)
                        {
                            x1 = oldX; x2 = newX; y1 = oldY; y2 = newY;
                        }
                        else
                        {
                            x1 = newX; x2 = oldX; y1 = newY; y2 = oldY;
                        }

                        if (((newX < x) == (x <= oldX)) && (((y - y1) * (x2 - x1)) < ((y2 - y1) * (x - x1))))
                        {
                            inside = !inside;
                        }

                        oldX = newX;
                        oldY = newY;
                    }

                    return inside;
                };
            }

            break;
        }
    }
}

function WagerHotSpot(shape, coords, id)
{
    this.Coord          = coords;
    this.Enabled        = true;
    this.ID             = id;
    this.IsButton       = false;
    this.IsCapturing    = false;
    this.IsHovering     = false;
    this.Shape          = shape;

    this.Click          = function(a, c, s) { if (!Game.Wager[this.ID].Adjustable) { return; } if (s) { Game.Wager[this.ID].Decrease(Game.DenomAmount[Game.Denom]); } else { Game.Wager[this.ID].Increase(Game.DenomAmount[Game.Denom]); } Game.Update(); this.Hover(a, c, s); };
    this.DoubleClick    = function(a, c, s) { if (MSIE) { this.Click(a, c, s); } };
    this.Down           = function(a, c, s) { };
    this.Hover          = function(a, c, s) { for (var h in Game.HotSpot) { if (h != this.ID) { Game.HotSpot[h].Leave(); } } Game.Wager[this.ID].Hover(); };
    this.Leave          = function(a, c, s) { Game.Wager[this.ID].Leave(); };
    this.Up             = function(a, c, s) { };

    this.Disable        = function()  { this.Enabled = false; };
    this.Enable         = function()  { this.Enabled = true;  };
    this.EnableIf       = function(c) { this.Enabled = c;     };

    switch (this.Shape)
    {
        case Shape.Rectangle:
        {
            this.Contains = function(x, y)
            {
                return (x >= this.Coord[0]) && (x <= this.Coord[2]) && (y >= this.Coord[1]) && (y <= this.Coord[3]);
            };

            break;
        }

        case Shape.Ellipse:
        {
            this.cx = (this.Coord[0] + this.Coord[2]) >> 1;
            this.cy = (this.Coord[1] + this.Coord[3]) >> 1;
            this.rx = (this.Coord[2] - this.Coord[0]) >> 1;
            this.ry = (this.Coord[3] - this.Coord[1]) >> 1;

            this.Contains = function(x, y)
            {
                var dx = x - this.cx;
                var dy = y - this.cy;

                return ((((dx * dx) / (this.rx * this.rx)) + ((dy * dy) / (this.ry * this.ry))) <= 1);
            };

            break;
        }

        case Shape.Polygon:
        {
            this.Points = this.Coord.length >> 1;

            if (this.Points < 3)
            {
                this.Contains = function(x, y)
                {
                    return false;
                };
            }
            else
            {
                this.Contains = function(x, y)
                {
                    var inside = false;
                    var newX, oldX, x1, x2;
                    var newY, oldY, y1, y2;

                    oldX = this.Coord[this.Coord.length - 2];
                    oldY = this.Coord[this.Coord.length - 1];

                    for (var p = 0; p < this.Points; p++)
                    {
                        newX = this.Coord[(p << 1) + 0];
                        newY = this.Coord[(p << 1) + 1];

                        if (newX > oldX)
                        {
                            x1 = oldX; x2 = newX; y1 = oldY; y2 = newY;
                        }
                        else
                        {
                            x1 = newX; x2 = oldX; y1 = newY; y2 = oldY;
                        }

                        if (((newX < x) == (x <= oldX)) && (((y - y1) * (x2 - x1)) < ((y2 - y1) * (x - x1))))
                        {
                            inside = !inside;
                        }

                        oldX = newX;
                        oldY = newY;
                    }

                    return inside;
                };
            }

            break;
        }
    }
}