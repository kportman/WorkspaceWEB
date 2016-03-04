var ajaxUtility = function (url, options) 
{
    if((Object.prototype.toString.call(options) !== Object.prototype.toString.call({})))
    {
        options = {};
    }
    var xhr = new XMLHttpRequest(), method = 'GET', options
    if (options.method) 
    {
        method = options.method;
    }
    xhr.open(method.toUpperCase(), url);
    xhr.onreadystatechange = function () 
    {
        var status;
        if (xhr.readyState === 4) 
        {
            status = xhr.status;
            if ((status >= 200 && status < 300) || status === 304) 
            {
                var res = xhr.responseText,
                    contentType = xhr.getResponseHeader('Content-Type');
                if (contentType) 
                {
                    if (contentType === 'text/json' ||
                        contentType === 'application/json') 
                    {
                        try 
                        {
                            res = JSON.parse(res);
                        }
                        catch (err) 
                        {
                            if (options.fail) 
                            {
                                options.fail.call(xhr, err);
                                return;
                            }
                        }
                    } 
                    else if (contentType === 'text/xml' || contentType === 'application/xml') 
                    {
                        res = xhr.responseXML;
                        if (res === null && options.fail) 
                        {
                            options.fail.call(xhr, 'Bad XML file');
                            return;
                        }
                    }
                }
                if (options.done) 
                {
                    options.done.call(xhr, res);
                }
            }
        }
    };
    xhr.send(null);
};
var updateQuickActions = function (quickActions) {
    var navSections = document.querySelectorAll(".nav-section");
    if (quickActions !== undefined) {
        for (var i = 0; i < quickActions.length; i++) {
            navSections[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSections[i].innerHTML;
            navSections[i].style.background = "black url(./img/icons/" + quickActions[i].icon + ".png)  left 50% top 77px no-repeat";
            navSections[i].addEventListener("focus", changeFocusNav, false);
            navSections[i].addEventListener("mouseleave", ignoreClick, false);
        }
        var menuCaptions = document.querySelectorAll(".menu-caption");
        for (i = 0; i < quickActions.length; i++) {
            menuCaptions[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>";
        }
        var g = 4;
        var q = 0;
        var navLiList = document.querySelectorAll(".action-list");
        var start = "<li><a href=\"";
        var tabIndex = "\" tabindex=\"";
        var end = "\"></a></li>";
        for (i = 0; i < quickActions.length; i++) 
        {
            for (var j = 0; j < quickActions[i].actions.length; j++) 
            {
                navLiList[i].innerHTML += start + quickActions[i].actions[j].url + tabIndex + g + end;
                document.querySelectorAll(".action-list li >a")[q].innerHTML =  quickActions[i].actions[j].label;
                ++q; ++g;
            }
            g++;
        }
    }
};

var updateTabs = function (iconList) {
    var cls = iconList.preferences.fontPref.prefix;
    var tabs = document.querySelectorAll(".tabs >ul li a");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].innerHTML = "<i class=\"" + cls + iconList.icons[i].icon.tags[0] + "\"></i>" + tabs[i].innerHTML;
    }
    if (window.location.href.indexOf("#") == -1) {
        document.querySelector(".tabs>ul>li").className += "active-tab";
        document.querySelector(".tabs>div").style.display = "block";
    } else {
        var newHash = window.location.href.substring(window.location.href.indexOf("#"));
        document.querySelector("a[href=\"" + newHash + "\"]").parentNode.className = "active-tab";
        document.querySelector(newHash).style.display = "block";
    }
    window.addEventListener("hashchange", changeActiveTab, false);

};

var ignoreClick = function (e) {
    if (document.activeElement === this) {
        this.blur();
        this.querySelector(".action-list").style.display = "none";
    }
};

var changeFocus = function (e) {
    this.parentNode.parentNode.style.display = "none";
};

