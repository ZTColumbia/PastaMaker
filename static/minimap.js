function getNodeHTML(idx, visited, present, tree_structure) {
    //console.log(0)


    if (Object.keys(tree_structure).length - 1 < idx) return ""
    //console.log(visited)
    if (idx == present || visited.includes(idx.toString())) {

        if (idx == present) {
            HTML_str = "<li> <span class = 'yellow'  id =" + idx + '>'
        }

        else if (visited.includes(idx.toString())) {
            HTML_str = "<li> <span class = 'green'  id =" + idx + '>'
        }

        HTML_str += "<button class='minimap-node-button' onclick = 'renderNode(" + idx.toString() + ")'><img src = '../static/images/" + tree_structure[idx].image + "' width = '15' height='15'></button>"

    }
    else {
        HTML_str = "<li> <span class = 'red'  id =" + idx + '>'
        HTML_str += "<button class='minimap-node-button-not-visited'><img src = '../static/images/" + tree_structure[idx].image + "' width = '15' height='15'></button>"
    }


    HTML_str += "</span>"

    console.log(tree_structure[idx])

    console.log('----------')
    console.log(tree_structure[idx].children)
    console.log(tree_structure[idx].children)
    console.log('----------')

    if (tree_structure[idx].children !== null) {
        HTML_str += "<ul>"
        for (var i = 0; i < tree_structure[idx].children.length; i++) {
            console.log('test')
            HTML_str += getNodeHTML(tree_structure[idx].children[i], visited, present, tree_structure)
        }
        HTML_str += "</ul>"
    }


    HTML_str += "</li>"


    return HTML_str
}

function getNodeHTMLExpand(idx, visited, present, tree_structure) {
    //console.log(0)


    if (Object.keys(tree_structure).length - 1 < idx) return ""
    //console.log(visited)
    if (idx == present || visited.includes(idx.toString())) {

        if (idx == present) {
            HTML_str = "<li> <span class = 'yellow'  id =" + idx + '>'
        }

        else if (visited.includes(idx.toString())) {
            HTML_str = "<li> <span class = 'green'  id =" + idx + '>'
        }

        HTML_str += ""+tree_structure[idx].title+"<br><button class='minimap-node-button' onclick = 'renderNode(" + idx.toString() + ")'><img src = '../static/images/" + tree_structure[idx].image + "' width = '35px' height='35px'></button>"

    }
    else {
        HTML_str = "<li> <span class = 'red'  id =" + idx + '>'
        HTML_str += ""+tree_structure[idx].title+"<br><img src = '../static/images/" + tree_structure[idx].image + "' width = '35px' height='35px'>"
    }


    HTML_str += "</span>"

    console.log(tree_structure[idx])

    console.log('----------')
    console.log(tree_structure[idx].children)
    console.log(tree_structure[idx].children)
    console.log('----------')

    if (tree_structure[idx].children !== null) {
        HTML_str += "<ul>"
        for (var i = 0; i < tree_structure[idx].children.length; i++) {
            console.log('test')
            HTML_str += getNodeHTMLExpand(tree_structure[idx].children[i], visited, present, tree_structure)
        }
        HTML_str += "</ul>"
    }


    HTML_str += "</li>"


    return HTML_str
}


function displayChart(visited, present, tree_structure, obj) {
    obj.empty()
    obj.append("<ul class = 'tree'>" + getNodeHTML(0, visited, present, tree_structure) + "</ul>")
};


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

    /* do nothing if root node */
    console.log('render node', id)
    callBackend('/traverse_tree', { 'id': id })

}


function expandMiniMap() {
    obj = $("#minimapDialog")
    obj.empty()
    obj.append("<ul class = 'treeExpand'>" + getNodeHTMLExpand(0, visited, present, tree_structure) + "</ul>")
    $('#expandMiniMapDialog').dialog("open");
}
$(document).ready(function () {
    //console.log(viewID)
    $("#expandMiniMapDialog").dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 'auto',
        modal: true
    });
    displayChart(visited, present, tree_structure, $("#minimap"))
});