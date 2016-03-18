(function() {

    var buttonText = {
        disable: "Disable Disrupt->Bullshit Translation",
        enable: "Enable Disrupt->Bullshit Translation"
    };

    var submitButton = document.getElementById("submitButton");
    var reloadCheckbox = document.getElementById("reloadCheckbox");

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
