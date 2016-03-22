(function() {

    var buttonText = {
        disable: "Disable Disrupt->Bullshit Translation",
        enable: "Enable Disrupt->Bullshit Translation"
    };

    var submitButton = document.getElementById("submitButton");
    var reloadCheckbox = document.getElementById("reloadCheckbox");

    // for some reason all the dom-ready type functions aren't working
    // so I'll just use a timeout for the removal of the
    // annoying pre-blurring of this button. Hacky.
    setTimeout(submitButton.blur.bind(submitButton), 100);

    browserPlugin.isDisabled(function(disabled) {
        submitButton.innerHTML = disabled ? buttonText.enable : buttonText.disable;
    });

    submitButton.addEventListener("click", function() {
        browserPlugin.toggleDisabled(function() {
            if (reloadCheckbox.checked) {
                browserPlugin.reloadActiveTab();
            }
            window.close();
        });
    });
})();
