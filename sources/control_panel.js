(function() {

    var buttonText = {
        disable: "Disable Disrupt->Bullshit Translation",
        enable: "Enable Disrupt->Bullshit Translation"
    };

    var submitButton = document.getElementById("submitButton");
    var reloadCheckbox = document.getElementById("reloadCheckbox");

    browserPlugin.isEnabled(function(enabled) {
        submitButton.innerHTML = enabled ? buttonText.disable : buttonText.enable;
    });

    submitButton.addEventListener("click", function() {
        browserPlugin.toggleEnabled(function() {
            if (reloadCheckbox.checked) {
                browserPlugin.reloadActiveTab();
            }
            window.close();
        });
    });
})();
