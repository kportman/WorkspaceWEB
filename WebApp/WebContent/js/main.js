StatusNumbers = 
{
    ESCIsPressed: 0,
    StatusIsReady: 4,    
    EnterButtonPushed : 13,
    StatusIsOk : 200,
    StatusResponseReceived: 300,
    StatusCodeNotModified: 304
}

TagNames = 
{
    qr: "qr",
    mtf: "my-team-folders",
    windowLink: " .window-link",
    updateChanges: ".update-new-changes",
    removeAllLinks: ".remove-all-links",
    sel: ".sel",
    sett: ".set-box",
    notifs: ".notifications",
    navig: ".nav-section",
    act: ".action-list",
    mnu: ".menu-caption"
}

var getQA = function (qA) 
{
	var k = 4;
    var l = 0;
    if (qA !== undefined) 
    {
        for (var i = 0; i < qA.length; i++) 
        {
        	document.querySelectorAll(TagNames.navig)[i].innerHTML = "<p>" + qA[i].label + "</p>" + document.querySelectorAll(TagNames.navig)[i].innerHTML;
        	document.querySelectorAll(TagNames.navig)[i].style.background = "black url(./img/icons/" + qA[i].icon + ".png)  left 50% top 77px no-repeat";
        	document.querySelectorAll(TagNames.navig)[i].addEventListener("focus", function (e) { this.querySelector(TagNames.act).style.display = "block";}, false);
        	document.querySelectorAll(TagNames.navig)[i].addEventListener("mouseleave", function (e) 
            {
        	    if (document.activeElement === this) 
                {
        	        this.blur();
        	        this.querySelector(TagNames.act).style.display = "none";
        	    }
        	}, false);
        }
        for (i = 0; i < qA.length; i++) 
        {
        	document.querySelectorAll(TagNames.mnu)[i].innerHTML = "<p>" + qA[i].actionsLabel + "</p>";
        }
      
        var start = "<li>" + "<a href=\"";
        var tabIndex = "\" tabindex=\"";
        var end = "\"></a></li>";
        for (i = 0; i < qA.length; i++) 
        {
            for (var j = 0; j < qA[i].actions.length; j++) 
            {
            	document.querySelectorAll(TagNames.act)[i].innerHTML += start + qA[i].actions[j].url + tabIndex + k + end;
                document.querySelectorAll(TagNames.act + " li >a")[l].innerHTML =  qA[i].actions[j].label;
                ++l; ++k;
            }
            k++;
        }
    }
};
var helpF = function(info)
{
	for (var i = 0; i < info.length; i += 2) 
	{
        if (( info[i + 1].value != null && info[i + 1].value != "") || 
            ( info[i].value != null && info[i].value != "")) {
            info[i].required = true;
            info[i + 1].required = true;
            ok = false;
            if (( info[i + 1].value != null && info[i + 1].value != "") && 
                ( info[i].value != null && info[i].value != "")) {
                ok = true;
            }
        }
        if (( info[i + 1].value == null || info[i + 1].value == "") && 
            ( info[i].value == null || info[i].value == "")) {
            info[i].required = false;
            info[i + 1].required = false;
            ok = true;
        }
    }
	return ok;
}

var getCon = function (url, options) 
{
    if((Object.prototype.toString.call(options) !== Object.prototype.toString.call({})))
    {
        options = {};
    }
    var req = new XMLHttpRequest(), method = 'GET', options
    if (options.method) 
    {
        method = options.method;
    }
    req.open(method.toUpperCase(), url);
    req.onreadystatechange = function () 
    {
        if((req.readyState === StatusNumbers.StatusIsReady) && ((req.status >= StatusNumbers.StatusIsOk 
            && req.status < StatusNumbers.StatusResponseReceived) || req.status === StatusNumbers.StatusCodeNotModified))    
        {
            var res = req.responseText;
            var contentType = req.getResponseHeader('Content-Type');
            if ((contentType) && (contentType === 'text/json' || contentType === 'application/json'))
            {
                try 
                {
                    res = JSON.parse(res);
                }
                catch (err) 
                {
                    if (options.fail) 
                    {
                        options.fail.call(req, err);
                        return;
                    }
                }
            } 
            else if (contentType === 'text/xml' || contentType === 'application/xml') 
            {
                res = req.responseXML;
                if (res === null && options.fail) 
                {
                    options.fail.call(req, 'XML invalid');
                    return;
                }
            }
         }
            if (options.done) 
            {
                options.done.call(req, res);
            }
    };
    req.send(null);
};



