function PreferencesAssistant(prev)
{
    _m_client.prefChanged = false;
    this.prevScene = prev;
}

PreferencesAssistant.prototype.setup = function()
{
    var pref_this = this;
    showOfflineBuddiesValue = (_m_client.showOfflineBuddy == true) ? true : false;
    showOfflineBuddiesAttr = 
    {
        modelProperty: "value",
        trueValue: true,
        trueLabel: "yes",
        falseValue: false,
        falseLabel: "no"
    }
    showOfflineBuddiesModel = 
    {
        value: showOfflineBuddiesValue,
        disabled: false
    }, this.controller.setupWidget("showOfflineBuddies", showOfflineBuddiesAttr, showOfflineBuddiesModel);
    
    vibrateAlertsAttr = 
    {
        modelProperty: "value",
        trueValue: true,
        trueLabel: "on",
        falseValue: false,
        falseLabel: "off"
    }
    vibrateAlertsModel = 
    {
        value: _m_client.vibrateAlerts,
        disabled: false
    }, this.controller.setupWidget("vibrateAlert", vibrateAlertsAttr, vibrateAlertsModel);
    
    darkThemeAttr = 
    {
        modelProperty: "value",
        trueValue: true,
        trueLabel: "on",
        falseValue: false,
        falseLabel: "off"
    }
    darkThemeModel = 
    {
        value: _m_client.darkTheme,
        disabled: false
    }, this.controller.setupWidget("darkTheme", darkThemeAttr, darkThemeModel);
    
    soundAlertsAttr = 
    {
        modelProperty: "value",
        trueValue: true,
        trueLabel: "on",
        falseValue: false,
        falseLabel: "off"
    }
    soundAlertsModel = 
    {
        value: _m_client.soundAlerts,
        disabled: false
    }, this.controller.setupWidget("soundAlert", soundAlertsAttr, soundAlertsModel);
    
    this.controller.setupWidget("removeAllAccounts", 
    {
        type: Mojo.Widget.Button
    }, 
    {
        "buttonLabel": _client_labels[_current_language][36],
        "disabled": false
    });
    
    this.controller.setupWidget("statusTxt", this.statusAttributes = 
    {
        hintText: 'status message',
        inputName: $L('statusTxt'),
        multiline: true,
        modelProperty: 'original'
    }, this.statusModel = 
    {
        'original': _m_client.customMessage,
        value: "",
    });
    
    this.statuses = [
    {
        label: $L('Available'),
        value: "available",
        iconPath: 'images/available.png'
    }, 
    {
        label: $L('Busy'),
        value: "busy",
        iconPath: 'images/busy.png'
    }, 
    {
        label: $L('Away'),
        value: "away",
        iconPath: 'images/away.png'
    }];
    this.selectorsModel = 
    {
        currentStatus: _m_client.status
    };
    this.controller.setupWidget('statusSelector', 
    {
        label: $L('Status'),
        choices: this.statuses,
        modelProperty: 'currentStatus'
    }, this.selectorsModel);
    
    
    this.handleStatusSelect = this.handleStatusSelect.bindAsEventListener(this);
    this.handleCustomMessage = this.handleCustomMessage.bindAsEventListener(this);
    // Listeners
    Mojo.Event.listen(this.controller.get("statusTxt"), Mojo.Event.propertyChange, this.handleCustomMessage);
    Mojo.Event.listen(this.controller.get("statusSelector"), Mojo.Event.propertyChange, this.handleStatusSelect);
    Mojo.Event.listen(this.controller.get("showOfflineBuddies"), Mojo.Event.propertyChange, this.handlePreferences);
    Mojo.Event.listen(this.controller.get("vibrateAlert"), Mojo.Event.propertyChange, this.handlePreferences);
    Mojo.Event.listen(this.controller.get("darkTheme"), Mojo.Event.propertyChange, this.handlePreferences);
    Mojo.Event.listen(this.controller.get("soundAlert"), Mojo.Event.propertyChange, this.handlePreferences);
};

