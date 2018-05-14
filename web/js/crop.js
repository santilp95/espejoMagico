var inputImagen = document.getElementById('input-imagen');
var canvas = document.getElementById('panel');
var ctx = canvas.getContext('2d');

// número de peinados en la carpeta
var numeroPeinados = 7;

var panelPeinados = document.getElementById('panel-peinados');

inputImagen.addEventListener('change', cambiarImagen);

for (var i = 0; i < numeroPeinados; i++) {
    var peinado = new Image();
    peinado.setAttribute('src', 'peinados/peinado' + (i+1) + '.png');
    peinado.classList.add('peinado');
    panelPeinados.appendChild(peinado);
}

var peinados = document.getElementsByClassName('peinado');
var divCropResult = document.getElementById('div-crop-result');

for (var i = 0; i < peinados.length; i++) {
    peinados[i].addEventListener("click", function() {
        limpiarPeinadoEncima();
        var peinadoEncima = this.cloneNode(true);
        peinadoEncima.classList.remove('peinado');
        peinadoEncima.classList.add('peinado-encima');
        $(peinadoEncima).draggable();
        divCropResult.appendChild(peinadoEncima);
    });
}

function cambiarImagen(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imagenSubida = new Image();
        imagenSubida.src = event.target.result;
        imageCropper.init(imagenSubida);
    }
    reader.readAsDataURL(e.target.files[0]);
}

var imageCropper = {
    ctx: document.getElementById("panel").getContext("2d"),
    image: new Image(),
    scale: 1,
    click: false,
    baseX: 0,
    baseY: 0,
    lastPointX: 0,
    lastPointY: 0,
    cutoutWidth: 40,
    windowWidth: 300,
    
    init: function (imagenSubida) {
        this.image = imagenSubida;
        this.image.setAttribute('crossOrigin', 'anonymous');
        this.image.onload = this.onImageLoad.bind(this);
        document.getElementById("cropImgButtn").onclick = this.showCropedImage.bind(this);
        document.getElementById("scaleSlider").oninput = this.updateScale.bind(this);
    },

    /**
     * Animation on the canvas depends on three events of mouse. down, up and move
     */
    onImageLoad: function () {
        this.drawimage(0, 0);
        this.ctx.canvas.onmousedown = this.onMouseDown.bind(this);
        this.ctx.canvas.onmousemove = this.onMouseMove.bind(this);
        this.ctx.canvas.onmouseup = this.onMouseUp.bind(this);
    },

    /**
     * Draw image on canvas, after any changes
     * @param  {[type]} x
     * @param  {[type]} y
     * @return {[type]}
     */
    drawimage: function (x, y) {
        var w = this.ctx.canvas.width,
            h = this.ctx.canvas.height;
        this.ctx.clearRect(0, 0, w, h);
        this.baseX = this.baseX + (x - this.lastPointX);
        this.baseY = this.baseY + (y - this.lastPointY);
        this.lastPointX = x;
        this.lastPointY = y;
        this.ctx.drawImage(this.image, this.baseX, this.baseY, Math.floor(this.image.width * this.scale), Math.floor(this.image.height * this.scale));
        this.drawCutout();
    },

    /**
     * Responsible to draw the cutout over canvas, clockwise rectangle and anticlock wise rectangle, make sure a cutout.
     * @return {[type]}
     */
    drawCutout: function () {
        this.ctx.fillStyle = 'rgba(128, 128, 128, 0.7)';
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //Draw anti clockwise rectangle, for cutout.
        this.ctx.moveTo(this.cutoutWidth, this.cutoutWidth);
        this.ctx.lineTo(this.cutoutWidth, this.windowWidth + this.cutoutWidth);
        this.ctx.lineTo(this.cutoutWidth + this.windowWidth, this.cutoutWidth + this.windowWidth);
        this.ctx.lineTo(this.cutoutWidth + this.windowWidth, this.cutoutWidth);
        this.ctx.closePath();
        this.ctx.fill();
    },

    /**
     * Get call on mouse press, make click variable to true, which will be used in mousemove events
     * It also set the point were mouse click happened.
     * @param  {[type]} e
     * @return {[type]}
     */
    onMouseDown: function (e) {
        e.preventDefault();
        var loc = this.windowToCanvas(e.clientX, e.clientY);
        this.click = true;
        this.lastPointX = loc.x;
        this.lastPointY = loc.y;
    },

    /**
     * Track the mouse movment and draw the image accordingly, but only when clicked happened.
     * @param  {[type]} e
     * @return {[type]}
     */
    onMouseMove: function (e) {
        e.preventDefault();
        if (this.click) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.drawimage(loc.x, loc.y);
        }
    },

    /**
     * make click = false, hence no canvas draw on mousemovment.
     * @param  {[type]} e
     * @return {[type]}
     */
    onMouseUp: function (e) {
        e.preventDefault();
        this.click = false;
    },

    /**
     * Translate to HTML coardinates to Canvas coardinates.
     */
    windowToCanvas: function (x, y) {
        var canvas = this.ctx.canvas;
        var bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    },

    /**
     * Get the canavs, remove cutout, create image elemnet on UI.
     * @return {[type]}
     */
    showCropedImage: function () {
        var temp_ctx, temp_canvas;
        temp_canvas = document.createElement('canvas');
        temp_ctx = temp_canvas.getContext('2d');
        temp_canvas.width = this.windowWidth;
        temp_canvas.height = this.windowWidth;
        temp_ctx.drawImage(this.ctx.canvas, this.cutoutWidth, this.cutoutWidth, this.windowWidth, this.windowWidth, 0, 0, this.windowWidth, this.windowWidth);
        var vData = temp_canvas.toDataURL();
        document.getElementById('crop_result').src = vData;
    },
    /**
     * Update image zoom scale on slider movment.
     * @param  {[type]} e
     * @return {[type]}
     */
    updateScale: function (e) {
        this.scale = e.target.value;
        this.drawimage(this.lastPointX, this.lastPointY);
    }
};

$('#btn-descargar').click(function() {
    html2canvas($('#div-crop-result'), {
        onrendered: function(canvas) {
            theCanvas = canvas;

            canvas.toBlob(function(blob) {
                var fd = new FormData();
                fd.append('idUsuario', sessionStorage.getItem('idUsuario'));
                fd.append('peinado', blob);

                $.ajax({
                    type: 'POST', 
                    url: 'GuardarPeinado', 
                    data: fd, 
                    processData: false, 
                    contentType: false
                })
                .done(function(response) {
                    console.log(response);
                    if (response.replace(/\s/g, '') == "correcto") {
                        alert('¡El peinado se ha guardado exitósamente en la base de datos!');
                    }
                })
                .fail(function(jqXHR, textStatus) {
                    console.log("jqXR: " + jqXHR + " textStatus: " + textStatus);
                });
            });
        }
    });
}); 

var btnLimpiar = document.getElementById('btn-limpiar');

btnLimpiar.addEventListener('click', limpiarPeinadoEncima);

function limpiarPeinadoEncima() {
    var arrayPeinadosEncima = document.getElementsByClassName('peinado-encima');
    
    for (var i = 0; i < arrayPeinadosEncima.length; i++) {
        arrayPeinadosEncima[i].parentNode.removeChild(arrayPeinadosEncima[i]);
    }
}