var refresh = function (tabName) 
{
    var info = document.querySelectorAll("." + tabName + " .name" + ", ." + tabName + " .url");
    fill(info,tabName);
    var enc = "." + tabName + " " + TagNames.sel;
    var indicator = true;
    document.querySelector(enc).innerHTML = "";
    for (var i = 0; i < info.length; i++) 
    {
        if (info[i].value != null && info[i].value != "") 
        {
            if (i == 0) 
            {
                document.querySelector(enc).innerHTML = document.querySelector(enc).innerHTML + "<li>" + info[i].value + "</li>";
                document.querySelectorAll(enc + " li")[0].title = info[i + 1].value;
                document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + TagNames.windowLink).src = info[i + 1].value;
                document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + " .expand-icon").href = info[i + 1].value;
            }
            document.querySelector(enc).innerHTML = document.querySelector(enc).innerHTML + "<li>" + info[i].value + "</li>";
            document.querySelectorAll(enc + " li")[i / 2 + 1].title = info[i + 1].value;
            indicator = false;
        }
        i++;
    }
    if (indicator == true) 
    {
        document.querySelector(enc).style.display = "none";
        document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + TagNames.windowLink).src = "";
        document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + " .expand-icon").href = "";
    }
    else 
    {
        document.querySelector(enc).style.display = "block";
        var listItems = document.querySelectorAll(enc + " li");
        for (i = 0; i < listItems.length; i++) 
        {
            listItems[i].addEventListener("click", function() {openIframe(this,tabName);});
        }
        var settingsDiv = document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + " .settings");
        setStyle(settingsDiv);
        document.querySelector("." + tabName + " " + TagNames.sett).style.backgroundColor = "transparent";
        listItems[0].click();
    }
};

var pushSave = function (currentTag, parentClass) 
{
    var info = document.querySelectorAll("." + parentClass + " .name ," + "." + parentClass + " .url");
    var ok = true;
    ok = helpF(info);
    if (ok == true && learnRegExp(currentTag))  
    {
    	var indicator = true;
        var enc = parentClass + ":.+?;";
        localStorage.webApp = localStorage.webApp.replace(new RegExp(enc, "g"), "");
        for (var i = 0; i < info.length; i++) 
        {
            if (info[i].value != null && info[i].value != "") 
            {
                localStorage.webApp = localStorage.webApp + parentClass + ":" + info[i].id + "=" + info[i].value + ";";
            }
        }
        enc = "." + parentClass + " " + TagNames.sel;
        document.querySelector(enc).innerHTML = "";
        for (var i = 0; i < info.length; i++) 
        {
            if (info[i].value != null && info[i].value != "") 
            {
                if (i == 0) 
                {
                    document.querySelector(enc).innerHTML = document.querySelector(enc).innerHTML + "<li>" + info[i].value + "</li>";
                    document.querySelectorAll(enc + " li")[0].title = info[i + 1].value;
                }
                document.querySelector(enc).innerHTML = document.querySelector(enc).innerHTML + "<li>" + info[i].value + "</li>";
                document.querySelectorAll(enc + " li")[i / 2 + 1].title = info[i + 1].value;
                indicator = false;
            }
            i++;
        }
        if (indicator == true) 
        {
            document.querySelector(enc).style.display = "none";
            document.querySelector("." + parentClass + TagNames.windowLink).src = "";
            document.querySelector("." + parentClass + " .expand-icon").href = "";
        }
        else 
        {
            document.querySelector(enc).style.display = "block";
            for (i = 0; i < document.querySelectorAll(enc + " li").length; i++) 
            {
                document.querySelectorAll(enc + " li")[i].addEventListener("click", function() {openIframe(this,parentClass);});
            }
        }
        document.querySelector("." + parentClass + " .settings-icon").click();
        document.querySelectorAll(enc + " li")[0].click();
    }
};

var tabUp = function (pics) 
{
    for (var i = 0; i < document.querySelectorAll(".tabs >ul li a").length; i++) 
    {
    	document.querySelectorAll(".tabs >ul li a")[i].innerHTML = "<i class=\"" + pics.preferences.fontPref.prefix + pics.icons[i].icon.tags[0] + "\"></i>" + document.querySelectorAll(".tabs >ul li a")[i].innerHTML;
    }
    if (window.location.href.indexOf("#") == -1) 
    {
        document.querySelector(".tabs>ul>li").className += "active-tab";
        document.querySelector(".tabs>div").style.display = "block";
    }
    else
    {
        var remem = window.location.href.substring(window.location.href.indexOf("#"));
        document.querySelector("a[href=\"" + remem + "\"]").parentNode.className = "active-tab";
        document.querySelector(remem).style.display = "block";
    }
    window.addEventListener("hashchange", function (e) 
    {
        for (var i = 0; i < document.querySelectorAll(".tabs > div").length; i++) 
        {
        	document.querySelectorAll(".tabs > div")[i].style.display = "none";
        }
        document.querySelector(e.newURL.substring(e.newURL.indexOf("#"))).style.display = "block";
        document.querySelector(".active-tab").className = "";
        document.querySelector("a[href=\"" + e.newURL.substring(e.newURL.indexOf("#")) + "\"]").parentNode.className = "active-tab";
    }, false);

};

