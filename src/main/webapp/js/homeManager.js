// initialize a function to avoid global scope
(function () {

    // find the span with the id user
    let userDiv = document.getElementById("user");
    // set the text of the span to the username of the logged user
    userDiv.innerText = sessionStorage.getItem('user');

    // make a call to the servlet called GetPlaylistList to get all the playlists of the logged user
    makeCall("GET", "GetPlaylistList", null, request => {
            // check the response status
            if (request.readyState == XMLHttpRequest.DONE) {
                // if the response status is 200 ok
                switch (request.status) {
                    case 200:
                        let userPlaylists = JSON.parse(request.responseText); // this is a list of strings

                        // find the div with id playlists
                        let playlists = document.getElementById("playlists");

                        // append all the songs as children of the div using foreach
                        userPlaylists.forEach(song => {
                                let div = document.createElement("div");
                                div.classList.add("playlistListItem");
                                div.innerText = song;
                                playlists.appendChild(div);
                                // add a listener to the div to make it clickable
                                div.addEventListener('click', (e) => {
                                    // get the name of the playlist
                                    let playlistName = e.target.innerText;

                                    // make a call to the servlet called GetPlaylist to get all the songs of the playlist
                                    makeCall("GET", "GetPlaylistSongs?playlistName=" + playlistName, null, request => {
                                            // check the response status
                                            if (request.readyState == XMLHttpRequest.DONE) {
                                                // if the response status is 200 ok
                                                switch (request.status) {
                                                    case 200:
                                                        let playlistSongs = JSON.parse(request.responseText); // this is a list of strings

                                                        // find the div with id playlists
                                                        let songsParent = document.getElementById("PlaylistPageId");

                                                        let hideButton = document.getElementById("backButton");
                                                        hideButton.addEventListener('click', (e) => {
                                                                // hide the playlistColumn div and show the PlaylistPageId div using the hidden class
                                                                document.getElementById("playlistColumn").classList.remove("hidden");
                                                                document.getElementById("PlaylistPageId").classList.add("hidden");
                                                            }
                                                        );

                                                        // clear all the children of class playlistItem
                                                        let playlistItems = document.getElementsByClassName("playlistItem");
                                                        while (playlistItems[0]) {
                                                            playlistItems[0].parentNode.removeChild(playlistItems[0]);
                                                        }

                                                        // append all the songs as children of the div using foreach
                                                        playlistSongs.forEach(song => {
                                                                let div = document.createElement("div");
                                                                div.classList.add("playlistItem");
                                                                div.innerText = song;
                                                                songsParent.appendChild(div);
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

                                    // hide the playlistColumn div and show the PlaylistPageId div using the hidden class
                                    document.getElementById("playlistColumn").classList.add("hidden");
                                    document.getElementById("PlaylistPageId").classList.remove("hidden");
                                });
                            }
                        );

                        // print all the songs in the console for debug
                        console.log(userPlaylists);
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

    // make a call to the servlet called GetPlaylistList to get all the songs of the logged user to create checkboxes
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