namespace redaMusicSpectrum {
    export class Bootstrapper {
        private static _spectrum: Bootstrapper = new Bootstrapper();
        constructor() {
            if (Bootstrapper._spectrum) {
                throw new Error("Error: Instantiation failed: try init() instead of new.");
            }
            Bootstrapper._spectrum = this;
        }
        public static init(): Bootstrapper {

            return Bootstrapper._spectrum;
        }
        public launch(canvas: HTMLElement): void {
            let cnv = <HTMLCanvasElement>canvas;
            // check webgl support
         if (this.checkWebGlSupport(cnv)) {
                //resize canvas
                let width = window.innerWidth;
                let height = window.innerHeight;
                cnv.width = width;
                cnv.height = height;
                //supposing Audio web API works
                //window.AudioContext = window.webkitAudioContext;

                //create new audio context
                let Audiocontext = new AudioContext();
                //create canvas context
                let CanvasContext = cnv.getContext("2d");

                let sourceNode;
                let analyser;
                let javascriptNode;
                let audioBuffer;

                let url = "../audio/Alan Walker - Fade [NCS Release].mp3";

                //create gradient
                let gradient = CanvasContext.createLinearGradient(0, 0, 0, height / 2);
                gradient.addColorStop(0, '#aac8de');
                gradient.addColorStop(0.25, '#44a1e2');
                gradient.addColorStop(0.75, '#0d83d5');
                gradient.addColorStop(1, '#005a99');

                //-------------- Setup Javascript Node -----------------
                javascriptNode = Audiocontext.createScriptProcessor(2048, 1, 1);
                // connect to destination, else it isn't called
                javascriptNode.connect(Audiocontext.destination);

                //------------- Setup Analyser Node ---------------------
                analyser = Audiocontext.createAnalyser();
                analyser.smoothingTimeConstant = 0.4;
                analyser.fftSize = 1024;

                //-------------- Setup Source Node -----------------
                //create a buffer source node
                sourceNode = Audiocontext.createBufferSource();
                let request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                //When loaded decode the data
                request.onload = function () {
                    //decode data
                    Audiocontext.decodeAudioData(request.response, function (buffer) {
                        //when the audio is decoded play the sound
                        sourceNode.buffer = buffer;
                        sourceNode.start(0);
                    }, function onError(e) {
                        console.log(e);
                    });
                }
                request.send();

                //Connect all nodes together
                sourceNode.connect(analyser);
                analyser.connect(javascriptNode);
                sourceNode.connect(Audiocontext.destination);

              // when the javascript node is called
              // we use information from the analyzer node
              // to draw the volume
                javascriptNode.onaudioprocess = function() {

                // get the average for the first channel
                var array =  new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);

                // clear the current state
                CanvasContext.clearRect(0, 0, width, height);
                //draw
                 for ( var i = 0; i < (array.length); i++ ){
                    var value = array[i];
                    //set the fill style
                    CanvasContext.fillStyle=gradient;
                    CanvasContext.fillRect(i*4,(height/2)-value,3,height/2-((height/2)-value));
                    CanvasContext.fillStyle="#323232";
                    CanvasContext.fillRect(i*4,height/2,3,value);
                      }
                  }
            }
       }
        private checkWebGlSupport(canvas: HTMLCanvasElement): boolean {
            let support: boolean = true;
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
        }
    }
}