var changeFocusNav = function (e) {
    this.querySelector(".action-list").style.display = "block";
};
var updateFolders = function (tabName) 
{
    var inputs = document.querySelectorAll("." + tabName + " .name" + ", ." + tabName + " .url");
    for (i = 0; i < inputs.length; i++) {
        var stringSearch = tabName + ":" + inputs[i].id + "=";
        if (localStorage.pageData.indexOf(stringSearch) != -1) 
        {
            var indexStart = localStorage.pageData.indexOf(stringSearch) + stringSearch.length;
            var indexEnd = localStorage.pageData.indexOf(";", indexStart);
            inputs[i].value = localStorage.pageData.substring(indexStart, indexEnd);
        }
    }
    var pattern = "." + tabName + " .styled-select-list";
    var emptyFlag = true;
    document.querySelector(pattern).innerHTML = "";
    for (var i = 0; i < inputs.length; i++) 
    {
        if (inputs[i].value != null && inputs[i].value != "") 
        {
            if (i == 0) 
            {
                document.querySelector(pattern).innerHTML = document.querySelector(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                document.querySelectorAll(pattern + " li")[0].title = inputs[i + 1].value;
                document.querySelector("." + document.querySelector(pattern).parentNode.parentNode.className + " .frame-window").src = inputs[i + 1].value;
                document.querySelector("." + document.querySelector(pattern).parentNode.parentNode.className + " .expand-icon").href = inputs[i + 1].value;
            }
            document.querySelector(pattern).innerHTML = document.querySelector(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
            document.querySelectorAll(pattern + " li")[i / 2 + 1].title = inputs[i + 1].value;
            emptyFlag = false;
        }
        i++;
    }
    if (emptyFlag == true) 
    {
        document.querySelector(pattern).style.display = "none";

        document.querySelector("." + document.querySelector(pattern).parentNode.parentNode.className + " .frame-window").src = "";
        document.querySelector("." + document.querySelector(pattern).parentNode.parentNode.className + " .expand-icon").href = "";
    } else {
        document.querySelector(pattern).style.display = "block";
        var listItems = document.querySelectorAll(pattern + " li");
        for (i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", openIframe);
        }
        var settingsDiv = document.querySelector("." + document.querySelector(pattern).parentNode.parentNode.className + " .settings");
        settingsDiv.style.display = "none";
        settingsDiv.style.height = "0";
        document.querySelector("." + tabName + " .settings-icon-wrapper").style.backgroundColor = "transparent";
        listItems[0].click();
    }
};

var changeActiveTab = function (e) {
    var newHash = e.newURL.substring(e.newURL.indexOf("#"));
    var tabDivs = document.querySelectorAll(".tabs > div");
    for (var i = 0; i < tabDivs.length; i++) {
        tabDivs[i].style.display = "none";
    }
    document.querySelector(newHash).style.display = "block";
    document.querySelector(".active-tab").className = "";
    document.querySelector("a[href=\"" + newHash + "\"]").parentNode.className = "active-tab";
};

var toggleSettingsDiv = function () {
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
};

var pushSave = function (parentClass) 
{
    var inputs = document.querySelectorAll("." + parentClass + " .name ," + "." + parentClass + " .url");
    var validated = true;
    for (var i = 0; i < inputs.length; i += 2) {
        if (( inputs[i + 1].value != null && inputs[i + 1].value != "") || 
            ( inputs[i].value != null && inputs[i].value != "")) {
            inputs[i].required = true;
            inputs[i + 1].required = true;
            validated = false;
            if (( inputs[i + 1].value != null && inputs[i + 1].value != "") && 
                ( inputs[i].value != null && inputs[i].value != "")) {
                validated = true;
            }
        }
        if (( inputs[i + 1].value == null || inputs[i + 1].value == "") && 
            ( inputs[i].value == null || inputs[i].value == "")) {
            inputs[i].required = false;
            inputs[i + 1].required = false;
            validated = true;
        }
    }
    if (validated == true)//() && this.parentNode.parentNode.checkValidity()) 
    {
        //parentClass = this.parentNode.parentNode.parentNode.parentNode.id;
        parentClass = parentClass;
        alert("pc is: "  + parentClass);
        var pattern = parentClass + ":.+?;";
        alert("patter is: "  + pattern);
        var regexp = new RegExp(pattern, "g");
        localStorage.pageData = localStorage.pageData.replace(regexp, "");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                localStorage.pageData = localStorage.pageData + parentClass + ":" + inputs[i].id + "=" + inputs[i].value + ";";
            }
        }
        pattern = "." + parentClass + " .styled-select-list";
        var emptyFlag = true;
        document.querySelector(pattern).innerHTML = "";
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                if (i == 0) {
                    document.querySelector(pattern).innerHTML = document.querySelector(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                    document.querySelectorAll(pattern + " li")[0].title = inputs[i + 1].value;
                }
                document.querySelector(pattern).innerHTML = document.querySelector(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                document.querySelectorAll(pattern + " li")[i / 2 + 1].title = inputs[i + 1].value;
                emptyFlag = false;
            }
            i++;
        }
        if (emptyFlag == true) {
            document.querySelector(pattern).style.display = "none";
            document.querySelector("." + parentClass + " .frame-window").src = "";
            document.querySelector("." + parentClass + " .expand-icon").href = "";
        } else {
            document.querySelector(pattern).style.display = "block";
            var listItems = document.querySelectorAll(pattern + " li");
            for (i = 0; i < listItems.length; i++) {
                listItems[i].addEventListener("click", openIframe);
            }
        }
        document.querySelector("." + parentClass + " .settings-icon").click();
        document.querySelectorAll(pattern + " li")[0].click();
    }
};

