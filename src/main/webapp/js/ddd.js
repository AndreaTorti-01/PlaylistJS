let ddd = function () {

    const elems = document.getElementsByClassName('playlistItem');
    for (let i = 0; i < elems.length; i++) {
        console.log(i);
        elems[i].draggable = true;
        elems[i].addEventListener('dragstart', dragStart);
        elems[i].addEventListener('dragover', dragOver);
        elems[i].addEventListener('dragleave', dragLeave);
        elems[i].addEventListener('drop', drop);

    }

    function dragStart(event) {
        console.log("drag iniziato");
    }

    function dragOver(event) {
        console.log("drag terminato");
    }

    function dragLeave(event) {
        console.log("drag iniziato");
    }

    function drop(event) {
        console.log("drag iniziato");
    }

}