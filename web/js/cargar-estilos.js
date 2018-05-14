document.getElementById('nombre-usuario').innerHTML = sessionStorage.getItem('nombreUsuario');

$.ajax({
    type: "POST", 
    url: "CargarEstilos"
})
.done(function(response) { 
    contenido.innerHTML = response;
})
.fail(function(jqXHR, textStatus) {
    console.log("jqXR: " + jqXHR + " textStatus: " + textStatus);
});