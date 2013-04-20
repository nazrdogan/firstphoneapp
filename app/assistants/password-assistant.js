function PasswordAssistant(sceneAssistant,callbackFunc,accountName)
{
    this.callbackFunc = callbackFunc;
    this.sceneAssistant = sceneAssistant;
    this.controller = sceneAssistant.controller;
    this.accountName = accountName;
}

PasswordAssistant.prototype.setup = function(widget)
{
    this.widget = widget;
    this.controller.get("lblpwd").innerHTML = this.accountName;
    this.controller.setupWidget("password", this.passwordAttributes = 
    {
        hintText: $L('Type Password'),
        modelProperty: 'original'
    }, this.passwordModel = 
    {
        'original': '',
        value: ""
    });
    
    this.ok = this.ok.bindAsEventListener(this);
    this.cancel = this.cancel.bindAsEventListener(this);
    
    Mojo.Event.listen(this.controller.get('ok'),Mojo.Event.tap,this.ok);
    Mojo.Event.listen(this.controller.get('cancel'),Mojo.Event.tap,this.cancel);
}

PasswordAssistant.prototype.activate = function(event)
{
}

PasswordAssistant.prototype.deactivate = function(event)
{
}

PasswordAssistant.prototype.cleanup = function(event)
{
}

PasswordAssistant.prototype.ok = function(event)
{
    var pwd = this.passwordModel['original'];
    if( pwd.length == 0 )
    {
        return;    
    }    
    this.callbackFunc(pwd);
    this.widget.mojo.close();    
}   

PasswordAssistant.prototype.cancel = function(event)
{
    this.callbackFunc("");
    this.widget.mojo.close();
}   
