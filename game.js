var PuckPos = [0, 0, 0, 0, 240, 331, 422, 0, 513, 604, 695, 0, 0];

var Game =
{
    Balance                         : 1000000,
    Button                          : false,
    CaptureStart                    : { X : -1, Y : -1 },
    Deck                            : [1, 2, 3, 4, 5, 6],
    Denom                           : 0,
    DenomAmount                     : [100, 500, 2500, 10000],
    DenomPosition                   : [130, 191, 252, 313],
    HotSpot                         : [],
    IsCapturing                     : false,
    IsHovering                      : false,
    LastWin                         : 0,
    Point                           : 0,
    SlowMo                          : false,
    Sum                             : 0,
    Wager                           : [],

    GetEventInfo                    : function(e) { var o = Obj("capture"); var x = 0; var y = 0; var a = e.altKey; var c = e.ctrlKey; var s = e.shiftKey; if (e.offsetX || e.offsetY) { x = e.offsetX; y = e.offsetY; } else { while (o) { x += o.offsetLeft; y += o.offsetTop; o = o.offsetParent; } x = e.pageX - x; y = e.pageY - y; } return { X : x, Y : y, Alt : a, Ctrl : c, Shift : s, Button : Game.Button }; },
    GlobalMouseDown                 : function(e) { Game.Button = true; },
    GlobalMouseUp                   : function(e) { Game.Button = false; Game.IsCapturing = false; for (var h in Game.HotSpot) { Game.HotSpot[h].IsCapturing = false; } },
    KeyReleased                     : function(e) { if (Game.HotSpot["ButtonMsgBox"].Enabled == false) { return true; } if ((e.keyCode == 13) || (e.keyCode == 27) || (e.keyCode == 32)) { Game.HotSpot["ButtonMsgBox"].Click(); return false; } return true; },
    MouseClick                      : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y) && Game.HotSpot[h].Contains(Game.CaptureStart.X, Game.CaptureStart.Y)) { Game.IsCapturing = false; Game.IsHovering = true; Game.HotSpot[h].IsCapturing = false; Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].Click(evt.Alt, evt.Ctrl, evt.Shift); } } },
    MouseDoubleClick                : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y) && Game.HotSpot[h].Contains(Game.CaptureStart.X, Game.CaptureStart.Y)) { Game.IsCapturing = false; Game.IsHovering = true; Game.HotSpot[h].IsCapturing = false; Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].DoubleClick(evt.Alt, evt.Ctrl, evt.Shift); } } },
    MouseDown                       : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); Game.CaptureStart.X = evt.X; Game.CaptureStart.Y = evt.Y; for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y)) { Game.IsCapturing = true; Game.HotSpot[h].IsCapturing = true; Game.HotSpot[h].Down(evt.Alt, evt.Ctrl, evt.Shift); } } },
    MouseMove                       : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); var NewCap = false; var NewHov = false; for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled) { if (Game.IsCapturing && Game.Button) { if (Game.HotSpot[h].Contains(evt.X, evt.Y)) { if (Game.HotSpot[h].IsCapturing) { if (!Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].Down(evt.Alt, evt.Ctrl, evt.Shift); } } else { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(evt.Alt, evt.Ctrl, evt.Shift); } } } else { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(evt.Alt, evt.Ctrl, evt.Shift); } } } else { if (Game.HotSpot[h].Contains(evt.X, evt.Y)) { if (!Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].Hover(evt.Alt, evt.Ctrl, evt.Shift); } } else { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(evt.Alt, evt.Ctrl, evt.Shift); } } } } else { if (Game.HotSpot[h].IsCapturing || Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsCapturing = false; Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(); } } NewCap |= Game.HotSpot[h].IsCapturing; NewHov |= Game.HotSpot[h].IsHovering; } Game.IsCapturing = NewCap; Game.IsHovering = NewHov; },
    MouseOut                        : function(e) { Game.IsHovering = false; for (var h in Game.HotSpot) { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(); } } },
    MouseUp                         : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); for (var h in Game.HotSpot) { Game.IsCapturing = false; Game.HotSpot[h].IsCapturing = false; if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y)) { Game.HotSpot[h].IsHovering = true; if (Game.HotSpot[h].IsCapturing) { Game.HotSpot[h].Up(evt.Alt, evt.Ctrl, evt.Shift); } else { Game.HotSpot[h].Hover(evt.Alt, evt.Ctrl, evt.Shift); } } else { Game.HotSpot[h].IsHovering = false; } } },

    DisableInput                    : function() { for (var h in Game.HotSpot) { try { Game.HotSpot[h].Disable(); } catch (e) { } } },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // INITIALIZE
    //
    ////////////////////////////////////////////////////////////////////////////////

    Initialize : function()
    {
        Game.HotSpot.PassLine        = new WagerHotSpot(Shape.Polygon,    [79,82, 80,430, 574,431, 574,457, 53,457, 53,108],     "PassLine");
        Game.HotSpot.PassLineOdds    = new WagerHotSpot(Shape.Polygon,    [49,112, 50,460, 574,461, 574,467, 43,467, 43,118],    "PassLineOdds");
        Game.HotSpot.DontPass        = new WagerHotSpot(Shape.Polygon,    [119,42, 120,390, 574,391, 574,417, 93,417, 93,68],    "DontPass");
        Game.HotSpot.DontPassOdds    = new WagerHotSpot(Shape.Polygon,    [89,72, 90,420, 574,421, 574,427, 83,427, 83,78],      "DontPassOdds");
        Game.HotSpot.Field           = new WagerHotSpot(Shape.Rectangle,  [123,267, 574,387],                                    "Field");
        Game.HotSpot.Come            = new WagerHotSpot(Shape.Rectangle,  [123,142, 574,263],                                    "Come");
        Game.HotSpot.DontCome        = new WagerHotSpot(Shape.Rectangle,  [123,39, 210,138],                                     "DontCome");

        Game.HotSpot.Lay4            = new WagerHotSpot(Shape.Rectangle,  [214,39, 301,54],                                      "Lay4");
        Game.HotSpot.Lay5            = new WagerHotSpot(Shape.Rectangle,  [305,39, 392,54],                                      "Lay5");
        Game.HotSpot.Lay6            = new WagerHotSpot(Shape.Rectangle,  [396,39, 483,54],                                      "Lay6");
        Game.HotSpot.Lay8            = new WagerHotSpot(Shape.Rectangle,  [487,39, 574,54],                                      "Lay8");
        Game.HotSpot.Lay9            = new WagerHotSpot(Shape.Rectangle,  [578,39, 665,54],                                      "Lay9");
        Game.HotSpot.Lay10           = new WagerHotSpot(Shape.Rectangle,  [669,39, 756,54],                                      "Lay10");

        Game.HotSpot.Buy4            = new WagerHotSpot(Shape.Rectangle,  [214,123, 301,138],                                    "Buy4");
        Game.HotSpot.Buy5            = new WagerHotSpot(Shape.Rectangle,  [305,123, 392,138],                                    "Buy5");
        Game.HotSpot.Buy6            = new WagerHotSpot(Shape.Rectangle,  [396,123, 483,138],                                    "Buy6");
        Game.HotSpot.Buy8            = new WagerHotSpot(Shape.Rectangle,  [487,123, 574,138],                                    "Buy8");
        Game.HotSpot.Buy9            = new WagerHotSpot(Shape.Rectangle,  [578,123, 665,138],                                    "Buy9");
        Game.HotSpot.Buy10           = new WagerHotSpot(Shape.Rectangle,  [669,123, 756,138],                                    "Buy10");

        Game.HotSpot.Come4           = new WagerHotSpot(Shape.Rectangle,  [214,89, 257,119],                                     "Come4");
        Game.HotSpot.Come5           = new WagerHotSpot(Shape.Rectangle,  [305,89, 348,119],                                     "Come5");
        Game.HotSpot.Come6           = new WagerHotSpot(Shape.Rectangle,  [396,89, 439,119],                                     "Come6");
        Game.HotSpot.Come8           = new WagerHotSpot(Shape.Rectangle,  [487,89, 530,119],                                     "Come8");
        Game.HotSpot.Come9           = new WagerHotSpot(Shape.Rectangle,  [578,89, 621,119],                                     "Come9");
        Game.HotSpot.Come10          = new WagerHotSpot(Shape.Rectangle,  [669,89, 712,119],                                     "Come10");

        Game.HotSpot.Come4Odds       = new WagerHotSpot(Shape.Rectangle,  [258,89, 301,119],                                     "Come4Odds");
        Game.HotSpot.Come5Odds       = new WagerHotSpot(Shape.Rectangle,  [349,89, 382,119],                                     "Come5Odds");
        Game.HotSpot.Come6Odds       = new WagerHotSpot(Shape.Rectangle,  [440,89, 483,119],                                     "Come6Odds");
        Game.HotSpot.Come8Odds       = new WagerHotSpot(Shape.Rectangle,  [531,89, 574,119],                                     "Come8Odds");
        Game.HotSpot.Come9Odds       = new WagerHotSpot(Shape.Rectangle,  [622,89, 665,119],                                     "Come9Odds");
        Game.HotSpot.Come10Odds      = new WagerHotSpot(Shape.Rectangle,  [713,89, 756,119],                                     "Come10Odds");

        Game.HotSpot.DontCome4       = new WagerHotSpot(Shape.Rectangle,  [258,58, 301,88],                                      "DontCome4");
        Game.HotSpot.DontCome5       = new WagerHotSpot(Shape.Rectangle,  [349,58, 382,88],                                      "DontCome5");
        Game.HotSpot.DontCome6       = new WagerHotSpot(Shape.Rectangle,  [440,58, 483,88],                                      "DontCome6");
        Game.HotSpot.DontCome8       = new WagerHotSpot(Shape.Rectangle,  [531,58, 574,88],                                      "DontCome8");
        Game.HotSpot.DontCome9       = new WagerHotSpot(Shape.Rectangle,  [622,58, 665,88],                                      "DontCome9");
        Game.HotSpot.DontCome10      = new WagerHotSpot(Shape.Rectangle,  [713,58, 756,88],                                      "DontCome10");

        Game.HotSpot.DontCome4Odds   = new WagerHotSpot(Shape.Rectangle,  [214,58, 257,88],                                      "DontCome4Odds");
        Game.HotSpot.DontCome5Odds   = new WagerHotSpot(Shape.Rectangle,  [305,58, 348,88],                                      "DontCome5Odds");
        Game.HotSpot.DontCome6Odds   = new WagerHotSpot(Shape.Rectangle,  [396,58, 439,88],                                      "DontCome6Odds");
        Game.HotSpot.DontCome8Odds   = new WagerHotSpot(Shape.Rectangle,  [487,58, 530,88],                                      "DontCome8Odds");
        Game.HotSpot.DontCome9Odds   = new WagerHotSpot(Shape.Rectangle,  [578,58, 621,88],                                      "DontCome9Odds");
        Game.HotSpot.DontCome10Odds  = new WagerHotSpot(Shape.Rectangle,  [669,58, 712,88],                                      "DontCome10Odds");

        Game.HotSpot.AnySeven        = new WagerHotSpot(Shape.Rectangle,  [588,157, 788,207],                                    "AnySeven");
        Game.HotSpot.Hard4           = new WagerHotSpot(Shape.Rectangle,  [588,211, 686,261],                                    "Hard4");
        Game.HotSpot.Hard6           = new WagerHotSpot(Shape.Rectangle,  [588,265, 686,315],                                    "Hard6");
        Game.HotSpot.Hard8           = new WagerHotSpot(Shape.Rectangle,  [690,265, 788,315],                                    "Hard8");
        Game.HotSpot.Hard10          = new WagerHotSpot(Shape.Rectangle,  [690,211, 788,261],                                    "Hard10");
        Game.HotSpot.Two             = new WagerHotSpot(Shape.Rectangle,  [588,373, 686,423],                                    "Two");
        Game.HotSpot.Three           = new WagerHotSpot(Shape.Rectangle,  [588,319, 686,369],                                    "Three");
        Game.HotSpot.Eleven          = new WagerHotSpot(Shape.Rectangle,  [690,319, 788,369],                                    "Eleven");
        Game.HotSpot.Twelve          = new WagerHotSpot(Shape.Rectangle,  [690,373, 788,423],                                    "Twelve");
        Game.HotSpot.AnyCraps        = new WagerHotSpot(Shape.Rectangle,  [588,427, 788,477],                                    "AnyCraps");

        Game.HotSpot.Denom0          = new HotSpot(Shape.Ellipse,    [136, 528, 185, 572], null, null, null, null, function(a, c, s) { Game.SetDenom(0); }, null),
        Game.HotSpot.Denom1          = new HotSpot(Shape.Ellipse,    [197, 528, 246, 572], null, null, null, null, function(a, c, s) { Game.SetDenom(1); }, null),
        Game.HotSpot.Denom2          = new HotSpot(Shape.Ellipse,    [258, 528, 307, 572], null, null, null, null, function(a, c, s) { Game.SetDenom(2); }, null),
        Game.HotSpot.Denom3          = new HotSpot(Shape.Ellipse,    [319, 528, 368, 572], null, null, null, null, function(a, c, s) { Game.SetDenom(3); }, null),

        Game.HotSpot.ButtonRoll      = new ButtonHotSpot(Shape.Rectangle,   [447, 525, 566, 574], "btn_roll",      120, 50, 0, function(a, c, s) { Game.Roll(a, c, s); }),
        Game.HotSpot.ButtonClear     = new ButtonHotSpot(Shape.Rectangle,   [577, 525, 696, 574], "btn_clear",     120, 50, 1, function(a, c, s) { Game.Clear(); }),
        Game.HotSpot.ButtonMsgBox    = new ButtonHotSpot(Shape.Rectangle,   [340, 340, 459, 389], "msgbox_button", 120, 50, 2, function(a, c, s) { MessageBox.Hide(); })


        Game.Wager.PassLine          = new Wager("PassLine",         404, 422, 0, 500000, "Pass Line");
        Game.Wager.PassLineOdds      = new Wager("PassLineOdds",     462, 443, 0, 500000, "Pass Odds");
        Game.Wager.DontPass          = new Wager("DontPass",         124, 381, 0, 500000, "Don't Pass");
        Game.Wager.DontPassOdds      = new Wager("DontPassOdds",     179, 401, 0, 500000, "Don't Pass Odds");
        Game.Wager.Field             = new Wager("Field",            412, 334, 0, 500000, "Field");
        Game.Wager.Come              = new Wager("Come",             316, 181, 0, 500000, "Come");
        Game.Wager.DontCome          = new Wager("DontCome",         143,  93, 0, 500000, "Don't Come");

        Game.Wager.Lay4              = new Wager("Lay4",             233,  17, 0, 500000, "Lay 4");
        Game.Wager.Lay5              = new Wager("Lay5",             324,  17, 0, 500000, "Lay 5");
        Game.Wager.Lay6              = new Wager("Lay6",             415,  17, 0, 500000, "Lay 6");
        Game.Wager.Lay8              = new Wager("Lay8",             506,  17, 0, 500000, "Lay 8");
        Game.Wager.Lay9              = new Wager("Lay9",             597,  17, 0, 500000, "Lay 9");
        Game.Wager.Lay10             = new Wager("Lay10",            688,  17, 0, 500000, "Lay 10");

        Game.Wager.Buy4              = new Wager("Buy4",             233, 111, 0, 500000, "Buy 4");
        Game.Wager.Buy5              = new Wager("Buy5",             324, 113, 0, 500000, "Place 5");
        Game.Wager.Buy6              = new Wager("Buy6",             415, 113, 0, 500000, "Place 6");
        Game.Wager.Buy8              = new Wager("Buy8",             506, 113, 0, 500000, "Place 8");
        Game.Wager.Buy9              = new Wager("Buy9",             597, 113, 0, 500000, "Place 9");
        Game.Wager.Buy10             = new Wager("Buy10",            688, 113, 0, 500000, "Buy 10");

        Game.Wager.Come4             = new Wager("Come4",            212,  77, 0, 500000, "Come 4");
        Game.Wager.Come5             = new Wager("Come5",            303,  77, 0, 500000, "Come 5");
        Game.Wager.Come6             = new Wager("Come6",            394,  77, 0, 500000, "Come 6");
        Game.Wager.Come8             = new Wager("Come8",            485,  77, 0, 500000, "Come 8");
        Game.Wager.Come9             = new Wager("Come9",            576,  77, 0, 500000, "Come 9");
        Game.Wager.Come10            = new Wager("Come10",           667,  77, 0, 500000, "Come 10");

        Game.Wager.Come4Odds         = new Wager("Come4Odds",        254,  77, 0, 500000, "Come 4 Odds");
        Game.Wager.Come5Odds         = new Wager("Come5Odds",        345,  77, 0, 500000, "Come 5 Odds");
        Game.Wager.Come6Odds         = new Wager("Come6Odds",        436,  77, 0, 500000, "Come 6 Odds");
        Game.Wager.Come8Odds         = new Wager("Come8Odds",        527,  77, 0, 500000, "Come 8 Odds");
        Game.Wager.Come9Odds         = new Wager("Come9Odds",        618,  77, 0, 500000, "Come 9 Odds");
        Game.Wager.Come10Odds        = new Wager("Come10Odds",       709,  77, 0, 500000, "Come 10 Odds");

        Game.Wager.DontCome4         = new Wager("DontCome4",        254,  56, 0, 500000, "Don't Come 4");
        Game.Wager.DontCome5         = new Wager("DontCome5",        345,  56, 0, 500000, "Don't Come 5");
        Game.Wager.DontCome6         = new Wager("DontCome6",        436,  56, 0, 500000, "Don't Come 6");
        Game.Wager.DontCome8         = new Wager("DontCome8",        527,  56, 0, 500000, "Don't Come 8");
        Game.Wager.DontCome9         = new Wager("DontCome9",        618,  56, 0, 500000, "Don't Come 9");
        Game.Wager.DontCome10        = new Wager("DontCome10",       709,  56, 0, 500000, "Don't Come 10");

        Game.Wager.DontCome4Odds     = new Wager("DontCome4Odds",    212,  56, 0, 500000, "Don't Come 4 Odds");
        Game.Wager.DontCome5Odds     = new Wager("DontCome5Odds",    303,  56, 0, 500000, "Don't Come 5 Odds");
        Game.Wager.DontCome6Odds     = new Wager("DontCome6Odds",    394,  56, 0, 500000, "Don't Come 6 Odds");
        Game.Wager.DontCome8Odds     = new Wager("DontCome8Odds",    485,  56, 0, 500000, "Don't Come 8 Odds");
        Game.Wager.DontCome9Odds     = new Wager("DontCome9Odds",    576,  56, 0, 500000, "Don't Come 9 Odds");
        Game.Wager.DontCome10Odds    = new Wager("DontCome10Odds",   667,  56, 0, 500000, "Don't Come 10 Odds");

        Game.Wager.AnySeven          = new Wager("AnySeven",         663, 160, 0, 125000, "Any Seven");
        Game.Wager.Hard4             = new Wager("Hard4",            612, 214, 0, 70000, "Hard 4");
        Game.Wager.Hard6             = new Wager("Hard6",            612, 268, 0, 50000, "Hard 6");
        Game.Wager.Hard8             = new Wager("Hard8",            714, 268, 0, 50000, "Hard 8");
        Game.Wager.Hard10            = new Wager("Hard10",           714, 214, 0, 70000, "Hard 10");
        Game.Wager.Two               = new Wager("Two",              612, 376, 0, 15000, "Two");
        Game.Wager.Three             = new Wager("Three",            612, 322, 0, 30000, "Three");
        Game.Wager.Eleven            = new Wager("Eleven",           714, 322, 0, 30000, "Eleven");
        Game.Wager.Twelve            = new Wager("Twelve",           714, 376, 0, 15000, "Twelve");
        Game.Wager.AnyCraps          = new Wager("AnyCraps",         663, 430, 0, 70000, "Any Craps");

        var cap = Obj("capture");

        cap.onselectstart               = function() { return false; };
        cap.ondragstart                 = function() { return false; };
        cap.onmousemove                 = Game.MouseMove;
        cap.onmousedown                 = Game.MouseDown;
        cap.onmouseup                   = Game.MouseUp;
        cap.onclick                     = Game.MouseClick;
        cap.ondblclick                  = Game.MouseDoubleClick;
        cap.onmouseout                  = Game.MouseOut;
        document.body.onmousedown       = Game.GlobalMouseDown;
        document.body.onmouseup         = Game.GlobalMouseUp;
        document.onkeydown              = function(e) { return Game.KeyReleased(e || window.event); }

        Obj("loading").Hide();
        Obj("game").Show();
        Obj("game").scrollIntoView();

        Game.Update();
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // UPDATE
    //
    ////////////////////////////////////////////////////////////////////////////////

    Update : function()
    {
        var betson = Obj("BetsOn").checked;

        // Update Balance

        Obj("balance").innerHTML = Font.Write(Color.Yellow, Font.Format(Game.Balance));

        // Update Wagers

        Game.Wager.PassLine.Adjustable          = (Game.Point == 0);
        Game.Wager.DontPass.Adjustable          = (Game.Point == 0);

        Game.Wager.PassLineOdds.Adjustable      = (Game.Point > 0);
        Game.Wager.DontPassOdds.Adjustable      = (Game.Point > 0);

        Game.Wager.PassLineOdds.Max             = Game.Wager.PassLine.Amount * [0, 0, 0, 0, 3, 4, 5, 0, 5, 4, 3, 0, 0][Game.Point];
        Game.Wager.DontPassOdds.Max             = Game.Wager.DontPass.Amount * 6;

        Game.Wager.Come.Adjustable              = (Game.Point > 0);
        Game.Wager.Come4.Adjustable             = false;
        Game.Wager.Come5.Adjustable             = false;
        Game.Wager.Come6.Adjustable             = false;
        Game.Wager.Come8.Adjustable             = false;
        Game.Wager.Come9.Adjustable             = false;
        Game.Wager.Come10.Adjustable            = false;

        Game.Wager.DontCome.Adjustable          = (Game.Point > 0);
        Game.Wager.DontCome4.Adjustable         = false;
        Game.Wager.DontCome5.Adjustable         = false;
        Game.Wager.DontCome6.Adjustable         = false;
        Game.Wager.DontCome8.Adjustable         = false;
        Game.Wager.DontCome9.Adjustable         = false;
        Game.Wager.DontCome10.Adjustable        = false;

        Game.Wager.Come4Odds.Adjustable         = (betson || (Game.Point > 0) ? (Game.Wager.Come4.Amount  > 0) : false);
        Game.Wager.Come5Odds.Adjustable         = (betson || (Game.Point > 0) ? (Game.Wager.Come5.Amount  > 0) : false);
        Game.Wager.Come6Odds.Adjustable         = (betson || (Game.Point > 0) ? (Game.Wager.Come6.Amount  > 0) : false);
        Game.Wager.Come8Odds.Adjustable         = (betson || (Game.Point > 0) ? (Game.Wager.Come8.Amount  > 0) : false);
        Game.Wager.Come9Odds.Adjustable         = (betson || (Game.Point > 0) ? (Game.Wager.Come9.Amount  > 0) : false);
        Game.Wager.Come10Odds.Adjustable        = (betson || (Game.Point > 0) ? (Game.Wager.Come10.Amount > 0) : false);

        Game.Wager.Come4Odds.Max                = Game.Wager.Come4.Amount * 3;
        Game.Wager.Come5Odds.Max                = Game.Wager.Come5.Amount * 4;
        Game.Wager.Come6Odds.Max                = Game.Wager.Come6.Amount * 5;
        Game.Wager.Come8Odds.Max                = Game.Wager.Come8.Amount * 5;
        Game.Wager.Come9Odds.Max                = Game.Wager.Come9.Amount * 4;
        Game.Wager.Come10Odds.Max               = Game.Wager.Come10.Amount * 3;

        Game.Wager.DontCome4Odds.Adjustable     = Game.Wager.DontCome4.Amount > 0;
        Game.Wager.DontCome5Odds.Adjustable     = Game.Wager.DontCome5.Amount > 0;
        Game.Wager.DontCome6Odds.Adjustable     = Game.Wager.DontCome6.Amount > 0;
        Game.Wager.DontCome8Odds.Adjustable     = Game.Wager.DontCome8.Amount > 0;
        Game.Wager.DontCome9Odds.Adjustable     = Game.Wager.DontCome9.Amount > 0;
        Game.Wager.DontCome10Odds.Adjustable    = Game.Wager.DontCome10.Amount > 0;

        Game.Wager.DontCome4Odds.Max            = Game.Wager.DontCome4.Amount * 6;
        Game.Wager.DontCome5Odds.Max            = Game.Wager.DontCome5.Amount * 6;
        Game.Wager.DontCome6Odds.Max            = Game.Wager.DontCome6.Amount * 6;
        Game.Wager.DontCome8Odds.Max            = Game.Wager.DontCome8.Amount * 6;
        Game.Wager.DontCome9Odds.Max            = Game.Wager.DontCome9.Amount * 6;
        Game.Wager.DontCome10Odds.Max           = Game.Wager.DontCome10.Amount * 6;

        Game.Wager.Buy4.Adjustable              = betson || (Game.Point > 0);
        Game.Wager.Buy5.Adjustable              = betson || (Game.Point > 0);
        Game.Wager.Buy6.Adjustable              = betson || (Game.Point > 0);
        Game.Wager.Buy8.Adjustable              = betson || (Game.Point > 0);
        Game.Wager.Buy9.Adjustable              = betson || (Game.Point > 0);
        Game.Wager.Buy10.Adjustable             = betson || (Game.Point > 0);

        Game.Wager.Lay4.Adjustable              = true;
        Game.Wager.Lay5.Adjustable              = true;
        Game.Wager.Lay6.Adjustable              = true;
        Game.Wager.Lay8.Adjustable              = true;
        Game.Wager.Lay9.Adjustable              = true;
        Game.Wager.Lay10.Adjustable             = true;

        Game.Wager.Field.Adjustable             = true;
        Game.Wager.AnySeven.Adjustable          = true;
        Game.Wager.Two.Adjustable               = true;
        Game.Wager.Three.Adjustable             = true;
        Game.Wager.Eleven.Adjustable            = true;
        Game.Wager.Twelve.Adjustable            = true;
        Game.Wager.AnyCraps.Adjustable          = true;

        Game.Wager.Hard4.Adjustable             = betson || (Game.Point > 0);
        Game.Wager.Hard6.Adjustable             = betson || (Game.Point > 0);
        Game.Wager.Hard8.Adjustable             = betson || (Game.Point > 0);
        Game.Wager.Hard10.Adjustable            = betson || (Game.Point > 0);

        // Off Indicators

        Obj("Buy4Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Buy4.Amount  > 0));
        Obj("Buy5Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Buy5.Amount  > 0));
        Obj("Buy6Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Buy6.Amount  > 0));
        Obj("Buy8Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Buy8.Amount  > 0));
        Obj("Buy9Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Buy9.Amount  > 0));
        Obj("Buy10Off").ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Buy10.Amount > 0));
        Obj("Come4Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Come4Odds.Amount  > 0));
        Obj("Come5Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Come5Odds.Amount  > 0));
        Obj("Come6Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Come6Odds.Amount  > 0));
        Obj("Come8Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Come8Odds.Amount  > 0));
        Obj("Come9Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Come9Odds.Amount  > 0));
        Obj("Come10Off").ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Come10Odds.Amount > 0));
        Obj("Hard4Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Hard4.Amount  > 0));
        Obj("Hard6Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Hard6.Amount  > 0));
        Obj("Hard8Off" ).ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Hard8.Amount  > 0));
        Obj("Hard10Off").ShowIf(!betson && (Game.Point == 0) && (Game.Wager.Hard10.Amount > 0));

        // Update Total Bet

        var total_bet = 0;
        var total_adj = 0;

        for (var k in Game.Wager)
        {
            total_bet += Game.Wager[k].Amount;
            total_adj += (Game.Wager[k].Adjustable ? Game.Wager[k].Amount : 0);
        }

        Obj("wager").innerHTML = Font.Write(Color.Yellow, Font.Format(total_bet));

        // Enable Wagers

        for (var k in Game.Wager)
        {
            Game.HotSpot[k].Enable();
        }

        // Update Buttons

        Game.HotSpot["Denom0"].Enable();
        Game.HotSpot["Denom1"].Enable();
        Game.HotSpot["Denom2"].Enable();
        Game.HotSpot["Denom3"].Enable();

        Game.HotSpot["ButtonRoll"].Enable();
        Game.HotSpot["ButtonClear"].EnableIf(total_adj > 0);
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // SET DENOMINATION
    //
    ////////////////////////////////////////////////////////////////////////////////

    SetDenom : function(n)
    {
        var obj = Obj("denom");

        Game.Denom = n;
        obj.style.left = Game.DenomPosition[n] + "px";
        obj.Show();
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // CLEAR
    //
    ////////////////////////////////////////////////////////////////////////////////

    Clear : function()
    {
        var a = [];

        if (Game.Point == 0)
        {
            a.push("PassLine");
            a.push("DontPass");
            a.push("Come");
            a.push("DontCome");
        }
        else
        {
            a.push("PassLineOdds");
            a.push("DontPassOdds");
            a.push("Come");
            a.push("Come4Odds");
            a.push("Come5Odds");
            a.push("Come6Odds");
            a.push("Come8Odds");
            a.push("Come9Odds");
            a.push("Come10Odds");
            a.push("DontCome");
            a.push("DontCome4Odds");
            a.push("DontCome5Odds");
            a.push("DontCome6Odds");
            a.push("DontCome8Odds");
            a.push("DontCome9Odds");
            a.push("DontCome10Odds");
            a.push("Buy4");
            a.push("Buy5");
            a.push("Buy6");
            a.push("Buy8");
            a.push("Buy9");
            a.push("Buy10");
            a.push("Hard4");
            a.push("Hard6");
            a.push("Hard8");
            a.push("Hard10");
        }

        a.push("Lay4");
        a.push("Lay5");
        a.push("Lay6");
        a.push("Lay8");
        a.push("Lay9");
        a.push("Lay10");

        a.push("Field");
        a.push("AnySeven");
        a.push("Two");
        a.push("Three");
        a.push("Eleven");
        a.push("Twelve");
        a.push("AnyCraps");

        for (var x = 0; x < a.length; x++)
        {
            Game.Wager[a[x]].Clear();
        }

        Game.Update();
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // ROLL
    //
    ////////////////////////////////////////////////////////////////////////////////

    Roll : function(a, c, s)
    {
        Game.DisableInput();

        Game.SlowMo = c && s;

        var betson = Obj("BetsOn").checked;

        Obj("win").innerHTML = "";
        Game.LastWin = 0;

        // lock in bets that might be partially adjustable after this roll

        var oldpoint = Game.Point;
        var newpoint = Game.Point;

        Game.Wager.PassLine.LockedBet = Game.Wager.PassLine.Amount;
        Game.Wager.DontPass.LockedBet = Game.Wager.DontPass.Amount;

        var die1 = RNG.Next(6) + 1;
        var die2 = RNG.Next(6) + 1;
        var sum  = die1 + die2; Game.Sum = sum;
        var puck = Obj("puck");
        var img  = Obj("puckimg");

        // animate dice roll

        var delay = 0;
        var dummy = 0;

        var d1 = Obj("die1");
        var d2 = Obj("die2");

        d1.MoveTo(800, 158);
        d2.MoveTo(800, 203);

        var dur1 = 400;
        var dur2 = 400;
        var dur3 = 80;
        var frms = (dur1 + dur2) / dur3;

        for (var x = 0; x < frms; x++)
        {
            setTimeout
            (
                function()
                {
                    d1.style.backgroundPosition = "0 " + (Math.floor(Math.random() * 6) * -45) + "px";
                    d2.style.backgroundPosition = "0 " + (Math.floor(Math.random() * 6) * -45) + "px";
                },

                delay + (x * dur3)
            );
        }

        dummy = d1.Slide(800, 158, 0, 142, 100, dur1, delay);
        delay = d2.Slide(800, 203, 0, 219, 100, dur1, delay);
        dummy = d1.Slide(0, 142, 128 + Math.floor(Math.random() * 60), 148 + Math.floor(Math.random() * 10), 100, dur2, delay);
        delay = d2.Slide(0, 219, 128 + Math.floor(Math.random() * 60), 203 + Math.floor(Math.random() * 10), 100, dur2, delay);

        setTimeout
        (
            function()
            {
                d1.style.backgroundPosition = "0 " + ((die1 - 1) * -45) + "px";
                d2.style.backgroundPosition = "0 " + ((die2 - 1) * -45) + "px";
            },

            delay
        );

        // move and flip puck if applicable

        if ((Game.Point == 0) && ((sum > 3) && (sum != 7) && (sum < 11)))
        {
            dummy = img.FlipH(35, "off", "on", 100, delay);
            delay = puck.Slide(40, 3, PuckPos[sum], 3, 100, 300, delay);
            newpoint = sum;
        }
        else if ((Game.Point > 0) && ((sum == 7) || (sum == Game.Point)))
        {
            dummy = img.FlipH(35, "on", "off", 100, delay);
            delay = puck.Slide(PuckPos[Game.Point], 3, 40, 3, 100, 300, delay);
            newpoint = 0;
        }

        // Primary Bets

        switch (sum)
        {
            case 2:
            case 3:
            {
                if (oldpoint == 0)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Lose(delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Win(1, delay)
                    }
                }

                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Lose(delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Win(1, delay)
                }

                break;
            }

            case 4:
            {
                if (oldpoint == 4)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.PassLineOdds.Amount > 0)
                    {
                        delay = Game.Wager.PassLineOdds.Win(2, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }

                    if (Game.Wager.DontPassOdds.Amount > 0)
                    {
                        delay = Game.Wager.DontPassOdds.Lose(delay);
                    }
                }

                if (Game.Wager.Lay4.Amount > 0)
                {
                    delay = Game.Wager.Lay4.Lose(delay);
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Buy4.Amount > 0)
                    {
                        delay = Game.Wager.Buy4.Win(39 / 20, delay);
                    }
                }

                break;
            }

            case 5:
            {
                if (oldpoint == 5)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.PassLineOdds.Amount > 0)
                    {
                        delay = Game.Wager.PassLineOdds.Win(3 / 2, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }

                    if (Game.Wager.DontPassOdds.Amount > 0)
                    {
                        delay = Game.Wager.DontPassOdds.Lose(delay);
                    }
                }

                if (Game.Wager.Lay5.Amount > 0)
                {
                    delay = Game.Wager.Lay5.Lose(delay);
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Buy5.Amount > 0)
                    {
                        delay = Game.Wager.Buy5.Win(7 / 5, delay);
                    }
                }

                break;
            }

            case 6:
            {
                if (oldpoint == 6)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.PassLineOdds.Amount > 0)
                    {
                        delay = Game.Wager.PassLineOdds.Win(6 / 5, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }

                    if (Game.Wager.DontPassOdds.Amount > 0)
                    {
                        delay = Game.Wager.DontPassOdds.Lose(delay);
                    }
                }

                if (Game.Wager.Lay6.Amount > 0)
                {
                    delay = Game.Wager.Lay6.Lose(delay);
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Buy6.Amount > 0)
                    {
                        delay = Game.Wager.Buy6.Win(7 / 6, delay);
                    }
                }

                break;
            }

            case 7:
            {
                if (oldpoint > 0)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Lose(delay);
                    }

                    if (Game.Wager.PassLineOdds.Amount > 0)
                    {
                        delay = Game.Wager.PassLineOdds.Lose(delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Win(1, delay);
                    }

                    if (Game.Wager.DontPassOdds.Amount > 0)
                    {
                        switch (oldpoint)
                        {
                            case  4:
                            case 10:
                            {
                                delay = Game.Wager.DontPassOdds.Win(1 / 2, delay);
                                break;
                            }

                            case  5:
                            case  9:
                            {
                                delay = Game.Wager.DontPassOdds.Win(2 / 3, delay);
                                break;
                            }

                            case  6:
                            case  8:
                            {
                                delay = Game.Wager.DontPassOdds.Win(5 / 6, delay);
                                break;
                            }
                        }
                    }
                }
                else
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }
                }

                if (Game.Wager.Lay4          .Amount > 0) { delay = Game.Wager.Lay4          .Win (19 / 41, delay); }
                if (Game.Wager.DontCome4     .Amount > 0) { delay = Game.Wager.DontCome4     .Win (1,       delay); }
                if (Game.Wager.DontCome4Odds .Amount > 0) { delay = Game.Wager.DontCome4Odds .Win (1 / 2,   delay); }

                if (Game.Wager.Lay5          .Amount > 0) { delay = Game.Wager.Lay5          .Win (19 / 31, delay); }
                if (Game.Wager.DontCome5     .Amount > 0) { delay = Game.Wager.DontCome5     .Win (1,       delay); }
                if (Game.Wager.DontCome5Odds .Amount > 0) { delay = Game.Wager.DontCome5Odds .Win (2 / 3,   delay); }

                if (Game.Wager.Lay6          .Amount > 0) { delay = Game.Wager.Lay6          .Win (19 / 25, delay); }
                if (Game.Wager.DontCome6     .Amount > 0) { delay = Game.Wager.DontCome6     .Win (1,       delay); }
                if (Game.Wager.DontCome6Odds .Amount > 0) { delay = Game.Wager.DontCome6Odds .Win (5 / 6,   delay); }

                if (Game.Wager.Lay8          .Amount > 0) { delay = Game.Wager.Lay8          .Win (19 / 25, delay); }
                if (Game.Wager.DontCome8     .Amount > 0) { delay = Game.Wager.DontCome8     .Win (1,       delay); }
                if (Game.Wager.DontCome8Odds .Amount > 0) { delay = Game.Wager.DontCome8Odds .Win (5 / 6,   delay); }

                if (Game.Wager.Lay9          .Amount > 0) { delay = Game.Wager.Lay9          .Win (19 / 31, delay); }
                if (Game.Wager.DontCome9     .Amount > 0) { delay = Game.Wager.DontCome9     .Win (1,       delay); }
                if (Game.Wager.DontCome9Odds .Amount > 0) { delay = Game.Wager.DontCome9Odds .Win (2 / 3,   delay); }

                if (Game.Wager.Lay10         .Amount > 0) { delay = Game.Wager.Lay10         .Win (19 / 41, delay); }
                if (Game.Wager.DontCome10    .Amount > 0) { delay = Game.Wager.DontCome10    .Win (1,       delay); }
                if (Game.Wager.DontCome10Odds.Amount > 0) { delay = Game.Wager.DontCome10Odds.Win (1 / 2,   delay); }

                if (Game.Wager.Come4         .Amount > 0) { delay = Game.Wager.Come4         .Lose(delay); }
                if (Game.Wager.Come5         .Amount > 0) { delay = Game.Wager.Come5         .Lose(delay); }
                if (Game.Wager.Come6         .Amount > 0) { delay = Game.Wager.Come6         .Lose(delay); }
                if (Game.Wager.Come8         .Amount > 0) { delay = Game.Wager.Come8         .Lose(delay); }
                if (Game.Wager.Come9         .Amount > 0) { delay = Game.Wager.Come9         .Lose(delay); }
                if (Game.Wager.Come10        .Amount > 0) { delay = Game.Wager.Come10        .Lose(delay); }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Come4Odds     .Amount > 0) { delay = Game.Wager.Come4Odds     .Lose(delay); }
                    if (Game.Wager.Come5Odds     .Amount > 0) { delay = Game.Wager.Come5Odds     .Lose(delay); }
                    if (Game.Wager.Come6Odds     .Amount > 0) { delay = Game.Wager.Come6Odds     .Lose(delay); }
                    if (Game.Wager.Come8Odds     .Amount > 0) { delay = Game.Wager.Come8Odds     .Lose(delay); }
                    if (Game.Wager.Come9Odds     .Amount > 0) { delay = Game.Wager.Come9Odds     .Lose(delay); }
                    if (Game.Wager.Come10Odds    .Amount > 0) { delay = Game.Wager.Come10Odds    .Lose(delay); }
                }
                else if (!betson && (oldpoint == 0))
                {
                    if (Game.Wager.Come4Odds     .Amount > 0) { delay = Game.Wager.Come4Odds     .Push(delay); }
                    if (Game.Wager.Come5Odds     .Amount > 0) { delay = Game.Wager.Come5Odds     .Push(delay); }
                    if (Game.Wager.Come6Odds     .Amount > 0) { delay = Game.Wager.Come6Odds     .Push(delay); }
                    if (Game.Wager.Come8Odds     .Amount > 0) { delay = Game.Wager.Come8Odds     .Push(delay); }
                    if (Game.Wager.Come9Odds     .Amount > 0) { delay = Game.Wager.Come9Odds     .Push(delay); }
                    if (Game.Wager.Come10Odds    .Amount > 0) { delay = Game.Wager.Come10Odds    .Push(delay); }
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Buy4          .Amount > 0) { delay = Game.Wager.Buy4          .Lose(delay); }
                    if (Game.Wager.Buy5          .Amount > 0) { delay = Game.Wager.Buy5          .Lose(delay); }
                    if (Game.Wager.Buy6          .Amount > 0) { delay = Game.Wager.Buy6          .Lose(delay); }
                    if (Game.Wager.Buy8          .Amount > 0) { delay = Game.Wager.Buy8          .Lose(delay); }
                    if (Game.Wager.Buy9          .Amount > 0) { delay = Game.Wager.Buy9          .Lose(delay); }
                    if (Game.Wager.Buy10         .Amount > 0) { delay = Game.Wager.Buy10         .Lose(delay); }
                }

                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Win(1, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Lose(delay);
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Hard4 .Amount > 0) { delay = Game.Wager.Hard4 .Lose(delay); }
                    if (Game.Wager.Hard6 .Amount > 0) { delay = Game.Wager.Hard6 .Lose(delay); }
                    if (Game.Wager.Hard8 .Amount > 0) { delay = Game.Wager.Hard8 .Lose(delay); }
                    if (Game.Wager.Hard10.Amount > 0) { delay = Game.Wager.Hard10.Lose(delay); }
                }

                break;
            }

            case 8:
            {
                if (oldpoint == 8)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.PassLineOdds.Amount > 0)
                    {
                        delay = Game.Wager.PassLineOdds.Win(6 / 5, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }

                    if (Game.Wager.DontPassOdds.Amount > 0)
                    {
                        delay = Game.Wager.DontPassOdds.Lose(delay);
                    }
                }

                if (Game.Wager.Lay8.Amount > 0)
                {
                    delay = Game.Wager.Lay8.Lose(delay);
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Buy8.Amount > 0)
                    {
                        delay = Game.Wager.Buy8.Win(7 / 6, delay);
                    }
                }

                break;
            }

            case 9:
            {
                if (oldpoint == 9)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.PassLineOdds.Amount > 0)
                    {
                        delay = Game.Wager.PassLineOdds.Win(3 / 2, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }

                    if (Game.Wager.DontPassOdds.Amount > 0)
                    {
                        delay = Game.Wager.DontPassOdds.Lose(delay);
                    }
                }

                if (Game.Wager.Lay9.Amount > 0)
                {
                    delay = Game.Wager.Lay9.Lose(delay);
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Buy9.Amount > 0)
                    {
                        delay = Game.Wager.Buy9.Win(7 / 5, delay);
                    }
                }

                break;
            }

            case 10:
            {
                if (oldpoint == 10)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.PassLineOdds.Amount > 0)
                    {
                        delay = Game.Wager.PassLineOdds.Win(2, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }

                    if (Game.Wager.DontPassOdds.Amount > 0)
                    {
                        delay = Game.Wager.DontPassOdds.Lose(delay);
                    }
                }

                if (Game.Wager.Lay10.Amount > 0)
                {
                    delay = Game.Wager.Lay10.Lose(delay);
                }

                if (betson || (oldpoint > 0))
                {
                    if (Game.Wager.Buy10.Amount > 0)
                    {
                        delay = Game.Wager.Buy10.Win(39 / 20, delay);
                    }
                }

                break;
            }

            case 11:
            {
                if (oldpoint == 0)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Win(1, delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Lose(delay);
                    }
                }

                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Win(1, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Lose(delay);
                }

                break;
            }

            case 12:
            {
                if (oldpoint == 0)
                {
                    if (Game.Wager.PassLine.Amount > 0)
                    {
                        delay = Game.Wager.PassLine.Lose(delay);
                    }

                    if (Game.Wager.DontPass.Amount > 0)
                    {
                        delay = Game.Wager.DontPass.Push(delay);
                    }
                }

                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Lose(delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Push(delay);
                }

                break;
            }
        }

        // Specific Come and Don't Come bets

        if (oldpoint > 0)
        {
            if (sum == 4)
            {
                if (Game.Wager.Come4Odds.Amount > 0)
                {
                    delay = Game.Wager.Come4Odds.Win(2, delay);
                }

                if (Game.Wager.Come4.Amount > 0)
                {
                    delay = Game.Wager.Come4.Win(1, delay);
                }

                if (Game.Wager.DontCome4Odds.Amount > 0)
                {
                    delay = Game.Wager.DontCome4Odds.Lose(delay);
                }

                if (Game.Wager.DontCome4.Amount > 0)
                {
                    delay = Game.Wager.DontCome4.Lose(delay);
                }
            }

            if (sum == 5)
            {
                if (Game.Wager.Come5Odds.Amount > 0)
                {
                    delay = Game.Wager.Come5Odds.Win(3 / 2, delay);
                }

                if (Game.Wager.Come5.Amount > 0)
                {
                    delay = Game.Wager.Come5.Win(1, delay);
                }

                if (Game.Wager.DontCome5Odds.Amount > 0)
                {
                    delay = Game.Wager.DontCome5Odds.Lose(delay);
                }

                if (Game.Wager.DontCome5.Amount > 0)
                {
                    delay = Game.Wager.DontCome5.Lose(delay);
                }
            }

            if (sum == 6)
            {
                if (Game.Wager.Come6Odds.Amount > 0)
                {
                    delay = Game.Wager.Come6Odds.Win(6 / 5, delay);
                }

                if (Game.Wager.Come6.Amount > 0)
                {
                    delay = Game.Wager.Come6.Win(1, delay);
                }

                if (Game.Wager.DontCome6Odds.Amount > 0)
                {
                    delay = Game.Wager.DontCome6Odds.Lose(delay);
                }

                if (Game.Wager.DontCome6.Amount > 0)
                {
                    delay = Game.Wager.DontCome6.Lose(delay);
                }
            }

            if (sum == 8)
            {
                if (Game.Wager.Come8Odds.Amount > 0)
                {
                    delay = Game.Wager.Come8Odds.Win(6 / 5, delay);
                }

                if (Game.Wager.Come8.Amount > 0)
                {
                    delay = Game.Wager.Come8.Win(1, delay);
                }

                if (Game.Wager.DontCome8Odds.Amount > 0)
                {
                    delay = Game.Wager.DontCome8Odds.Lose(delay);
                }

                if (Game.Wager.DontCome8.Amount > 0)
                {
                    delay = Game.Wager.DontCome8.Lose(delay);
                }
            }

            if (sum == 9)
            {
                if (Game.Wager.Come9Odds.Amount > 0)
                {
                    delay = Game.Wager.Come9Odds.Win(3 / 2, delay);
                }

                if (Game.Wager.Come9.Amount > 0)
                {
                    delay = Game.Wager.Come9.Win(1, delay);
                }

                if (Game.Wager.DontCome9Odds.Amount > 0)
                {
                    delay = Game.Wager.DontCome9Odds.Lose(delay);
                }

                if (Game.Wager.DontCome9.Amount > 0)
                {
                    delay = Game.Wager.DontCome9.Lose(delay);
                }
            }

            if (sum == 10)
            {
                if (Game.Wager.Come10Odds.Amount > 0)
                {
                    delay = Game.Wager.Come10Odds.Win(2, delay);
                }

                if (Game.Wager.Come10.Amount > 0)
                {
                    delay = Game.Wager.Come10.Win(1, delay);
                }

                if (Game.Wager.DontCome10Odds.Amount > 0)
                {
                    delay = Game.Wager.DontCome10Odds.Lose(delay);
                }

                if (Game.Wager.DontCome10.Amount > 0)
                {
                    delay = Game.Wager.DontCome10.Lose(delay);
                }
            }
        }
        else
        {
            if (sum == 4)
            {
                if (Game.Wager.Come4.Amount > 0)
                {
                    delay = Game.Wager.Come4.Win(1, delay);

                    if (Game.Wager.Come4Odds.Amount > 0)
                    {
                        setTimeout
                        (
                            function()
                            {
                                Obj("Come4Off").Hide();
                            },

                            delay
                        );

                        if (!betson)
                        {
                            delay = Game.Wager.Come4Odds.Push(delay);
                        }
                        else
                        {
                            delay = Game.Wager.Come4Odds.Win(2, delay);
                        }
                    }
                }

                if (Game.Wager.DontCome4.Amount > 0)
                {
                    delay = Game.Wager.DontCome4.Lose(delay);

                    if (Game.Wager.DontCome4Odds.Amount > 0)
                    {
                        delay = Game.Wager.DontCome4Odds.Lose(delay);
                    }
                }
            }

            if (sum == 5)
            {
                if (Game.Wager.Come5.Amount > 0)
                {
                    delay = Game.Wager.Come5.Win(1, delay);

                    if (Game.Wager.Come5Odds.Amount > 0)
                    {
                        setTimeout
                        (
                            function()
                            {
                                Obj("Come5Off").Hide();
                            },

                            delay
                        );

                        if (!betson)
                        {
                            delay = Game.Wager.Come5Odds.Push(delay);
                        }
                        else
                        {
                            delay = Game.Wager.Come5Odds.Win(3 / 2, delay);
                        }
                    }
                }

                if (Game.Wager.DontCome5.Amount > 0)
                {
                    delay = Game.Wager.DontCome5.Lose(delay);

                    if (Game.Wager.DontCome5Odds.Amount > 0)
                    {
                        delay = Game.Wager.DontCome5Odds.Lose(delay);
                    }
                }
            }

            if (sum == 6)
            {
                if (Game.Wager.Come6.Amount > 0)
                {
                    delay = Game.Wager.Come6.Win(1, delay);

                    if (Game.Wager.Come6Odds.Amount > 0)
                    {
                        setTimeout
                        (
                            function()
                            {
                                Obj("Come6Off").Hide();
                            },

                            delay
                        );

                        if (!betson)
                        {
                            delay = Game.Wager.Come6Odds.Push(delay);
                        }
                        else
                        {
                            delay = Game.Wager.Come6Odds.Win(6 / 5, delay);
                        }
                    }
                }

                if (Game.Wager.DontCome6.Amount > 0)
                {
                    delay = Game.Wager.DontCome6.Lose(delay);

                    if (Game.Wager.DontCome6Odds.Amount > 0)
                    {
                        delay = Game.Wager.DontCome6Odds.Lose(delay);
                    }
                }
            }

            if (sum == 8)
            {
                if (Game.Wager.Come8.Amount > 0)
                {
                    delay = Game.Wager.Come8.Win(1, delay);

                    if (Game.Wager.Come8Odds.Amount > 0)
                    {
                        setTimeout
                        (
                            function()
                            {
                                Obj("Come8Off").Hide();
                            },

                            delay
                        );

                        if (!betson)
                        {
                            delay = Game.Wager.Come8Odds.Push(delay);
                        }
                        else
                        {
                            delay = Game.Wager.Come8Odds.Win(6 / 5, delay);
                        }
                    }
                }

                if (Game.Wager.DontCome8.Amount > 0)
                {
                    delay = Game.Wager.DontCome8.Lose(delay);

                    if (Game.Wager.DontCome8Odds.Amount > 0)
                    {
                        delay = Game.Wager.DontCome8Odds.Lose(delay);
                    }
                }
            }

            if (sum == 9)
            {
                if (Game.Wager.Come9.Amount > 0)
                {
                    delay = Game.Wager.Come9.Win(1, delay);

                    if (Game.Wager.Come9Odds.Amount > 0)
                    {
                        setTimeout
                        (
                            function()
                            {
                                Obj("Come9Off").Hide();
                            },

                            delay
                        );

                        if (!betson)
                        {
                            delay = Game.Wager.Come9Odds.Push(delay);
                        }
                        else
                        {
                            delay = Game.Wager.Come9Odds.Win(3 / 2, delay);
                        }
                    }
                }

                if (Game.Wager.DontCome9.Amount > 0)
                {
                    delay = Game.Wager.DontCome9.Lose(delay);

                    if (Game.Wager.DontCome9Odds.Amount > 0)
                    {
                        delay = Game.Wager.DontCome9Odds.Lose(delay);
                    }
                }
            }

            if (sum == 10)
            {
                if (Game.Wager.Come10.Amount > 0)
                {
                    delay = Game.Wager.Come10.Win(1, delay);

                    if (Game.Wager.Come10Odds.Amount > 0)
                    {
                        setTimeout
                        (
                            function()
                            {
                                Obj("Come10Off").Hide();
                            },

                            delay
                        );

                        if (!betson)
                        {
                            delay = Game.Wager.Come10Odds.Push(delay);
                        }
                        else
                        {
                            delay = Game.Wager.Come10Odds.Win(2, delay);
                        }
                    }
                }

                if (Game.Wager.DontCome10.Amount > 0)
                {
                    delay = Game.Wager.DontCome10.Lose(delay);

                    if (Game.Wager.DontCome10Odds.Amount > 0)
                    {
                        delay = Game.Wager.DontCome10Odds.Lose(delay);
                    }
                }
            }
        }

        // Slide Come and Don't Come bets to specific numbers

        if (oldpoint > 0)
        {
            if (sum == 4)
            {
                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Slide(Game.Wager.Come4, Game.Wager.Come.Amount, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Slide(Game.Wager.DontCome4, Game.Wager.DontCome.Amount, delay);
                }
            }

            if (sum == 5)
            {
                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Slide(Game.Wager.Come5, Game.Wager.Come.Amount, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Slide(Game.Wager.DontCome5, Game.Wager.DontCome.Amount, delay);
                }
            }

            if (sum == 6)
            {
                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Slide(Game.Wager.Come6, Game.Wager.Come.Amount, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Slide(Game.Wager.DontCome6, Game.Wager.DontCome.Amount, delay);
                }
            }

            if (sum == 8)
            {
                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Slide(Game.Wager.Come8, Game.Wager.Come.Amount, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Slide(Game.Wager.DontCome8, Game.Wager.DontCome.Amount, delay);
                }
            }

            if (sum == 9)
            {
                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Slide(Game.Wager.Come9, Game.Wager.Come.Amount, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Slide(Game.Wager.DontCome9, Game.Wager.DontCome.Amount, delay);
                }
            }

            if (sum == 10)
            {
                if (Game.Wager.Come.Amount > 0)
                {
                    delay = Game.Wager.Come.Slide(Game.Wager.Come10, Game.Wager.Come.Amount, delay);
                }

                if (Game.Wager.DontCome.Amount > 0)
                {
                    delay = Game.Wager.DontCome.Slide(Game.Wager.DontCome10, Game.Wager.DontCome.Amount, delay);
                }
            }
        }

        // Field

        if (Game.Wager.Field.Amount > 0)
        {
            switch (sum)
            {
                case  2: { delay = Game.Wager.Field.Win(2, delay); break; }
                case  3: { delay = Game.Wager.Field.Win(1, delay); break; }
                case  4: { delay = Game.Wager.Field.Win(1, delay); break; }
                case  9: { delay = Game.Wager.Field.Win(1, delay); break; }
                case 10: { delay = Game.Wager.Field.Win(1, delay); break; }
                case 11: { delay = Game.Wager.Field.Win(1, delay); break; }
                case 12: { delay = Game.Wager.Field.Win(3, delay); break; }
                default: { delay = Game.Wager.Field.Lose(delay); break; }
            }
        }

        // Seven

        if (Game.Wager.AnySeven.Amount > 0)
        {
            if (sum == 7)
            {
                delay = Game.Wager.AnySeven.Win(4, delay);
            }
            else
            {
                delay = Game.Wager.AnySeven.Lose(delay);
            }
        }

        // Hardways

        if (betson || (oldpoint > 0))
        {
            if (Game.Wager.Hard4.Amount > 0)
            {
                if ((die1 == 2) && (die2 == 2))
                {
                    delay = Game.Wager.Hard4.Win(7, delay);
                }
                else if ((sum == 4) || (sum == 7))
                {
                    delay = Game.Wager.Hard4.Lose(delay);
                }
            }

            if (Game.Wager.Hard10.Amount > 0)
            {
                if ((die1 == 5) && (die2 == 5))
                {
                    delay = Game.Wager.Hard10.Win(7, delay);
                }
                else if ((sum == 10) || (sum == 7))
                {
                    delay = Game.Wager.Hard10.Lose(delay);
                }
            }

            if (Game.Wager.Hard6.Amount > 0)
            {
                if ((die1 == 3) && (die2 == 3))
                {
                    delay = Game.Wager.Hard6.Win(9, delay);
                }
                else if ((sum == 6) || (sum == 7))
                {
                    delay = Game.Wager.Hard6.Lose(delay);
                }
            }

            if (Game.Wager.Hard8.Amount > 0)
            {
                if ((die1 == 4) && (die2 == 4))
                {
                    delay = Game.Wager.Hard8.Win(9, delay);
                }
                else if ((sum == 8) || (sum == 7))
                {
                    delay = Game.Wager.Hard8.Lose(delay);
                }
            }
        }

        // Three

        if (Game.Wager.Three.Amount > 0)
        {
            if (sum == 3)
            {
                delay = Game.Wager.Three.Win(15, delay);
            }
            else
            {
                delay = Game.Wager.Three.Lose(delay);
            }
        }

        // Eleven

        if (Game.Wager.Eleven.Amount > 0)
        {
            if (sum == 11)
            {
                delay = Game.Wager.Eleven.Win(15, delay);
            }
            else
            {
                delay = Game.Wager.Eleven.Lose(delay);
            }
        }

        // Two

        if (Game.Wager.Two.Amount > 0)
        {
            if (sum == 2)
            {
                delay = Game.Wager.Two.Win(30, delay);
            }
            else
            {
                delay = Game.Wager.Two.Lose(delay);
            }
        }

        // Twelve

        if (Game.Wager.Twelve.Amount > 0)
        {
            if (sum == 12)
            {
                delay = Game.Wager.Twelve.Win(30, delay);
            }
            else
            {
                delay = Game.Wager.Twelve.Lose(delay);
            }
        }

        // Any Craps

        if (Game.Wager.AnyCraps.Amount > 0)
        {
            if ((sum == 2) || (sum == 3) || (sum == 12))
            {
                delay = Game.Wager.AnyCraps.Win(7, delay);
            }
            else
            {
                delay = Game.Wager.AnyCraps.Lose(delay);
            }
        }

        setTimeout
        (
            function()
            {
                Game.Point = newpoint;
                Game.Update();
            },

            delay
        );
    }
};

window.onload = function()
{
    Game.Initialize();
};

