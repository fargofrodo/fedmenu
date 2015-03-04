var fedmenu = function(options) { $(document).ready(function() {
    var defaults = {
        'url': 'https://apps.fedoraproject.org/js/data.js',
        'mimeType': undefined,  // Only needed for local development

        'position': 'bottom-left',

        'user': null,
        'package': null,
    }
    // Our options object is called 'o' for shorthand
    var o = $.extend({}, defaults, options || {});

    var buttons = "";
    if (o['user'] != null) buttons += '<div id="fedmenu-user-button" class="fedmenu-button"></div>';
    if (o['package'] != null) buttons += '<div id="fedmenu-package-button" class="fedmenu-button"></div>';
    buttons += '<div id="fedmenu-main-button" class="fedmenu-button"></div>';

    $('body').append('<link href="fedmenu.css" rel="stylesheet">');
    $('body').append(
        '<div id="fedmenu-tray" class="fedmenu-' + o.position + '">' +
        buttons + '</div>');

    if (o['user'] != null) {
        var imgurl = libravatar.url(o['user']);
        $('#fedmenu-user-button').css('background-image', 'url("' + imgurl + '")');
    }
    if (o['package'] != null) {
        /* This icon is not always going to exist, so we should put in an
         * apache rule that redirects to a default icon if this file
         * isn't there. */
        var imgurl = 'https://apps.fedoraproject.org/packages/images/icons/' + o['package'] + '.png';
        $('#fedmenu-package-button').css('background-image', 'url("' + imgurl + '")');
    }

    $('body').append('<div id="fedmenu-wrapper"></div>');

    $('body').append('<div id="fedmenu-main-content"></div>');
    $('#fedmenu-main-content').append("<h1>Fedora Infrastructure</h1>");
    $.ajax({
        url: o.url,
        mimeType: o.mimeType,
        dataType: 'script',
        error: function(err) {
            console.log('Error getting ' + o.url);
            console.log(err);
        },
        success: function(script) {
            $.each(json.children, function(i, child) {
                var html =
                    "<div class='fedmenu-panel'><div class='fedmenu-header'>" +
                    child.name + "</div><ul>";

                $.each(child.children, function(j, grandchild) {
                    html = html +
                        "<li><a href='" + grandchild.data.url + "'>" +
                        $("<p>" + grandchild.name + "</p>").text() +
                        "</a></li>";
                });
                html = html + "</ul></div>";
                $("#fedmenu-main-content").append(html);
            });
        },
    });

    var main = '#fedmenu-wrapper,#fedmenu-main-button,#fedmenu-main-content';
    var activate = function() { $(main).addClass('fedmenu-active'); };
    var deactivate = function() { $(main).removeClass('fedmenu-active'); };

    $("#fedmenu-main-button").click(function() {
        if ($(this).hasClass('fedmenu-active'))
            deactivate();
        else
            activate();
    });
    $("#fedmenu-wrapper").click(deactivate);
}); };
