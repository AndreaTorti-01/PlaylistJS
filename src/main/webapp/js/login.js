/**
 * Login
 */
(function () {
    document.getElementById("loginButton").addEventListener('click', (e) => {

        //Take the closest form
        let form = e.target.closest("form");

        // Check if the form is valid -> every field has been filled
        // and the data inserted
        if (form.checkValidity()) {

            //Make the call to the server
            makeCall("POST", 'CheckLogin', form,
                req => {

                    if (req.readyState == XMLHttpRequest.DONE) {
                        let message = req.responseText;
                        switch (req.status) {
                            //If ok -> set the userName in the session
                            case 200:
                                sessionStorage.setItem('user', message);
                                window.location.href = "home.html";
                                break;
                            //If ko -> show the error
                            default:
                                document.getElementById("error").textContent = message;
                                break;
                        }
                    }
                }
            );
        } else {
            form.reportValidity();
        }
    });
})();