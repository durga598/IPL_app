$('.navbar-collapse a').click(function(){
    $(".navbar-collapse").collapse('hide');
});

// ------------------Reading from Firebase----------------------//
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCBm9XwN2R_ivViYe9ICKnfi1K6NOvzN_s",
    authDomain: "iplapp-c7be3.firebaseapp.com",
    databaseURL: "https://iplapp-c7be3.firebaseio.com",
    storageBucket: "iplapp-c7be3.appspot.com",
    messagingSenderId: "523339959817"
};
firebase.initializeApp(config);

function readFirebase(callback) {
    var ref = firebase.database().ref();
    //console.log("working");
    ref.on("value", function(data) {
        console.log("firebase data loaded");
        //assigning  retrived data array from firebase to products
        datas = data.val();

        callback(datas);
        //
        //
        //console.log(datas.length);
    });
}

// ---------------AJAX script------------------------------//


$(document).ready(function() {
    $(document).on('click', 'a.teamDetails', function(e) {
        console.log("team Details calling.....");
        e.preventDefault();
        var pageRef = $(this).attr('href');
        //console.log(pageRef);

        callPage(pageRef).then(function(index) {
            if (pageRef === "template/team.html") {
                displayTeam();
            } else {
                renderSingleProductPage(index);
            }
        })
    });

    function callPage(pageRefInput) {
        return new Promise(function(resolve, reject) {
            var index;
            if (pageRefInput.search("#") > 0) {
                index = pageRefInput.substring(pageRefInput.search("#") + 1);
                pageRefInput = pageRefInput.substring(0, pageRefInput.search("#"))
            }

            $.ajax({
                url: pageRefInput,
                type: "GET",
                datatype: "text",
                success: function(response) {
                    $('#content').html(response);
                    resolve(index);
                }
            });
        });
    }
});
// ------------------END--------------------------------//

// -------------LOAD slider script------------------------//


function LoadScripts(async) {
    if (async === undefined) {
        async = false;
    }
    var scripts = [];
    var _scripts = ['scripts/jssor.slider-21.1.6.mini.js', 'scripts/custom.js'];

    if (async) {
        LoadScriptsAsync(_scripts, scripts)
    } else {
        LoadScriptsSync(_scripts, scripts)
    }
}

// what you are looking for :
function LoadScriptsSync(_scripts, scripts) {

    var x = 0;
    var loopArray = function(_scripts, scripts) {
        // call itself
        loadScript(_scripts[x], scripts[x], function() {
            // set x to next item
            x++;
            // any more items in array?
            if (x < _scripts.length) {
                loopArray(_scripts, scripts);
            }
        });
    }
    loopArray(_scripts, scripts);
}

// async load as in your code
function LoadScriptsAsync(_scripts, scripts) {
    for (var i = 0; i < _scripts.length; i++) {
        loadScript(_scripts[i], scripts[i], function() {});
    }
}

// load script function with callback to handle synchronicity
function loadScript(src, script, callback) {

    script = document.createElement('script');
    script.onerror = function() {
        // handling error when loading script
        alert('Error to handle')
    }
    script.onload = function() {
        console.log(src + ' loaded ')
        callback();
    }
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
}

// -----------------END----------------------------//

//----------Script---------------------------------//

console.log("script loaded");
var datas = [];
datas.length = 0;

readFirebase(function(data) {
    var i = 0;
    data.forEach(function() {
        var html = '<div data-p="144.50" style="display: none;">';

        html += '<a class="teamDetails" href="template/player.html#' + i + '"><img data-u="image" class="teamDetails" src=' + data[i].team_img_url + ' /></a>';
        html += '<img data-u="thumb" src=' + data[i].team_img_url + ' />';
        html += '</div>';
        document.getElementById("imgslider").innerHTML += html;
        i++;
    });

    LoadScripts();
});
//---------------------END-----------------------------------//

///-------------------------TEAM Script loaded-----------------//

function displayTeam() {
    readFirebase(function(playerData) {
        var list = $('.team_detail');
        var theTemplateScript = $("#team-template").html();
        //Compile the template​
        var theTemplate = Handlebars.compile(theTemplateScript);
        list.append(theTemplate(datas));
    });
}

function renderSingleProductPage(index) {
    readFirebase(function(products) {
        document.getElementById("jumbo").style.backgroundImage = "url('" + products[index].team_logo + "'), url('" + products[index].team_background + "')";
        document.getElementById("teamName").innerHTML = products[index].team_name;
        var html = 'Team Captain : ' + products[index].team_captain + '<br>Team Coach : ' + products[index].team_coach + '<br>Team Home : ' + products[index].team_home_venue + '<br>Team Owner : ' + products[index].team_owner;
        document.getElementById("teamData").innerHTML = html;
        var list = $('.playerList');
        var theTemplateScript = $("#player-template").html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        list.append(theTemplate(products[index].team_players));
    });
}

//--------------------_END-----------------------------//
