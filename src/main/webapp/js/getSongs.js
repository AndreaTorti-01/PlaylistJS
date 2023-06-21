// initialize a function to avoid global scope
(function () {
    // make a call to the servlet called GetPlaylistList to get all the playlists of the logged user
    makeCall("GET", "GetSongList", null, request => {
            // check the response status
            if (request.readyState == XMLHttpRequest.DONE) {
                // if the response status is 200 ok
                switch (request.status) {
                    case 200:
                        let userSongs = JSON.parse(request.responseText); // this is a list of strings

                        // find the div with id playlists
                        let createPlaylistForm = document.getElementById("SongsForm");

                        // append all the songs as children of the form using foreach as checkboxes with the name song
                        userSongs.forEach(song => {
                                let div = document.createElement("div");
                                div.classList.add("song");
                                div.innerHTML = '<input type="checkbox" name="song" value="' + song + '">' + song;
                                createPlaylistForm.insertBefore(div, document.getElementById("CreatePlaylistButton"));
                            }
                        );

                        break;
                    default:
                        // if the response status is other
                        // print the error
                        console.log("error");
                        break;

                }
            }
        }
    );
}())