function NewgroupAssistant(sceneAssistant,callbackFunc,accountName) {
	this.callbackFunc = callbackFunc;
    this.sceneAssistant = sceneAssistant;
    this.controller = sceneAssistant.controller;
    this.accountName = accountName;
}

NewgroupAssistant.prototype.setup = function(widget) 
{
    this.widget = widget;   
    
    this.controller.get("lblgrp").innerHTML = this.accountName;
    this.controller.setupWidget("group", this.groupAttributes = 
    {
        hintText: $L('Group Name'),
        modelProperty: 'original'
    }, this.groupModel = 
    {
        'original': '',
        value: ""
    });
    try 
    {
        this.ok = this.ok.bindAsEventListener(this);
        this.cancel = this.cancel.bindAsEventListener(this);
        
        Mojo.Event.listen(this.controller.get('okGroup'), Mojo.Event.tap, this.ok);
        Mojo.Event.listen(this.controller.get('cancelgroup'), Mojo.Event.tap, this.cancel);
    }
    catch(er){showconsole("error in newgroup setup"+er);}
};

NewgroupAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

NewgroupAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

NewgroupAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

NewgroupAssistant.prototype.ok = function(event)
{
    var grp = this.groupModel['original'];
    if( grp.length == 0 )
    {
        return;    
    }    
    this.callbackFunc(grp);
    this.widget.mojo.close();    
}   

NewgroupAssistant.prototype.cancel = function(event)
{
    //this.callbackFunc("");
    this.widget.mojo.close();
}   