var openIframe = function () {
    document.querySelector("." + this.parentNode.parentNode.parentNode.className + " .frame-window").src = this.title;
    document.querySelector("." + this.parentNode.parentNode.parentNode.className + " .expand-icon").href = this.title;
    this.parentNode.parentNode.querySelector("li").title = this.title;
    this.parentNode.parentNode.querySelector("li").innerHTML = this.innerHTML;
    this.parentNode.parentNode.querySelector("li").addEventListener("click", openIframe);
};
var updateNotificationArea = function (data) {
    if (data !== undefined) {
        document.querySelector(".notifications").innerHTML = "<p>" + data + "</p>";
    }
};

var searchEnter = function (e) {
    var enteredKey = e.which;
    if (enteredKey == 13) {
        var dropDownList=document.querySelectorAll(".styled-select-list li");
        for (var i=0; i<dropDownList.length; i++) {
            if (dropDownList[i].innerHTML == this.value) {
            	//dropDownList[i].parentNode.parentNode.parentNode.className
                document.querySelector(".tabs ul li a[href=\"#" +dropDownList[i].parentNode.parentNode.parentNode.className +"\"]" ).click();
                dropDownList[i].click();
                i=dropDownList.length +1;
            }
        }
        if (i ==dropDownList.length) {
            document.querySelector(".notifications").innerHTML = "<p>" + "The searched report " + this.value +" was not found"+ "</p>";
        }
    }
};

var inputKeyPress = function (e) 
{
    var keynum = e.which;
    if (keynum == 0) {
        var className = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className;
        document.querySelector("." + className + " .cancel").click();
    } else if (keynum == 13) {
        document.querySelector("." + className + " .save").click();
    }
};
var updatePage = function (data) 
{
    updateNotificationArea(data.notification);
    updateQuickActions(data.quickActions);
    if (localStorage.pageData != "" && localStorage.pageData != null) {
        updateFolders("qr");
        updateFolders("my-team-folders");
    } else {
        localStorage.pageData = "";
    }
};

function initialize() {
    ajaxUtility("data/config.json", {done: updatePage});
    ajaxUtility("fonts/selection.json", {done: updateTabs});
    var sButtons = document.querySelectorAll(".settings-icon");
    for (var i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", toggleSettingsDiv);
    }
    sButtons = document.querySelectorAll(".cancel");
    for (i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", cancelPress);
    }
    sButtons = document.querySelectorAll(".save");
    sButtons[0].addEventListener("click", function(){pushSave("qr");});
    sButtons[1].addEventListener("click", function(){pushSave("my-team-folders");});
    var inputs = document.querySelectorAll(".name , .url");
    for (i = 0; i < inputs.length; ++i) {
        inputs[i].addEventListener("keypress", inputKeyPress);
    }
    document.querySelector(".find").addEventListener("keypress", searchEnter);
}

var cancelPress = function () {
    var parentClass = this.parentNode.parentNode.parentNode.parentNode.className;
    var inputsList = document.querySelectorAll("." + parentClass + " .url ," + "." + parentClass + " .name");
    for (var i = 0; i < inputsList.length; ++i) {
        inputsList[i].value = "";
    }
    var settingsDiv = document.querySelector("." + parentClass + " .settings");
    settingsDiv.style.display = "none";
    settingsDiv.style.height = "0";
    document.querySelector("." + parentClass + " .settings-icon-wrapper").style.backgroundColor = "transparent";
    updateFolders(parentClass);
};

window.onLoad = initialize();



