// initialize a function to avoid global scope
(function () {

    // "definitions"

    let getPlaylists = function () {

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

                            let playlistList = document.getElementsByClassName("playlistListItem");
                            while (playlistList[0]) {
                                playlistList[0].parentNode.removeChild(playlistList[0]);
                            }

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
                                        getSongsInPlaylist(playlistName);
                                        // hide the playlistColumn div and show the PlaylistPageId div using the hidden class
                                        document.getElementById("playlistColumn").classList.add("hidden");
                                        document.getElementById("PlaylistPageId").classList.remove("hidden");
                                    });
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
    }

    let getSongsInPlaylist = function (playlistName) {
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
    }

    let getAllSongsForCheckboxes = function () {
        // make a call to the servlet called GetSongList to get all the songs of the logged user to create checkboxes
        makeCall("GET", "GetSongList", null, request => {
                // check the response status
                if (request.readyState == XMLHttpRequest.DONE) {
                    // if the response status is 200 ok
                    switch (request.status) {
                        case 200:
                            let userSongs = JSON.parse(request.responseText); // this is a list of strings

                            // find the div with id playlists
                            let createPlaylistForm = document.getElementById("SongsForm");

                            // clear all the children of class playlistItem
                            let songCheckboxes = document.getElementsByClassName("song");
                            while (songCheckboxes[0]) {
                                songCheckboxes[0].parentNode.removeChild(songCheckboxes[0]);
                            }

                            // append all the songs as children of the form using foreach as checkboxes with the name song
                            userSongs.forEach(song => {
                                    let div = document.createElement("div");
                                    div.classList.add("song");
                                    div.innerHTML = '<input type="checkbox" name="checkbox" value="' + song + '">' + song;
                                    createPlaylistForm.insertBefore(div, document.getElementById("CreatePlaylistButton"));
                                }
                            );

                            //     var songCheckboxes = document.querySelectorAll('.song');

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
    }

    // "main"

    getPlaylists();
    getAllSongsForCheckboxes()

    // find the span with the id user
    let userDiv = document.getElementById("user");
    // set the text of the span to the username of the logged user
    userDiv.innerText = sessionStorage.getItem('user');

    // make a call to the servlet called CreatePlaylist to create a new playlist with the name and the songs selected in the checkboxes
    let createPlaylistButton = document.getElementById("CreatePlaylistButton");
    let createPlaylistForm = createPlaylistButton.closest("form");

    createPlaylistButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (createPlaylistForm.checkValidity()) {
            makeCall("POST", "CreatePlaylist", createPlaylistForm, request => {
                // check the response status
                if (request.readyState == XMLHttpRequest.DONE) {
                    // if the response status is 200 ok
                    switch (request.status) {
                        case 200:
                            getPlaylists();
                            break;
                        default:
                            // if the response status is other
                            // print the error
                            console.log("error");
                            break;

                    }
                }
            });
        }
    });

    let uploadSongButton = document.getElementById("uploadSongButton");
    let uploadSongForm = uploadSongButton.closest("form");

    uploadSongButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (uploadSongForm.checkValidity()) {
            makeCall("POST", "CreateSong", uploadSongForm, request => {
                // check the response status
                if (request.readyState == XMLHttpRequest.DONE) {
                    // if the response status is 200 ok
                    switch (request.status) {
                        case 200:
                            getAllSongsForCheckboxes();
                            break;
                        default:
                            // if the response status is other
                            // print the error
                            console.log("error");
                            break;

                    }
                }
            });
        }
    });


}())