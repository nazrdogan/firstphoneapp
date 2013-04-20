function StatusAssistant(sceneAssistant,callbackFunc)
{
    this.callbackFunc = callbackFunc;
    this.sceneAssistant = sceneAssistant;
    this.controller = sceneAssistant.controller;
}

StatusAssistant.prototype.setup = function(widget)
{
    this.widget = widget;
    this.controller.get("lblstatus").innerHTML = 'Set your Status :';
    this.controller.setupWidget("customMessageTextfield", this.statusAttributes = 
    {
        hintText: $L('..having lunch!'),
        modelProperty: 'original',
        multiline: true,
        preventCancel: false
    }, this.statusModel = 
    {
        'original': this.sceneAssistant.customMessage,
        value: ''
    });
    showconsole("THIS IS THE CUSTOM MESSAGE : "+this.sceneAssistant.customMessage);
    this.ok = this.ok.bindAsEventListener(this);
    this.cancel = this.cancel.bindAsEventListener(this);
    
    Mojo.Event.listen(this.controller.get('okStatus'),Mojo.Event.tap,this.ok);
    Mojo.Event.listen(this.controller.get('cancelStatus'),Mojo.Event.tap,this.cancel);
}

StatusAssistant.prototype.activate = function(event)
{
}

StatusAssistant.prototype.deactivate = function(event)
{
}

StatusAssistant.prototype.cleanup = function(event)
{
}

StatusAssistant.prototype.ok = function(event)
{
    var msg = this.statusModel['original'];
    this.callbackFunc(msg);
    this.widget.mojo.close();    
}   

StatusAssistant.prototype.cancel = function(event)
{
    this.callbackFunc(this.sceneAssistant.customMessage);
    this.widget.mojo.close();
}   
