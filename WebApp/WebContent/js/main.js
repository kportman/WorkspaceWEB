StatusNumbers = 
{
    ESCIsPressed: 0,
    StatusIsReady: 4,    
    EnterButtonPushed : 13,
    StatusIsOk : 200,
    StatusResponseReceived: 300,
    StatusCodeNotModified: 304
}

var getQA = function (qA) {
	var k = 4;
    var l = 0;
    if (qA !== undefined) 
    {
        for (var i = 0; i < qA.length; i++) {
        	document.querySelectorAll(".nav-section")[i].innerHTML = "<p>" + qA[i].label + "</p>" + document.querySelectorAll(".nav-section")[i].innerHTML;
        	document.querySelectorAll(".nav-section")[i].style.background = "black url(./img/icons/" + qA[i].icon + ".png)  left 50% top 77px no-repeat";
        	document.querySelectorAll(".nav-section")[i].addEventListener("focus", function (e) { this.querySelector(".action-list").style.display = "block";}, false);
        	document.querySelectorAll(".nav-section")[i].addEventListener("mouseleave", function (e) {
        	    if (document.activeElement === this) {
        	        this.blur();
        	        this.querySelector(".action-list").style.display = "none";
        	    }
        	}, false);
        }
        for (i = 0; i < qA.length; i++) {
        	document.querySelectorAll(".menu-caption")[i].innerHTML = "<p>" + qA[i].actionsLabel + "</p>";
        }
      
        var start = "<li><a href=\"";
        var tabIndex = "\" tabindex=\"";
        var end = "\"></a></li>";
        for (i = 0; i < qA.length; i++) 
        {
            for (var j = 0; j < qA[i].actions.length; j++) 
            {
            	document.querySelectorAll(".action-list")[i].innerHTML += start + qA[i].actions[j].url + tabIndex + k + end;
                document.querySelectorAll(".action-list li >a")[l].innerHTML =  qA[i].actions[j].label;
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
    fill(info);
    var enc = "." + tabName + " .styled-select-list";
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
                document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + " .frame-window").src = info[i + 1].value;
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

        document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + " .frame-window").src = "";
        document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + " .expand-icon").href = "";
    } else {
        document.querySelector(enc).style.display = "block";
        var listItems = document.querySelectorAll(enc + " li");
        for (i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", openIframe);
        }
        var settingsDiv = document.querySelector("." + document.querySelector(enc).parentNode.parentNode.className + " .settings");
        settingsDiv.style.display = "none";
        settingsDiv.style.height = "0";
        document.querySelector("." + tabName + " .settings-icon-wrapper").style.backgroundColor = "transparent";
        listItems[0].click();
    }
};

var pushSave = function (parentClass) 
{
    var info = document.querySelectorAll("." + parentClass + " .name ," + "." + parentClass + " .url");
    var ok = true;
    ok = helpF(info);
    if (ok == true) 
    {
    	var indicator = true;
        var enc = parentClass + ":.+?;";
        localStorage.webApp = localStorage.webApp.replace(new RegExp(enc, "g"), "");
        for (var i = 0; i < info.length; i++) {
            if (info[i].value != null && info[i].value != "") {
                localStorage.webApp = localStorage.webApp + parentClass + ":" + info[i].id + "=" + info[i].value + ";";
            }
        }
        enc = "." + parentClass + " .styled-select-list";
        document.querySelector(enc).innerHTML = "";
        for (var i = 0; i < info.length; i++) {
            if (info[i].value != null && info[i].value != "") {
                if (i == 0) {
                    document.querySelector(enc).innerHTML = document.querySelector(enc).innerHTML + "<li>" + info[i].value + "</li>";
                    document.querySelectorAll(enc + " li")[0].title = info[i + 1].value;
                }
                document.querySelector(enc).innerHTML = document.querySelector(enc).innerHTML + "<li>" + info[i].value + "</li>";
                document.querySelectorAll(enc + " li")[i / 2 + 1].title = info[i + 1].value;
                indicator = false;
            }
            i++;
        }
        if (indicator == true) {
            document.querySelector(enc).style.display = "none";
            document.querySelector("." + parentClass + " .frame-window").src = "";
            document.querySelector("." + parentClass + " .expand-icon").href = "";
        } else {
            document.querySelector(enc).style.display = "block";
            for (i = 0; i < document.querySelectorAll(enc + " li").length; i++) {
            	document.querySelectorAll(enc + " li")[i].addEventListener("click", openIframe);
            }
        }
        document.querySelector("." + parentClass + " .settings-icon").click();
        document.querySelectorAll(enc + " li")[0].click();
    }
};
var tabUp = function (pics) {
    for (var i = 0; i < document.querySelectorAll(".tabs >ul li a").length; i++) {
    	document.querySelectorAll(".tabs >ul li a")[i].innerHTML = "<i class=\"" + pics.preferences.fontPref.prefix + pics.icons[i].icon.tags[0] + "\"></i>" + document.querySelectorAll(".tabs >ul li a")[i].innerHTML;
    }
    if (window.location.href.indexOf("#") == -1) {
        document.querySelector(".tabs>ul>li").className += "active-tab";
        document.querySelector(".tabs>div").style.display = "block";
    } else {
        var remem = window.location.href.substring(window.location.href.indexOf("#"));
        document.querySelector("a[href=\"" + remem + "\"]").parentNode.className = "active-tab";
        document.querySelector(remem).style.display = "block";
    }
    window.addEventListener("hashchange", function (e) {
        for (var i = 0; i < document.querySelectorAll(".tabs > div").length; i++) {
        	document.querySelectorAll(".tabs > div")[i].style.display = "none";
        }
        document.querySelector(e.newURL.substring(e.newURL.indexOf("#"))).style.display = "block";
        document.querySelector(".active-tab").className = "";
        document.querySelector("a[href=\"" + e.newURL.substring(e.newURL.indexOf("#")) + "\"]").parentNode.className = "active-tab";
    }, false);

};
var fill = function(info){
	 for (i = 0; i < info.length; i++) {
	        var str = tabName + ":" + info[i].id + "=";
	        if (localStorage.webApp.indexOf(str) != -1) 
	        {
	            var i = localStorage.webApp.indexOf(str) + str.length;
	            var j = localStorage.webApp.indexOf(";", i);
	            info[i].value = localStorage.webApp.substring(i, j);
	        }
	    }
}

