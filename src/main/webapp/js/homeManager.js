// initialize a function to avoid global scope
(function () {

    // "definitions"

    let getPlaylists = function () {

        // get all elements of class playlistListItem and remove them
        let playlistListItems = document.getElementsByClassName("playlistListItem");
        while (playlistListItems[0]) {
            playlistListItems[0].parentNode.removeChild(playlistListItems[0]);
        }

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
                        userPlaylists.forEach(playlistName => {

                            // create the playlistListItem
                            let playlistListItem = document.createElement("button");
                            playlistListItem.classList.add("playlistListItemButton");
                            playlistListItem.innerText = playlistName;

                            // create the reorderButton
                            let ReorderButton = document.createElement("button");
                            ReorderButton.classList.add("reorderButton");
                            ReorderButton.innerText = "Reorder songs";

                            // create a div to contain the playlistListItem and the reorderButton, so that they can be displayed on the same line
                            let playlistContainerDiv = document.createElement("div");
                            playlistContainerDiv.classList.add("playlistListItem");
                            playlistContainerDiv.style.display = "flex";
                            playlistContainerDiv.style.gap = "1em";

                            playlistContainerDiv.appendChild(playlistListItem);
                            playlistContainerDiv.appendChild(ReorderButton);

                            playlists.appendChild(playlistContainerDiv);

                            ReorderButton.addEventListener('click', (e) => {
                                // get the name of the playlist
                                //let playlistName = e.target.innerText;

                                // make a call to the servlet called GetPlaylistSongs to get all the songs of the playlist
                                getSongsInPlaylistText(playlistName);
                                //handleSorting.addEventListeners();
                                // hide the playlistColumn div and show the PlaylistPageId div using the hidden class
                                document.getElementById("playlistColumn").classList.add("hidden");
                                document.getElementById("PlaylistPageId").classList.remove("hidden");
                            });

                            // add a listener to the div to make it clickable
                            playlistListItem.addEventListener('click', (e) => {
                                // get the name of the playlist
                                //let playlistName = e.target.innerText;

                                // make a call to the servlet called GetPlaylist to get all the songs of the playlist
                                getSongsInPlaylist(playlistName);
                                // hide the playlistColumn div and show the PlaylistPageId div using the hidden class
                                document.getElementById("playlistColumn").classList.add("hidden");
                                document.getElementById("PlaylistPageId").classList.remove("hidden");
                            });
                        });

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

    // funzione che prende i nomi delle canzoni della playlist mostrando solo i titoli
    let getSongsInPlaylistText = function (playlistName) {
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
                            // also hide the prevButton and nextButton
                            document.getElementById("prevButton").classList.add("hidden");
                            document.getElementById("nextButton").classList.add("hidden");
                        });

                        // clear all the children of class playlistItem
                        let playlistItems = document.getElementsByClassName("playlistItem");

                        while (playlistItems[0]) {
                            playlistItems[0].parentNode.removeChild(playlistItems[0]);
                        }

                        let promises = [];
                        // append all the songs as children of the div using foreach
                        playlistSongs.forEach(song => {
                            let promise = new Promise((resolve, reject) => {
                                makeCall("GET", "GetSongDetailsAsJson?songName=" + song, null, request => {
                                    if (request.readyState == XMLHttpRequest.DONE) {
                                        // if the response status is 200 ok
                                        switch (request.status) {
                                            case 200:
                                                let songDetails = JSON.parse(request.responseText); // this is a list of strings

                                                // get userName from session
                                                let username = sessionStorage.getItem("user");

                                                // display the song name
                                                let songDom = document.createElement("div");
                                                songDom.classList.add("playlistItem");
                                                songDom.innerText = song;
                                                songsParent.appendChild(songDom);

                                                // Resolve the promise
                                                resolve();

                                                break;
                                            default:
                                                // if the response status is other
                                                // print the error
                                                console.log("error");
                                                reject();
                                                break;

                                        }
                                    }
                                });
                            });

                            // Add the promise to the promises array
                            promises.push(promise);

                        });

                        // Wait for all promises to resolve
                        Promise.all(promises)
                            .then(() => {
                                // All makeCall requests have finished

                                handleSorting.addEventListeners();

                                let forwardButtons = document.getElementsByClassName("forwardButton");
                                // hide all forward buttons
                                for (let i = 0; i < forwardButtons.length; i++) {
                                    forwardButtons[i].remove();
                                }

                            })
                            .catch(() => {
                                // An error occurred during one or more makeCall requests
                            });

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
                        hideButton.addEventListener('click', () => {
                            // hide the prevButton and nextButton
                            document.getElementById("prevButton").classList.add("hidden");
                            document.getElementById("nextButton").classList.add("hidden");
                            // hide the playlistColumn div and show the PlaylistPageId div using the hidden class
                            document.getElementById("playlistColumn").classList.remove("hidden");
                            document.getElementById("PlaylistPageId").classList.add("hidden");
                        });

                        // clear all the children of class playlistItem
                        let playlistItems = document.getElementsByClassName("playlistItem");

                        while (playlistItems[0]) {
                            playlistItems[0].parentNode.removeChild(playlistItems[0]);
                        }

                        // Create an array to store the promises
                        let promises = [];

                        // append all the songs as children of the div using foreach
                        // Loop through the playlistSongs array
                        playlistSongs.forEach(song => {
                            // Create a promise for each makeCall request
                            let promise = new Promise((resolve, reject) => {
                                makeCall("GET", "GetSongDetailsAsJson?songName=" + song, null, request => {
                                    if (request.readyState == XMLHttpRequest.DONE) {
                                        // if the response status is 200 ok
                                        switch (request.status) {
                                            case 200:
                                                let songDetails = JSON.parse(request.responseText); // this is a list of strings

                                                // get userName from session
                                                let username = sessionStorage.getItem("user");
                                                let songBox = document.createElement("div");
                                                songBox.classList.add("playlistItem");

                                                // display the cover using getAlbumCover to get the image
                                                let coverDom = document.createElement("img");
                                                coverDom.src = "cover/" + username + "/" + songDetails["albumName"] + ".jpg";
                                                coverDom.classList.add("albumCover");
                                                songBox.appendChild(coverDom);

                                                // display the song name
                                                let songDom = document.createElement("div");
                                                songDom.innerText = song;
                                                songBox.appendChild(songDom);

                                                // append songBox to songsParent before button of id "nextButton"
                                                songsParent.insertBefore(songBox, document.getElementById("nextButton"));

                                                // add a listener to the div to make it clickable
                                                songDom.addEventListener('click', function () {
                                                    showPlayer(song)
                                                });

                                                // Resolve the promise
                                                resolve();
                                                break;
                                            default:
                                                // if the response status is other
                                                // print the error
                                                console.log("error");
                                                reject();
                                                break;
                                        }
                                    }
                                });
                            });

                            // Add the promise to the promises array
                            promises.push(promise);
                        });

                        // Wait for all playlistItems to be received
                        Promise.all(promises)
                            .then(async () => {

                                // Manipulate the "playlistItem" divs here
                                const playlistItems = Array.from(document.getElementsByClassName("playlistItem"));
                                const prevButton = document.getElementById("prevButton");
                                const nextButton = document.getElementById("nextButton");

                                const itemsPerPage = 5;
                                let currentPage = 1;

                                // Function to show items for the current page
                                function showItems() {
                                    const startIndex = (currentPage - 1) * itemsPerPage;
                                    const endIndex = startIndex + itemsPerPage;

                                    // Hide all playlist items
                                    playlistItems.forEach(item => {
                                        item.classList.add("hidden");
                                    });

                                    // Show items for the current page
                                    const itemsToShow = playlistItems.slice(startIndex, endIndex);
                                    itemsToShow.forEach(item => {
                                        item.classList.remove("hidden");
                                    });

                                    // Show/hide next and previous buttons based on current page
                                    if (currentPage === 1) {
                                        prevButton.classList.add("hidden");
                                    } else {
                                        prevButton.classList.remove("hidden");
                                    }

                                    if (endIndex >= playlistItems.length) {
                                        nextButton.classList.add("hidden");
                                    } else {
                                        nextButton.classList.remove("hidden");
                                    }
                                }

                                // Handle next button click
                                nextButton.addEventListener("click", () => {
                                    currentPage++;
                                    showItems();
                                });

                                // Handle previous button click
                                prevButton.addEventListener("click", () => {
                                    currentPage--;
                                    showItems();
                                });

                                // Show initial items
                                showItems();

                                // populate the addSongForm with the playlistName songs
                                let addSongButton = document.getElementById("addSongButton");
                                let addSongFormSelection = document.getElementById("addSongFormSelectionId");
                                let addSongForm = addSongButton.closest("form");

                                // clear all the children of class addSongFormSelection
                                let addSongFormSelectionItems = document.getElementsByClassName("addSongFormSelectionItem");
                                while (addSongFormSelectionItems[1]) {
                                    addSongFormSelectionItems[0].parentNode.removeChild(addSongFormSelectionItems[0]);
                                }

                                let allSongs = await getAllSongsForCheckboxes();

                                // append all the songs as children of the div using foreach
                                // Loop through the playlistSongs array
                                allSongs.forEach(song => {
                                    let songOption = document.createElement("option");
                                    songOption.innerText = song;
                                    songOption.value = song;
                                    addSongFormSelection.appendChild(songOption);
                                });

                                addSongButton.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    if (addSongForm.checkValidity()) {

                                        let playlistNameInAddSongForm = document.getElementById("playlistNameInAddSongFormId");
                                        playlistNameInAddSongForm.value = playlistName;

                                        makeCall("POST", "AddSong", addSongForm, request => {
                                            // check the response status
                                            if (request.readyState == XMLHttpRequest.DONE) {
                                                // if the response status is 200 ok
                                                switch (request.status) {
                                                    case 200:
                                                        getSongsInPlaylist(playlistName);
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

                            })
                            .catch(() => {
                                // An error occurred during one or more makeCall requests
                            });

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


    let getAllSongsForCheckboxes = async function () {
        return new Promise((resolve, reject) => {
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
                            });

                            // Resolve the promise
                            resolve(userSongs);

                            break;
                        default:
                            // if the response status is other
                            // print the error
                            console.log("error");
                            // Reject the promise
                            reject();
                            break;

                    }
                }
            });
        });
    }

    let showPlayer = function (songName) {
        let playerBarDiv = document.getElementById("SongPlayerBar");

        // get username from session
        let username = sessionStorage.getItem('user');

        // clear all the children of class playerBarDiv
        let playerBarChildren = document.getElementsByClassName("SongPlayerAudio");
        while (playerBarChildren[0]) {
            playerBarChildren[0].parentNode.removeChild(playerBarChildren[0]);
        }
        let playerBarChildren2 = document.getElementsByClassName("songDetail");
        while (playerBarChildren2[0]) {
            playerBarChildren2[0].parentNode.removeChild(playerBarChildren2[0]);
        }

        // add divs displaying title, author, album, genre, year, retrieved from makeCall to the servlet Get
        makeCall("GET", "GetSongDetailsAsJson?songName=" + songName, null, request => {
            if (request.readyState == XMLHttpRequest.DONE) {
                // if the response status is 200 ok
                switch (request.status) {
                    case 200:
                        let songDetails = JSON.parse(request.responseText); // this is a list of strings

                        // append all the song details as children of the div
                        for (let key in songDetails) {
                            if (songDetails.hasOwnProperty(key)) {
                                let div = document.createElement("div");
                                div.classList.add("songDetail");
                                div.innerText = key + ": " + songDetails[key];
                                playerBarDiv.appendChild(div);
                            }
                        }


                        break;
                    default:
                        // if the response status is other
                        // print the error
                        console.log("error");
                        break;

                }
            }
        })

        // create an audio element with the src of the song
        let audioElement = document.createElement("audio");
        audioElement.classList.add("SongPlayerAudio")
        audioElement.setAttribute("controls", "true");
        audioElement.setAttribute("src", "audioPlayer/" + username + "/" + songName + ".mp3");
        playerBarDiv.appendChild(audioElement);

        playerBarDiv.classList.remove("hidden");
    }

    // "main"

    // if session storage "user" is not set, redirect to login page
    if (sessionStorage.getItem('user') == null) {
        window.location.href = "index.html";
    }

    getPlaylists();
    getAllSongsForCheckboxes();

    // find the span with the id user
    let userDiv = document.getElementById("user");
    // set the text of the span to the username of the logged user
    userDiv.innerText = sessionStorage.getItem('nomeUser');

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