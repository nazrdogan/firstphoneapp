var smileys = [
        [":)", "smiley.png", true, "smiley-smiley" ],
				[":-D", "bigsmile.png", true, "smiley-bigsmile"],
				[";)", "beatup.png", true, "smiley-beatup"],
				[":-p", "tongue.png", true, "smiley-tongue"],
				[":(", "sad.png", true, "smiley-sad"],
				[":X", "love_struck.gif", true, "smiley-love-struck"],
				[":D", "bigsmile.png", false, "smiley-bigsmile"],
				[";-)", "beatup.png", false, "smiley-beatup"],
				[":p", "tongue.png", false, "smiley-tongue"],
				[":-(", "sad.png", false, "smiley-sad"],
                [":-O", "ooooh.png", true, "smiley-ooooh"],
                [":O", "ooooh.png", false, "smiley-ooooh"],
                [":-B", "smart.png", true, "smiley-smart"],
                [":B", "smart.png", false, "smiley-smart"],
        [":-)", "smiley.png", false, "smiley-smiley"]
		];

function toSource1(obj) 
{
	var output = [], temp;
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			//temp = i + ":";
			switch (typeof obj[i]) {
				case "object" :
					temp = toSource1(obj[i]);
				break;
				case "string" :
					temp = "\"" + (obj[i]) + "\""; 
				break;
				default :
					temp = obj[i];
			}
			output.push(temp);
		}
	}
	return "[" + output.join() + "]";
};

function getUIString(str, max_char)
{
	if ( str && str.length > max_char && str.length > 0)
	{
		str = str.substring(0,max_char-1) + '&#8230;';
	}
	return str;
};

function SetCookie(cookieName,cookieValue,nDays) {
    var today = new Date();
    var expire = new Date();
    if (nDays==null || nDays==0) nDays=90;
    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+escape(cookieValue) + ";expires="+expire.toGMTString()+";path=/;";
};

function ReadCookie(cookieName) {
    var theCookie=""+document.cookie;
    var ind=theCookie.indexOf(cookieName+"=");
    if (ind==-1 || cookieName=="") return "";
    var ind1=theCookie.indexOf(';',ind);
    if (ind1==-1) ind1=theCookie.length;
    return unescape(theCookie.substring(ind+cookieName.length+1,ind1));
};

function normalText(text)
{
	if(!text || text == "") return text;
    text = text.replace(/&amp;/gi, "&");
    text = text.replace(/&lt;/gi, "<");
    text = text.replace(/&gt;/gi, ">");
	text = text.replace(/&quot;/gi, "\"");
    text = text.replace(/&quote;/gi, "\"");
    text = text.replace(/&apos;/gi, "'");
    text = text.replace(/&amp;/gi, "&");
    return text;
};

