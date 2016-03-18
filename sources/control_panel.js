(function() {

    var buttonText = {
        disable: "Disable Disrupt->Bullshit Translation",
        enable: "Enable Disrupt->Bullshit Translation"
    };

    function toggleElementText(el, text1, text2) {
        if (el.innerHTML == text1) {
            el.innerHTML = text2;
        }
        else {
            el.innerHTML = text1;
        }
    }
    var submitButton = document.getElementById("submitButton");
    var reloadCheckbox = document.getElementById("reloadCheckbox");

    browserPlugin.isEnabled(function(enabled) {
        submitButton.innerHTML = enabled ? buttonText.disable : buttonText.enable;
    });

    submitButton.addEventListener("click", function() {
        toggleElementText(submitButton, buttonText.disable, buttonText.enable);
        browserPlugin.toggleEnabled(function() {
            if (reloadCheckbox.checked) {
                browserPlugin.reloadActiveTab();
            }
        });
    });
})();
