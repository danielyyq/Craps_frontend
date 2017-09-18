function Wager(id, left, top, min, max, title)
{
    this.Adjustable = false;
    this.Amount     = 0;
    this.DidPush    = false;
    this.ID         = id;
    this.Left       = left;
    this.LockedBet  = 0;
    this.Max        = max;
    this.Min        = min;
    this.Object     = Obj(this.ID);
    this.Slider     = Obj(this.ID + "_slider");
    this.Stack      = Obj(this.ID + "_stack");
    this.Title      = title;
    this.Top        = top;
    this.Win        = 0;

    this.Increase = function(amt)
    {
        if (Game.Balance < amt)
        {
            MessageBox.Show("Insufficient Balance", "You do not have enough chips to place this bet.");
            return;
        }

        if ((this.Amount + amt) > this.Max)
        {
            amt = this.Max - this.Amount;
        }

        if ((this.ID == "DontPass") && (this.LockedBet > 0) && ((this.Amount + amt) > this.LockedBet))
        {
            amt = this.LockedBet - this.Amount;
        }

        this.Amount  += amt;
        Game.Balance -= amt;
        this.Update();
    };

    this.Decrease = function(amt)
    {
        if (amt > this.Amount)
        {
            amt = this.Amount;
        }

        if ((this.ID == "PassLine") && ((this.Amount - amt) < this.LockedBet))
        {
            amt = this.LockedBet - this.Amount;
        }

        this.Amount  -= amt;
        Game.Balance += amt;
        this.Update();
    };

    this.Clear = function()
    {
        if (this.Amount > 0)
        {
            this.Decrease(this.Amount);
        }
    };

    this.Update = function()
    {
        this.Stack.innerHTML = this.ChipStackHTML(this.Amount);
    };

    this.Hover = function()
    {
        var amt = Font.Format(this.Amount);
        var max = Font.Format(this.Max);

        if (this.Adjustable)
        {
            Obj("message").innerHTML = Font.Write(Color.White, this.Title + " (Current Bet " + amt + ",  Max Bet " + max + ")");

            this.Object.className = "enabled wager";
        }
        else
        {
            if (this.Amount > 0)
            {
                Obj("message").innerHTML = Font.Write(Color.White, this.Title + " (Current Bet: " + amt + ")");
            }
            else
            {
                Obj("message").innerHTML = Font.Write(Color.White, this.Title);
            }

            this.Object.className = "disabled wager";
        }

        this.Object.Show();
    };

    this.Leave = function()
    {
        this.Object.Hide();

        Obj("message").innerHTML = "";
    };

    this.Win = function(amount, delay)
    {
        var leave = Obj("BetsUp").checked;
        var src   = this;
        var spd   = (Game.SlowMo ? 5 : 1);
        amount   *= src.Amount;

        if (leave)
        {
            switch (src.ID)
            {
                case "Come":            leave = !((Game.Point > 0) && (Game.Sum == 7)); break;
                case "Come4":           leave = false; break;
                case "Come5":           leave = false; break;
                case "Come6":           leave = false; break;
                case "Come8":           leave = false; break;
                case "Come9":           leave = false; break;
                case "Come10":          leave = false; break;
                case "DontCome":        leave = false; break;
                case "DontCome4":       leave = false; break;
                case "DontCome5":       leave = false; break;
                case "DontCome6":       leave = false; break;
                case "DontCome8":       leave = false; break;
                case "DontCome9":       leave = false; break;
                case "DontCome10":      leave = false; break;
                case "DontPassOdds":    leave = false; break;
                case "PassLineOdds":    leave = false; break;

                case "Come4Odds":       leave = (Game.Wager["Come4" ].Amount > 0); break;
                case "Come5Odds":       leave = (Game.Wager["Come5" ].Amount > 0); break;
                case "Come6Odds":       leave = (Game.Wager["Come6" ].Amount > 0); break;
                case "Come8Odds":       leave = (Game.Wager["Come8" ].Amount > 0); break;
                case "Come9Odds":       leave = (Game.Wager["Come9" ].Amount > 0); break;
                case "Come10Odds":      leave = (Game.Wager["Come10"].Amount > 0); break;

                case "DontCome4Odds":   leave = false; break;
                case "DontCome5Odds":   leave = false; break;
                case "DontCome6Odds":   leave = false; break;
                case "DontCome8Odds":   leave = false; break;
                case "DontCome9Odds":   leave = false; break;
                case "DontCome10Odds":  leave = false; break;
            }
        }

        if (leave)
        {
            setTimeout
            (
                function()
                {
                    Obj("message").innerHTML = Font.Write(Color.White, src.Title + " wins " + Font.Format(amount));
                    Game.LastWin += amount;
                    Obj("win").innerHTML = Font.Write(Color.Yellow, Font.Format(Game.LastWin));

                    src.Slider.MoveTo(800, 0);
                    src.Slider.innerHTML = src.ChipStackHTML(amount);
                },

                delay
            );

            delay = src.Slider.Slide(800, 0, src.Left, src.Top, 100, 250 * spd, delay) + (150 * spd);

            var diff = 0;

            switch (src.ID)
            {
                case "Come4Odds":  if (Game.Wager["Come"].Amount < Game.Wager["Come4" ].Amount) { diff = Game.Wager["Come4Odds" ].Amount - (Game.Wager["Come"].Amount * Game.Wager["Come4Odds" ].Amount / Game.Wager["Come4" ].Amount); } break;
                case "Come5Odds":  if (Game.Wager["Come"].Amount < Game.Wager["Come5" ].Amount) { diff = Game.Wager["Come5Odds" ].Amount - (Game.Wager["Come"].Amount * Game.Wager["Come5Odds" ].Amount / Game.Wager["Come5" ].Amount); } break;
                case "Come6Odds":  if (Game.Wager["Come"].Amount < Game.Wager["Come6" ].Amount) { diff = Game.Wager["Come6Odds" ].Amount - (Game.Wager["Come"].Amount * Game.Wager["Come6Odds" ].Amount / Game.Wager["Come6" ].Amount); } break;
                case "Come8Odds":  if (Game.Wager["Come"].Amount < Game.Wager["Come8" ].Amount) { diff = Game.Wager["Come8Odds" ].Amount - (Game.Wager["Come"].Amount * Game.Wager["Come8Odds" ].Amount / Game.Wager["Come8" ].Amount); } break;
                case "Come9Odds":  if (Game.Wager["Come"].Amount < Game.Wager["Come9" ].Amount) { diff = Game.Wager["Come9Odds" ].Amount - (Game.Wager["Come"].Amount * Game.Wager["Come9Odds" ].Amount / Game.Wager["Come9" ].Amount); } break;
                case "Come10Odds": if (Game.Wager["Come"].Amount < Game.Wager["Come10"].Amount) { diff = Game.Wager["Come10Odds"].Amount - (Game.Wager["Come"].Amount * Game.Wager["Come10Odds"].Amount / Game.Wager["Come10"].Amount); } break;
            }

            if (diff > 0)
            {
                setTimeout
                (
                    function()
                    {
                        src.Stack.innerHTML = src.ChipStackHTML(src.Amount - diff);
                        src.Slider.innerHTML = src.ChipStackHTML(amount + diff);
                    },

                    delay
                );
            }

            delay = src.Slider.Slide(src.Left, src.Top, 40, 570, 100, 250 * spd, delay);

            setTimeout
            (
                function()
                {
                    Game.Balance += amount + diff;
                    src.Slider.innerHTML = "";
                    src.LockedBet = 0;

                    if (diff > 0)
                    {
                        src.Amount -= diff;
                    }
                },

                delay
            );
        }
        else
        {
            setTimeout
            (
                function()
                {
                    Obj("message").innerHTML = Font.Write(Color.White, src.Title + " wins " + Font.Format(amount));
                    Game.LastWin += amount;
                    Obj("win").innerHTML = Font.Write(Color.Yellow, Font.Format(Game.LastWin));

                    src.Slider.MoveTo(800, 0);
                    src.Slider.innerHTML = src.ChipStackHTML(amount);
                },

                delay
            );

            delay = src.Slider.Slide(800, 0, src.Left, src.Top, 100, 250 * spd, delay);

            setTimeout
            (
                function()
                {
                    src.Slider.innerHTML = src.ChipStackHTML(src.Amount + amount);
                    src.Stack.innerHTML = "";
                },

                delay
            );

            delay += 150;

            delay = src.Slider.Slide(src.Left, src.Top, 40, 570, 100, 250 * spd, delay);

            setTimeout
            (
                function()
                {
                    Game.Balance += src.Amount + amount;
                    src.Slider.innerHTML = "";
                    src.Amount = 0;
                    src.LockedBet = 0;
                },

                delay
            );
        }

        return delay + (100 * spd);
    };

    this.Push = function(delay)
    {
        var src = this;
        var spd = (Game.SlowMo ? 5 : 1);

        setTimeout
        (
            function()
            {
                src.Stack.innerHTML = "";
                src.Slider.innerHTML = src.ChipStackHTML(src.Amount);
            },

            delay
        );

        delay = src.Slider.Slide(src.Left, src.Top, 40, 570, 100, 250 * spd, delay);

        setTimeout
        (
            function()
            {
                src.Slider.innerHTML = "";
                Obj("message").innerHTML = Font.Write(Color.White, src.Title + " pushes");
                Game.Balance += src.Amount;
                src.Amount = 0;
                src.LockedBet = 0;
            },

            delay
        );

        return delay + (100 * spd);
    };

    this.Lose = function(delay)
    {
        var src = this;
        var spd = (Game.SlowMo ? 5 : 1);

        setTimeout
        (
            function()
            {
                Obj("message").innerHTML = Font.Write(Color.White, src.Title + " loses");
                src.Slider.MoveTo(src.Left, src.Top);
                src.Slider.innerHTML = src.ChipStackHTML(src.Amount);
                src.Stack.innerHTML = "";
            },

            delay
        );

        delay = src.Slider.Slide(src.Left, src.Top, 800, 0, 100, 250 * spd, delay);

        setTimeout
        (
            function()
            {
                src.Slider.innerHTML = "";
                src.Amount = 0;
                src.LockedBet = 0;
            },

            delay
        );

        return delay + (100 * spd);
    };

    this.Slide = function(w, amt, delay)
    {
        var src = this;
        var spd = (Game.SlowMo ? 5 : 1);

        setTimeout
        (
            function()
            {
                src.Slider.MoveTo(src.Left, src.Top);
                src.Slider.innerHTML = src.ChipStackHTML(amt);
                src.Amount -= amt;
                src.Update();
            },

            delay
        );

        delay = src.Slider.Slide(src.Left, src.Top, w.Left, w.Top, 100, 250 * spd, delay);

        setTimeout
        (
            function()
            {
                src.Slider.innerHTML = "";
                w.Amount += amt;
                w.Update();
            },

            delay
        );

        return delay + (100 * spd);
    };

    this.ChipStackHTML = function(amt)
    {
        var h = "";

        if (amt > 0)
        {
            var a = amt;
            var d = [500000, 100000, 50000, 10000, 2500, 500, 100, 50, 25, 10, 5, 1];
            var t = 0;

            for (var x = 0; x < d.length; x++)
            {
                var n = Math.floor(a / d[x]);

                for (var y = 0; y < n; y++)
                {
                    h += '<div class="chip_' + d[x] + '" style="top:' + t + 'px;"></div>';
                    t -= 5;
                    a -= d[x];
                }
            }
        }

        return h;
    };
}