function xmlSafe(text)
{
    if(!text || text == "") 
        return text;
    text = text.replace(/&/gi, "&amp;");
    text = text.replace(/</gi, "&lt;");
    text = text.replace(/>/gi, "&gt;");
    text = text.replace(/'/gi, "&apos;");
    text = text.replace(/"/gi, "&quot;");
    return text;
};
function __createElement(tag, cls, id, name, mojo)
{
	var ele;
	ele = document.createElement(tag);
	if(cls && cls != "")
		ele.className = cls;
	if(id && id != "")
		ele.id = id;
	if(name && name != "")
		ele.name = name;
  return ele;
};

/*
	Function: deleteElements
		Called to delete an element
*/
function deleteElements(ele)
{
    var p, e, i;
    if(ele)
        e = ele;
	else
		return;

    if(e.childNodes) {
        var len = e.childNodes.length;
        for(i = 0; i < len; i++)
            deleteElements(e.firstChild);
    }
    p = e.parentNode;
    if(p)
        p.removeChild(e);
    delete e;
};


function getIMImage(service,fb)
{
    if(service == "yah")
        return imgPath + "yahoo.png";
    else if(service == "msn")
        return imgPath + "msn.png";
    else if(service == "aim")
        return imgPath + "aim.png";
    else if(service == "jab")
        return imgPath + "gtalk.png";
	else if(service == "icq")
        return imgPath + "icq.png";
    else if((service == "xmpp") && fb && (fb == "face"))
        return imgPath + "facebook.png";
    else if(service == "xmpp")
        return imgPath + "xmpp.png";
    else
        return imgPath + "online.png";
};

function chatSelectorIconPath(service, state, blocked, fb)
{
    if (fb && fb == "face") 
        service = "face";
    else if(service == "yah")
        service = "yahoo";
    else if(service == "jab")
        service = "gtalk";
    else if(service == "aim")
        service = "aol";
        
    var imgPath = service + "_online.png";
    
    
    blocked = (blocked == "no") ? false : true;
	if(state == "online")
	{
		imgPath = (!blocked) ? imgPath : imgPath.replace(/_online/, "_block");
	}
	else if(state == "busy")
	{
		imgPath = (!blocked) ? imgPath.replace(/_online/, "_busy") : imgPath.replace(/\.png$/, "_block.png");
	}
	else if(state == "offline") 
	{
		imgPath = (!blocked) ? imgPath.replace(/_online/, "_offline") : imgPath.replace(/_online/, "_offline_block");
	}
	else
	{
		imgPath = (!blocked) ? imgPath.replace(/_online/, "_away") :  imgPath.replace(/_online/, "_block");
	}
	imgPath = "images/" + imgPath;
	//imgClass = imgPath+imgClass+".png";
	return imgPath;
    
}


function getIMIconClassName(service, state, blocked,fb)
{
	if(fb && fb == "face")
        service = "face";
    var imgClass = service+"_online";
	blocked = (blocked == "no") ? false : true;
	if(state == "online")
	{
		imgClass = (!blocked) ? imgClass : imgClass.replace(/_online/, "_block");
	}
	else if(state == "busy")
	{
		imgClass = (!blocked) ? imgClass.replace(/_online/, "_busy") : imgClass.replace(/\.png$/, "_block.png");
	}
	else if(state == "offline") 
	{
		imgClass = (!blocked) ? imgClass.replace(/_online/, "_offline") : imgClass.replace(/_online/, "_offline_block");
	}
	else
	{
		imgClass = (!blocked) ? imgClass.replace(/_online/, "_away") :  imgClass.replace(/_online/, "_block");
	}
	imgClass = "icon_size " + imgClass;
	//imgClass = imgPath+imgClass+".png";
	return imgClass;
};

function getIMService(im,fb)
{
    if(im == "yah")
        return "Yahoo";
    else if(im == "aim")
        return "AIM";
    else if(im == "msn")
        return "MSN";
    else if(im == "jab")
        return "Gtalk";
	else if(im == "icq")
        return "ICQ";
    else if(im == "oth")
        return "Mundu";
    else if(im == "xmpp" && fb && fb == 'face')
        return "Facebook";
    else if(im == "xmpp")
        return "XMPP";
};


function getIMServiceDisplay(im,fb)
{
    if(im == "yah")
        return "Yahoo";
    else if(im == "aim")
        return "AIM";
    else if(im == "msn")
        return "MSN";
    else if(im == "jab")
        return "Gtalk";
	else if(im == "icq")
        return "ICQ";
    else if((im == "xmpp") && fb && (fb == "face"))
        return "Facebook";
    else if(im == "oth")
        return "Mundu";
    else if(im == "xmpp")
        return "XMPP";
};

function getIMServiceIcon(im,fb)
{
    if(im == "yah")
        return "ayahoo";
    else if(im == "aim")
        return "aaim";
    else if(im == "msn")
        return "amsn";
    else if(im == "jab")
        return "agtalk";
	else if(im == "icq")
        return "aicq";
    else if((im == "xmpp") && fb && (fb == "face"))
        return "aface";
    else if(im == "oth")
        return "mundu";
    else if(im == "xmpp")
        return "axmpp";
};

function getAccountListIMServiceIcon(im,fb)
{
    if(im == "yah")
        return "slyahoo";
    else if(im == "aim")
        return "slaim";
    else if(im == "msn")
        return "slmsn";
    else if(im == "jab")
        return "slgtalk";
	else if(im == "icq")
        return "slicq";
    else if((im == "xmpp") && fb && (fb == "face"))
        return "slface";
    else if(im == "oth")
        return "mundu";
    else if(im == "xmpp")
        return "slxmpp";
};


function im_anyone_supported(service)
{
    for(var i = 0; i < _supported_im_anyone.length; i++)
        if(_supported_im_anyone[i] == service)
            return true;
    return false;
};
function trim(str)
{ 
	if( str == "" ) return str;
    
    return((""+str).replace(/^\s*([\s\S]*\S+)\s*$|^\s*$/,'$1') ); 
};
function addslashes(str) {
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\\"');
//	str=str.replace(/\\/g,'\\\\');
//	str=str.replace(/\0/g,'\\0');
	return str;
};
function stripslashes(str) {
	str=str.replace(/\\'/g,'\'');
	str=str.replace(/\\"/g,'"');
//	str=str.replace(/\\\\/g,'\\');
//	str=str.replace(/\\0/g,'\0');
	return str;
};

function checkloginData(serv ,user,pwd ,remembme, visble)
{
	var username = user;
    var truncatedUser = user;
	var password = pwd;
	var service = serv
	var rememberme = remembme;
	var visible = visble;
	var message ="";

if(user.indexOf("@") != -1)
{
 truncatedUser = user.substr(0,user.indexOf("@"));   
}

	/*if(password=="")
	{
		message = _alert_message_list[_current_language][19][1].replace("%%%",getIMService(service));
		Mojo.Controller.errorDialog(message);
		return false;
	}*/
   
	if(username.length < 5 || (password.length < 5 && password != "") || truncatedUser.length < 3)
	{
		message =	_alert_message_list[_current_language][12][1];
		Mojo.Controller.errorDialog(message);
		return false;
	}
	if(service == "jab" || service == "xmpp" || service == "face") 
    {
		if(username.search(/[ \)\(/\?\|#!\$%\^\&\*~`_"'/\\><,;:\]\[\{\}]/g) >= 0 )
		{
			message = _alert_message_list[_current_language][5][1];
			Mojo.Controller.errorDialog(message);
			return false;
		}
		if(password.search(/"/g) >= 0 )
		{
			message = _alert_message_list[_current_language][6][1];
			Mojo.Controller.errorDialog(message);
			return false;
		}
	}
	if(service == "msn") 
    {
		if(username.search(/[ \)\(/\?\|#!\$%\^\&\*~`"'/\\><,;:\]\[\{\}]/g) >= 0 )
		{
			message = _alert_message_list[_current_language][7][1];
			Mojo.Controller.errorDialog(message);
			return false;
	    }
    }
	if(service == "aim") 
    {
		if((username.search(/[\)\(/\?\|#!\$%\^\&\*\-~`_\."'/\\><,;:\]\[\{\}]/g) >= 0 || username.search(/[a-z]+/ig) < 0) && username.search(/[ \)\(/\?\|#!\$%\^\&\*~`"'/\\><,;:\]\[\{\}]/g) >= 0 )
		{
			message = _alert_message_list[_current_language][8][1];
			Mojo.Controller.errorDialog(message);
			return false;
		}
	    username = username.replace(/[ ]/gi, "");
		if(password.search(/"_\-\+\=",\./g) >= 0 )
		{
			message = _alert_message_list[_current_language][9][1];
			Mojo.Controller.errorDialog(message);
			return false;
		}
	}
	if(service == "yah")
	{
		if(username.search(/[ \)\(/\?\|#!\$%\^\&\*\-~`"'/\\><,;:\]\[\{\}]/g) >= 0 )
		{
			message =_alert_message_list[_current_language][10][1];
	    	Mojo.Controller.errorDialog(message);
			return false;
		}
	}

	/*if((service == "jab" || service == "oth" || service == "msn") && username.search(/@.*\.com$/) < 1)
	{
		message = _alert_message_list[_current_language][11][1];
		Mojo.Controller.errorDialog(message);
		return false;
	}*/
	return true;
}


function checkLoggedIn(service, username)
{
	if(service == "")
	{
	//&& (_m_client.login_list[service_supported[cnt]]['count'] > 0)
    	for(var cnt=0;cnt < service_supported.length;cnt++)
			if(_m_client.login_list[service_supported[cnt]] )
				return true;
		return false;
	}
	else
	{
		if (_m_client.login_list[service]) 
        {
             for (var k = 0; k < _m_client.login_list[service]['count'].length; k++) 
                 if(_m_client.login_list[service]['count'][k] == username)
                    return true;
             return false;
        }
        else 
            return false;
	}
};
