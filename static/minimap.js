function getNodeHTML(idx, visited, present, tree) {
    if (Object.keys(tree).length - 1 < idx) return ""
    if (idx === present || visited.includes(idx.toString())) {
        if (idx === present) {
            HTML_str = "<li> <span class = 'yellow'  id =" + idx + '>'
        }
        else if (visited.includes(idx.toString())) {
            HTML_str = "<li> <span class = 'green'  id =" + idx + '>'
        }
        HTML_str += "<button class='minimap-node-button' onclick = 'renderNode(" + idx.toString() + ")'><img src = '../static/images/" + tree[idx].image + "' width = '15' height='15'></button>"
    }
    else {
        HTML_str = "<li> <span class = 'red'  id =" + idx + '>'
        HTML_str += "<button class='minimap-node-button-not-visited'><img src = '../static/images/" + tree[idx].image + "' width = '15' height='15'></button>"
    }
    HTML_str += "</span>"

    if (tree[idx].children !== null) {
        HTML_str += "<ul>"
        for (var i = 0; i < tree[idx].children.length; i++) {
            HTML_str += getNodeHTML(tree[idx].children[i], visited, present, tree)
        }
        HTML_str += "</ul>"
    }
    HTML_str += "</li>"
    return HTML_str
}

function displayChart(visited, present, tree, obj) {
    obj.empty()
    obj.append("<ul class = 'tree'>" + getNodeHTML(0, visited, present, tree) + "</ul>")
}

function callBackend(url, data_file) {
    $.ajax({
        url: url,
        type: "POST",
        async: false,
        cache: false,
        timeout: 30000,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data_file),
        success: function (response) {
            console.log(response)
            if (response.redirect) {
                window.location.href = response.redirect;
            }
        },
        error: function (response, status, error) {
            console.log("Error");
            console.log(response);
            console.log(status);
            console.log(error);
        }
    });
}


function renderNode(id) {
    // root node, do nothing
    callBackend('/init_tree', { 'id': id })
}

$(document).ready(function () {
    $("#expandMiniMapDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 'auto',
        modal: true
    });
    displayChart(visited, present, tree, $("#minimap"))
});