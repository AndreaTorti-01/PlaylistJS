// initialize a function to avoid global scope
(function () {
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
                                div.classList.add("playlist");
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

                                                        // append all the songs as children of the div using foreach
                                                        playlistSongs.forEach(song => {
                                                                let div = document.createElement("div");
                                                                div.classList.add("song");
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

                                    // hide the playlistColumn div and show the PlaylistPageId div
                                    document.getElementById("playlistColumn").style.display = "none";
                                    document.getElementById("PlaylistPageId").style.display = "block";
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


}())