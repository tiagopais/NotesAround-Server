About={
    authors : [],




}

Author = function(content,imageUrl) {
    var html = '<div id="content">' +
        '<div id="imgContent"><a href="' + imageUrl + '" target="_blank"><img width="50" src="' + imageUrl +'"></a></div>' +
        '<div id="bodyContent">' + content + '</div>' +
        '</div>';


    return {

    }
}