function start() 
{
    getCon("data/config.json", {done: function (data) 
    {
        if (data.notification !== undefined) {
            document.querySelector(".notifications").innerHTML = "<p>" + data.notification + "</p>";
        }
        getQA(data.quickActions);
        if (localStorage.webApp != "" && localStorage.webApp != null) {
            refresh("qr");
            refresh("my-team-folders");
        } else {
            localStorage.webApp = "";
        }
    }});
    getCon("fonts/selection.json", {done: tabUp});
    var sButtons = document.querySelectorAll(".settings-icon");
    for (var i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", function () 
        {
            var parentClass = this.parentNode.parentNode.parentNode.className;
            var settingsDiv = document.querySelector("." + parentClass + "> .settings");
            if (settingsDiv.style.display == "none") {
                settingsDiv.style.display = "block";
                settingsDiv.style.height = "36%";
                this.parentNode.style.backgroundColor = "white";
                document.querySelector("." + parentClass + " .name").focus();
            }
            else {
                settingsDiv.style.display = "none";
                settingsDiv.style.height = "0";
                this.parentNode.style.backgroundColor = "transparent";
            }
        });
    }
    sButtons = document.querySelectorAll(".cancel");
    for (i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", function () 
        {
            var parentClass = this.parentNode.parentNode.parentNode.parentNode.className;
            for (var i = 0; i < document.querySelectorAll("." + parentClass + " .url ," + "." + parentClass + " .name").length; ++i) {
            	document.querySelectorAll("." + parentClass + " .url ," + "." + parentClass + " .name")[i].value = "";
            }
            var settingsDiv = document.querySelector("." + parentClass + " .settings");
            settingsDiv.style.display = "none";
            settingsDiv.style.height = "0";
            document.querySelector("." + parentClass + " .settings-icon-wrapper").style.backgroundColor = "transparent";
            refresh(parentClass);
        });
    }
    sButtons = document.querySelectorAll(".save");
    sButtons[0].addEventListener("click", function(){pushSave("qr");});
    sButtons[1].addEventListener("click", function(){pushSave("my-team-folders");});
    var info = document.querySelectorAll(".name , .url");
    for (i = 0; i < info.length; ++i) {
        info[i].addEventListener("keypress", function (myEvent) 
        {
            var keynum = myEvent.which;
            if (keynum == StatusNumbers.ESCIsPressed) 
            {
                var at = activeTab(this);
                document.querySelector("." + className + " .cancel").click();
            } else if (keynum == StatusNumbers.EnterButtonPushed) {
                document.querySelector("." + className + " .save").click();
            }
        });
    }
    document.querySelector(".find").addEventListener("keypress", function (myEvent) 
    {
        if (myEvent.which == StatusNumbers.EnterButtonPushed) 
        {
            var dd = document.querySelectorAll(".styled-select-list li");
            for (var i=0; i<dd.length; i++) 
            {
                if (dd[i].innerHTML == this.value) 
                {
                    document.querySelector(".tabs ul li a[href=\"#" +dd[i].parentNode.parentNode.parentNode.className +"\"]" ).click();
                    dd[i].click();
                    i = dd.length +1;
                }
            }
            if (i == dd.length) 
            {
                document.querySelector(".notifications").innerHTML = "<p>" + "Report: " + this.value +" does not exist"+ "</p>";
            }
        }
    });
}
var openIframe = function () 
{
    document.querySelector("." + this.parentNode.parentNode.parentNode.className + " .frame-window").src = this.title;
    document.querySelector("." + this.parentNode.parentNode.parentNode.className + " .expand-icon").href = this.title;
    this.parentNode.parentNode.querySelector("li").title = this.title;
    this.parentNode.parentNode.querySelector("li").innerHTML = this.innerHTML;
    this.parentNode.parentNode.querySelector("li").addEventListener("click", openIframe);
};

var activeTab = function(currentTag)
{
    var className = currentTag.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className;
    alert(className);
    return className;
};

window.onLoad = start();


