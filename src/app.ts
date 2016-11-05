window.onload = () => {
    let el: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("music");
    let app: redaMusicSpectrum.Bootstrapper = redaMusicSpectrum.Bootstrapper.init();
    app.launch(el);
};