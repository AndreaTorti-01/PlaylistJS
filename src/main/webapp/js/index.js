(function () {
    const loginButton = document.getElementById("loginButton");
    const form = loginButton.closest("form");

    // Add event listener to the form for the Enter key press
    form.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            loginButton.click(); // Trigger the login button click event
        }
    });

    // Add event listener to the login button
    loginButton.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent form submission

        // Check if the form is valid -> every field has been filled and the data inserted
        if (form.checkValidity()) {
            // Make the call to the server
            makeCall("POST", 'CheckLogin', form, function (req) {
                if (req.readyState == XMLHttpRequest.DONE) {
                    let message = req.responseText;
                    switch (req.status) {
                        // If ok -> set the userName in the session
                        case 200:
                            // message is json containing nomeUser and user to save in session storage
                            const json = JSON.parse(message);
                            sessionStorage.setItem('nomeUser', json.nomeUser);
                            sessionStorage.setItem('user', json.user);
                            window.location.href = "home.html";
                            break;
                        // If ko -> show the error
                        default:
                            document.getElementById("error").textContent = message;
                            break;
                    }
                }
            });
        } else {
            form.reportValidity();
        }
    });
})();
