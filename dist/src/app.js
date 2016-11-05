window.onload = function () {
    var el = document.getElementById("music");
    var app = redaMusicSpectrum.Bootstrapper.init();
    app.launch(el);
};
