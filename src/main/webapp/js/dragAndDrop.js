var handleSorting = new HandleSorting();

function HandleSorting() {

    let startElement = null;


    this.addEventListeners = function () {
        let elements = document.getElementsByClassName('playlistItem');

        for (let i = 0; i < elements.length; i++) {
            elements[i].draggable = true;
            elements[i].addEventListener("dragstart", dragStart);
            elements[i].addEventListener("dragover", dragOver);
            elements[i].addEventListener("dragleave", dragLeave);
            elements[i].addEventListener("drop", drop);

        }
    }

    function unselectedElems(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add("notSelected");
        }
    }


    function dragStart(event) {
        startElement = event.target.closest(".playlistItem");
        console.log("drag iniziato");
    }


    function dragOver(event) {
        event.preventDefault();
        let dest = event.target.closest(".playlistItem");
        dest.classList.add("selected");
        console.log("drag terminato");
    }


    function dragLeave(event) {
        let dest = event.target.closest(".playlistItem");
        dest.classList.add("notSelected");
    }

    function drop(event) {
        let dest = event.target.closest(".playlistItem");
        // get the index of the element being dragged
        let div = dest.closest("#PlaylistPageId");
        let elems = Array.from(div.querySelectorAll('div'));
        let indexDest = elems.indexOf(dest);

        if (elems.indexOf(startElement) < indexDest) {
            startElement.parentElement.insertBefore(startElement, elems[indexDest + 1]);
        } else {
            startElement.parentElement.insertBefore(startElement, elems[indexDest]);
        }
        unselectedElems(elems);
    }


}