var redaMusicSpectrum;
(function (redaMusicSpectrum) {
    var Bootstrapper = (function () {
        function Bootstrapper() {
            if (Bootstrapper._spectrum) {
                throw new Error("Error: Instantiation failed: try init() instead of new.");
            }
            Bootstrapper._spectrum = this;
        }
        Bootstrapper.init = function () {
            return Bootstrapper._spectrum;
        };
        Bootstrapper.prototype.launch = function (canvas) {
            var cnv = canvas;
            if (this.checkWebGlSupport(cnv)) {
                var width_1 = window.innerWidth;
                var height_1 = window.innerHeight;
                cnv.width = width_1;
                cnv.height = height_1;
                var Audiocontext_1 = new AudioContext();
                var CanvasContext_1 = cnv.getContext("2d");
                var sourceNode_1;
                var analyser_1;
                var javascriptNode = void 0;
                var audioBuffer = void 0;
                var url = "../audio/Alan Walker - Fade [NCS Release].mp3";
                var gradient_1 = CanvasContext_1.createLinearGradient(0, 0, 0, height_1 / 2);
                gradient_1.addColorStop(0, '#aac8de');
                gradient_1.addColorStop(0.25, '#44a1e2');
                gradient_1.addColorStop(0.75, '#0d83d5');
                gradient_1.addColorStop(1, '#005a99');
                javascriptNode = Audiocontext_1.createScriptProcessor(2048, 1, 1);
                javascriptNode.connect(Audiocontext_1.destination);
                analyser_1 = Audiocontext_1.createAnalyser();
                analyser_1.smoothingTimeConstant = 0.4;
                analyser_1.fftSize = 1024;
                sourceNode_1 = Audiocontext_1.createBufferSource();
                var request_1 = new XMLHttpRequest();
                request_1.open('GET', url, true);
                request_1.responseType = 'arraybuffer';
                request_1.onload = function () {
                    Audiocontext_1.decodeAudioData(request_1.response, function (buffer) {
                        sourceNode_1.buffer = buffer;
                        sourceNode_1.start(0);
                    }, function onError(e) {
                        console.log(e);
                    });
                };
                request_1.send();
                sourceNode_1.connect(analyser_1);
                analyser_1.connect(javascriptNode);
                sourceNode_1.connect(Audiocontext_1.destination);
                javascriptNode.onaudioprocess = function () {
                    var array = new Uint8Array(analyser_1.frequencyBinCount);
                    analyser_1.getByteFrequencyData(array);
                    CanvasContext_1.clearRect(0, 0, width_1, height_1);
                    for (var i = 0; i < (array.length); i++) {
                        var value = array[i];
                        CanvasContext_1.fillStyle = gradient_1;
                        CanvasContext_1.fillRect(i * 4, (height_1 / 2) - value, 3, height_1 / 2 - ((height_1 / 2) - value));
                        CanvasContext_1.fillStyle = "#323232";
                        CanvasContext_1.fillRect(i * 4, height_1 / 2, 3, value);
                    }
                };
            }
        };
        Bootstrapper.prototype.checkWebGlSupport = function (canvas) {
            var support = true;
            try {
                canvas.getContext("2d") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                support = true;
            }
            catch (e) {
                canvas = null;
                console.log("WebGL not supported");
                support = false;
            }
            return support;
        };
        Bootstrapper._spectrum = new Bootstrapper();
        return Bootstrapper;
    }());
    redaMusicSpectrum.Bootstrapper = Bootstrapper;
})(redaMusicSpectrum || (redaMusicSpectrum = {}));
