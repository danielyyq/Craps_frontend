var MSIE = (navigator.appName == "Microsoft Internet Explorer");

function Obj(id)
{
    var o = document.getElementById(id);

    if (o == null)
    {
        alert("Object not found: " + id);
    }

    if (!o.IsExtended)
    {
        o.Hide = function()
        {
            this.style.display = "none";
        };

        o.Show = function()
        {
            this.style.display = "block";
        };

        o.ShowIf = function(c)
        {
            this.style.display = c ? "block" : "none";
        };

        o.FlipH = function(width, initial, final, duration, delay)
        {
            var speed = duration / width;
            var src   = this;

            setTimeout
            (
                function()
                {
                    src.className = initial;
                    src.style.width = width + "px";
                },

                delay
            );

            for (var x = width; x >= 0; x -= 2)
            {
                setTimeout
                (
                    function(width)
                    {
                        return function()
                        {
                            src.style.width = width + "px";
                        };
                    }
                    (x),

                    delay
                );

                delay += speed;
            }

            setTimeout
            (
                function()
                {
                    src.style.width = "0";
                    src.className = final;
                },

                delay
            );

            for (var x = 0; x <= width; x += 2)
            {
                setTimeout
                (
                    function(width)
                    {
                        return function()
                        {
                            src.style.width = width + "px";
                        };
                    }
                    (x),

                    delay
                );

                delay += speed;
            }

            setTimeout
            (
                function()
                {
                    src.style.width = width + "px";
                },

                delay
            );

            return delay;
        };

        o.MoveTo = function(x, y)
        {
            this.style.left = x + "px";
            this.style.top  = y + "px";
        };

        o.Slide = function(x1, y1, x2, y2, fps, duration, delay)
        {
            var dx      = x2 - x1;
            var dy      = y2 - y1;
            var frames  = duration * fps / 1000;
            var speed   = duration / frames;
            var ox      = dx / frames;
            var oy      = dy / frames;
            var src     = this;

            setTimeout
            (
                function()
                {
                    src.style.left = x1 + "px";
                    src.style.top  = y1 + "px";
                    src.style.display = "block";
                },

                delay
            );

            for (var frame = 0; frame < frames; frame++)
            {
                delay += speed;

                setTimeout
                (
                    function(x, y)
                    {
                        return function()
                        {
                            src.style.left = x + "px";
                            src.style.top  = y + "px";
                        };
                    }
                    (x1 + (frame * ox), y1 + (frame * oy)),

                    delay
                );
            }

            setTimeout
            (
                function()
                {
                    src.style.left = x2 + "px";
                    src.style.top  = y2 + "px";
                },

                delay
            );

            return delay;
        };

        o.IsExtended = true;
    }

    return o;
}