var fill = function(info, tabName)
{
	 for (i = 0; i < info.length; i++) 
     {
	        var str = tabName + ":" + info[i].id + "=";
	        if (localStorage.webApp.indexOf(str) != -1) 
	        {
	            var i = localStorage.webApp.indexOf(str) + str.length;
	            var j = localStorage.webApp.indexOf(";", i);
	            info[i].value = localStorage.webApp.substring(i, j);
	        }
     }
}

var setSettings = function(currentTag, parentClass) 
{
        var settingsDiv = document.querySelector("." + parentClass + "> .settings");
        if (settingsDiv.style.display == "none") {
            settingsDiv.style.display = "block";
            settingsDiv.style.height = "45%";
            currentTag.parentNode.style.backgroundColor = "white";
            document.querySelector("." + parentClass + " .name").focus();
        }
        else
        {
            setStyle(settingsDiv);
            currentTag.parentNode.style.backgroundColor = "transparent";
        }
};
var setCancel = function (currentTag, parentClass) 
{
    for (var i = 0; i < document.querySelectorAll("." + parentClass + " .url ," + "." + parentClass + " .name").length; ++i) 
    {
        document.querySelectorAll("." + parentClass + " .url ," + "." + parentClass + " .name")[i].value = "";
    }
    var settingsDiv = document.querySelector("." + parentClass + " .settings");
    setStyle(settingsDiv);
    document.querySelector("." + parentClass + " " + TagNames.sett).style.backgroundColor = "transparent";
    refresh(parentClass);
};

var procData = function (data) 
{
    if (data !== undefined && data.notification !== undefined) {
        document.querySelector(TagNames.notifs).innerHTML = "<p>" + data.notification + "</p>";
    }
    getQA(data.quickActions);
    if (localStorage.webApp != "" && localStorage.webApp != null) {
        refresh(TagNames.qr);
        refresh(TagNames.mtf);
    } else {
        localStorage.webApp = "";
    }
}
function start() 
{
    getCon("data/config.json", {done: procData});
    getCon("fonts/selection.json", {done: tabUp});

    var sButtons = document.querySelectorAll(".settings-icon");
    sButtons[0].addEventListener("click", function(){setSettings(this,TagNames.qr);});
    sButtons[1].addEventListener("click", function(){setSettings(this,TagNames.mtf);});

    sButtons = document.querySelectorAll(TagNames.removeAllLinks);
    sButtons[0].addEventListener("click", function(){setCancel(this,TagNames.qr);});
    sButtons[1].addEventListener("click", function(){setCancel(this,TagNames.mtf);});

    sButtons = document.querySelectorAll(TagNames.updateChanges);
    sButtons[0].addEventListener("click", function(){pushSave(this,TagNames.qr);});
    sButtons[1].addEventListener("click", function(){pushSave(this,TagNames.mtf);});
    var info = document.querySelectorAll(".name , .url");
    for (i = 0; i < info.length; ++i) 
    {
        info[i].addEventListener("keypress", function (myEvent) 
        {
            var keynum = myEvent.which;
            if (keynum == StatusNumbers.ESCIsPressed) 
            {
                var at = activeTab(this);
                document.querySelector("." + className + " " + TagNames.removeAllLinks).click();
            }
            else if (keynum == StatusNumbers.EnterButtonPushed) 
            {
                document.querySelector("." + className + " " + TagNames.updateChanges).click();
            }
        });
    }
    document.querySelector(".find").addEventListener("keypress", function (myEvent) 
    {
        if (myEvent.which == StatusNumbers.EnterButtonPushed) 
        {
            var dd = document.querySelectorAll(TagNames.sel + " li");
            for (var i=0; i<dd.length; i++) 
            {
                if (dd[i].innerHTML == this.value) 
                {
                    document.querySelector(".tabs ul li a[href=\"#" + dd[i].parentNode.parentNode.parentNode.className +"\"]" ).click();
                    dd[i].click();
                    i = dd.length + 1;
                }
            }
            if (i == dd.length) 
            {
                document.querySelector(TagNames.notifs).innerHTML = "<p>" + "Report: " + this.value +" does not exist"+ "</p>";
            }
        }
    });
}

var openIframe = function (thisTag,name) 
{
    document.querySelector("." + name + TagNames.windowLink).src = thisTag.title;
    document.querySelector("." + name + " .expand-icon").href = thisTag.title;
    thisTag.parentNode.parentNode.querySelector("li").title = thisTag.title;
    thisTag.parentNode.parentNode.querySelector("li").innerHTML = thisTag.innerHTML;
    thisTag.parentNode.parentNode.querySelector("li").addEventListener("click", function() {openIframe(thisTag,name);});
};

var activeTab = function(currentTag)
{
    var className = currentTag.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className;
    return className;
};

var setStyle = function(elem)
{
    elem.style.display = "none";
    elem.style.height = "0";
};

var learnRegExp = function (currentTag) 
{    
    //checks if the given url is legal, by given regex rule
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return currentTag.parentNode.parentNode.checkValidity();    
};


window.onLoad = start();








