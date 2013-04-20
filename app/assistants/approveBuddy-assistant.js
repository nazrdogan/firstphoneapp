function ApproveBuddyAssistant(sceneAssistant,callbackFunc,service, username, buddy, exists) {
this.sceneAssistant = sceneAssistant;
this.controller = sceneAssistant.controller;
this.callbackFunc = callbackFunc;
this.service = service;
this.username = username;
this.buddy = buddy;
}

ApproveBuddyAssistant.prototype.setup = function(widget) {

    this.widget = widget;
    this.controller.get("buddyInfo").innerHTML = this.service+ this.username+this.buddy;

    this.ok = this.ok.bindAsEventListener(this);
    this.cancel = this.cancel.bindAsEventListener(this);
    
    Mojo.Event.listen(this.controller.get('ok'),Mojo.Event.tap,this.ok);
    Mojo.Event.listen(this.controller.get('cancel'),Mojo.Event.tap,this.cancel);
};

ApproveBuddyAssistant.prototype.ok = function(event)
{
    this.callbackFunc(this.service+":"+this.username+":"+this.buddy+":authorize");
    this.widget.mojo.close();    
}   

ApproveBuddyAssistant.prototype.cancel = function(event)
{
    this.callbackFunc(this.service+":"+this.username+":"+this.buddy+":deny");
    this.widget.mojo.close();
}   


ApproveBuddyAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ApproveBuddyAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ApproveBuddyAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
