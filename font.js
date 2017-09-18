var Color =
{
    Black   : "black",
    Blue    : "blue",
    Cyan    : "cyan",
    Green   : "green",
    Magenta : "magenta",
    Red     : "red",
    White   : "white",
    Yellow  : "yellow"
};

var Font =
{
    Class   : [],
    symbol  : " ,./<>?;':\"[]\\{}|`~!@#$%^&*()-=_+",
    digit   : "0123456789",
    upper   : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower   : "abcdefghijklmnopqrstuvwxyz",

    Initialize : function()
    {
        for (var x = 0; x < this.symbol.length; x++)
        {
            this.Class[this.symbol.substr(x, 1)] = "symbol" + (x < 10 ? "0" : "") + x;
        }

        for (var x = 0; x < this.digit.length; x++)
        {
            this.Class[this.digit.substr(x, 1)] = "digit" + x;
        }

        for (var x = 0; x < this.upper.length; x++)
        {
            this.Class[this.upper.substr(x, 1)] = "upper" + this.upper.substr(x, 1).toLowerCase();
        }

        for (var x = 0; x < this.lower.length; x++)
        {
            this.Class[this.lower.substr(x, 1)] = "lower" + this.lower.substr(x, 1);
        }
    },

    Format : function(amt)
    {
        var a = (parseInt(amt) / 100).toFixed(2);
        var l = a.substr(0, a.length - 3);
        var r = a.substr(a.length - 3, 3);
        var x = /(\d+)(\d{3})/;

        while (x.test(l))
        {
            l = l.replace(x, "$1,$2");
        }

        return "$" + l + r.replace(".00", "");
    },

    Write : function(color, text)
    {
        var h = "";
        var l = text.split("\n");

        for (var i = 0; i < l.length; i++)
        {
            for (var x = 0; x < l[i].length; x++)
            {
                h += '<img alt="" class="font_' + color + ' font_' + this.Class[l[i].substr(x, 1)] + '" src="trans.gif">';
            }

            if (i < (l.length - 1))
            {
                h += "<br />";
            }
        }

        return h;
    }
};

Font.Initialize();
