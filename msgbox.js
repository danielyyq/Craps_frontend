var MessageBox =
{
    Hide : function()
    {
        Game.HotSpot.ButtonMsgBox.Disable();
        Obj("msgbox").Hide();
        setTimeout(Game.Update, 1);
    },

    Show : function(title, text)
    {
        Game.DisableInput();

        Obj("msgbox_title").innerHTML = Font.Write(Color.White, title);
        Obj("msgbox_text" ).innerHTML = Font.Write(Color.Black, text );

        Obj("msgbox").Show();

        Game.HotSpot.ButtonMsgBox.Enable();
    }
};
