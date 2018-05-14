var formIniciarSesion = document.getElementById('form-iniciar-sesion');
var btnIniciarSesion = document.getElementById('btn-iniciar-sesion');

formIniciarSesion.addEventListener('submit', function(event) {
    event.preventDefault();
});

btnIniciarSesion.addEventListener('click', function() {
    var data = {
        "usuario": $("input[name=usuario]").val(), 
        "contrasenia": $("input[name=contrasenia]").val()
    };

    $.ajax({
        type: "POST", 
        url: "IniciarSesion", 
        data: data
    })
    .done(function(response) { 
        var responseOriginal = response;
        response = response.replace(/\s/g, '');

        if (response.startsWith('encontrado')) {
            response = response.split(';');
            responseOriginal = responseOriginal.split(';');

            sessionStorage.setItem('idUsuario', responseOriginal[1])
            sessionStorage.setItem('nombreUsuario', responseOriginal[2]);

            if (response[3] == 'cliente') {
                window.open('espejo.html', '_self');
            } else if (response[3] == 'estilista') {
                window.open('estilista.html', '_self');
            }
        } else if (response == 'noEncontrado'){
            alert('¡Ha ingresado un usuario o contraseña incorrecta!');
        } else {
            alert('Se ha producido un error, recargue la página e inténtelo de nuevo.');
        }
    })
    .fail(function(jqXHR, textStatus) {
        console.log("jqXR: " + jqXHR + " textStatus: " + textStatus);
    });
});