PreferencesAssistant.prototype.handleCustomMessage = function(event)
{
    _m_client.customMessage = this.statusModel['original'];
    if (_m_client.customMessage != "") 
        _m_client._con.set_status("14", _m_client.customMessage);
    else 
    {
        switch (_m_client.status)
        {
            case 'available':
                _m_client._con.set_status(1, 'available');
                break;
                
            case 'busy':
                _m_client._con.set_status(2, 'busy');
                break;
                
            case 'away':
                _m_client._con.set_status(4, 'away');
                break;
                
            default:
                _m_client._con.set_status(1, 'available');
                _m_client.status = 'available';
                break;
        }
    }
}

PreferencesAssistant.prototype.handleStatusSelect = function(event)
{
    if (this.selectorsModel.currentStatus) 
    {
        switch (this.selectorsModel.currentStatus)
        {
            case 'available':
                _m_client._con.set_status(1, 'available');
                _m_client.status = 'available';
                break;
                
            case 'busy':
                _m_client._con.set_status(2, 'busy');
                _m_client.status = 'busy';
                break;
                
            case 'away':
                _m_client._con.set_status(4, 'away');
                _m_client.status = 'away';
                break;
            default:
                break;
        }
    }
    this.prefsCookie = new Mojo.Model.Cookie('preferences');
    this.prefsCookie.put(
    {
        showOfflineBuddy: _m_client.showOfflineBuddy,
        vibrateAlerts: _m_client.vibrateAlerts,
        soundAlerts: _m_client.soundAlerts,
        status: _m_client.status,
        customMessage: _m_client.customMessage
    });
}

PreferencesAssistant.prototype.handlePreferences = function(event)
{
    //showconsole('element : ' + event.currentTarget.id );
    if (event.currentTarget.id == "showOfflineBuddies") 
    {
        //_m_client.showOfflineBuddy = showOfflineBuddiesModel.value;
        try 
        {
            if (buddies_this) 
                buddies_this.showHideOfflineBuddy();
            _m_client.prefChanged = !(_m_client.prefChanged);
        } 
        catch (er) 
        {
            showconsole(er + " handlePrefe");
        }
        //showconsole("PREFERENCES [SHOW OFFLINE BUDDIES] : " + _m_client.showOfflineBuddy);
    }
    else if (event.currentTarget.id == "vibrateAlert") 
    {
        _m_client.vibrateAlerts = vibrateAlertsModel.value
        //showconsole("PREFERENCES [VIBRATE] : " + _m_client.vibrateAlerts);
    }
    else if (event.currentTarget.id == "soundAlert") 
    {
        _m_client.soundAlerts = soundAlertsModel.value;
        //showconsole("PREFERENCES [SOUND] : " + _m_client.soundAlerts);
    }
    else if (event.currentTarget.id == "darkTheme") 
    {
        _m_client.darkTheme = darkThemeModel.value;
        if (_m_client.darkTheme == true) 
        {
            $$('body')[0].removeClassName('palm-default');
            $$('body')[0].addClassName('palm-dark');
        }
        else if (_m_client.darkTheme == false) 
        {
            $$('body')[0].addClassName('palm-default');
            $$('body')[0].removeClassName('palm-dark');
        }
        
        
    }
    
    this.prefsCookie = new Mojo.Model.Cookie('preferences');
    this.prefsCookie.put(
    {
        showOfflineBuddy: _m_client.showOfflineBuddy,
        vibrateAlerts: _m_client.vibrateAlerts,
        soundAlerts: _m_client.soundAlerts,
        status: _m_client.status,
        darkTheme: _m_client.darkTheme,
        customMessage: _m_client.customMessage
    });
};

PreferencesAssistant.prototype.activate = function(event)
{
};

PreferencesAssistant.prototype.deactivate = function(event)
{
    try 
    {
        if (_m_client.prefChanged) 
        {
            if (this.prevScene == 'buddies') 
            {
                Mojo.Controller.stageController.assistant.changeScene('buddies');
                _m_client.prefChanged = false;
            }
        }
    } 
    catch (er) 
    {
        showconsole("error in deactivate of pref : " + er);
    }
};

PreferencesAssistant.prototype.cleanup = function(event)
{
    Mojo.Event.stopListening(this.controller.get("showOfflineBuddies"), Mojo.Event.propertyChange, this.handlePreferences);
    Mojo.Event.stopListening(this.controller.get("vibrateAlert"), Mojo.Event.propertyChange, this.handlePreferences);
    Mojo.Event.stopListening(this.controller.get("soundAlert"), Mojo.Event.propertyChange, this.handlePreferences);
};
