function NotificationAssistant(argFromPusher)
{
    this.passedArgument = argFromPusher;
    this._new_unread_messages = 0 ;
};

NotificationAssistant.prototype.setup = function()
{
    try 
    {
        this.closeNotification = NotificationAssistant.prototype.closeNotification;
        this.service = this.passedArgument.message.split(":")[0];
        this.buddyname = this.passedArgument.message.split(":")[1];
        this.username = this.passedArgument.message.split(":")[2];
        this.message = getUIString(this.passedArgument.message.split(":")[3], 35);
        this._new_unread_messages++;
        
        this.controller.get('info').update(this._new_unread_messages+" unread message..");
       /* if (_m_client._m_buddy_list._buddies[this.service][this.username][this.buddyname].alias && _m_client._m_buddy_list._buddies[this.service][this.username][this.buddyname].alias != "") 
            this.controller.get('senderId').update(_m_client._m_buddy_list._buddies[this.service][this.username][this.buddyname].alias);
        else 
            this.controller.get('senderId').update(this.buddyname);
        this.controller.get('userId').update(this.username);
        this.controller.get('messageId').update(this.message);
        */
       
        Mojo.Event.listen(this.controller.get('info'), Mojo.Event.tap, this.testcall.bind(this));
    } 
    catch (er) 
    {
        showconsole(" NotificationAssistant.prototype.setup : " + er);
    }
    
};


NotificationAssistant.prototype.testDashboard = function(service, buddyname, username, message)
{
    this.service = service;
    this.buddyname = buddyname;
    this.username = username;
    this.message = message;
    
    this._new_unread_messages++;
    this.controller.get('info').update(this._new_unread_messages+" unread messages..");
    /*this.controller.get('senderId').update(this.buddyname);
    this.controller.get('userId').update(this.username);
    this.controller.get('messageId').update(this.message);*/
};

NotificationAssistant.prototype.closeNotification = function()
{
    this.controller.window.close();
};


NotificationAssistant.prototype.testcall = function(event)
{
    try 
    {
        if (!_m_buddy_list.buddy_window[this.service] || !_m_buddy_list.buddy_window[this.service][this.username] || !_m_buddy_list.buddy_window[this.service][this.username][this.buddyname] || (!_m_buddy_list.buddy_window[this.service][this.username][this.buddyname].is_minimized && !_m_buddy_list.buddy_window[this.service][this.username][this.buddyname].is_hidden)) 
            _m_buddy_list.create_buddy_window(this.service, this.username, this.buddyname, true);
        
        _m_client._m_buddy_list.buddy_window[this.service][this.username][this.buddyname].is_closed = false;
        
        var temp = Mojo.Controller.stageController.getScenes();
        var i;
        for (i = 0; i < temp.length; i++) 
            if (temp[i].sceneName == 'chat') 
            {
                break;
            }
        
                //if (Mojo.appPath != "file:///media/cryptofs/apps/usr/palm/applications/com.geodesic.im/")
        {
            this.controller.serviceRequest('palm://com.palm.applicationManager', 
            {
                method: 'open',
                parameters: 
                {
                    id: 'com.geodesic.im',
                    params: 
                    {
                        target: Mojo.appPath
                        //target : "http://audioplayer.wunderground.com/KCASARATOGA/Saratoga.mp3"
                    }
                },
                onSuccess: function(status)
                {
                    Mojo.Log.error("mojo path : " + Mojo.appPath);
                },
                onFailure: function(status)
                {
                
                },
                onComplete: function()
                {
                
                }
            });
        }
        if (i == temp.length) 
        {
            try 
            {
                if (buddies_this.searchFor) 
                {
                    buddies_this.searchFor = "";
                    buddies_this.controller.get('buddiesHeaderId').innerHTML = 'Buddies';
                    buddies_this._after_finishing_search();
                }
            }catch(er){showconsole("error in ooooo : "+er);}
            this._new_unread_messages = 0 ;
            Mojo.Controller.stageController.assistant.showScene({
                'name': 'chat',
                'disableSceneScroller': true
            }, this.service+":"+this.username+":"+this.buddyname+":"+this.passedArgument.message.split(":")[3]);
            //Mojo.Controller.stageController.assistant.showScene('chat', this.service+":"+this.username+":"+this.buddyname+":"+this.passedArgument.message.split(":")[3]);
        }
        handleNewBuddyPing(this.service, this.buddyname, this.username, this.message);
    } 
    catch (er) 
    {
        showconsole("what the error is mann " + er);
    }
    this.closeNotification();
};


NotificationAssistant.prototype.activate = function(event)
{
    /*var audioElem = AudioTag.extendElement($('test'));
     audioElem.src = "/home/mehul/music/terebin.mp3";
     var audio = $('test');
     audio.play();*/
    /*
     var obj = new Audio();
     obj.palm.audioClass = Media.AudioClass.MEDIA;
     obj.src = "/home/mehul/music/terebin.mp3";
     obj.play();
     */
};


NotificationAssistant.prototype.deactivate = function(event)
{
};


NotificationAssistant.prototype.cleanup = function(event)
{
};
