// create a drag and drop function to rearrange the order of the playlists
let dragAndDrop = function () {
    // get all the elements with the class name "playlist"
    var playlists = document.getElementsByClassName("playlist");
    // loop through all the elements with the class name "playlist"
    for (var i = 0; i < playlists.length; i++) {
        // add an event listener to each element with the class name "playlist"
        playlists[i].addEventListener("dragstart", function (event) {
            // set the data type and value of the element being dragged
            event.dataTransfer.setData("text", event.target.id);
        });
    }
    // add an event listener to the element with the id "playlistContainer"
    document.getElementById("playlistContainer").addEventListener("dragover", function (event) {
        // prevent the default action from happening
        event.preventDefault();
    });
    // add an event listener to the element with the id "playlistContainer"
    document.getElementById("playlistContainer").addEventListener("drop", function (event) {
        // prevent the default action from happening
        event.preventDefault();
        // get the data type and value of the element being dragged
        var data = event.dataTransfer.getData("text");
        // append the element being dragged to the element with the id "playlistContainer"
        event.target.appendChild(document.getElementById(data));
    });
}