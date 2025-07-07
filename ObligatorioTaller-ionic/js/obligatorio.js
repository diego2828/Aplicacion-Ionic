/*usuario:diegomagarian*/
/*contrasenia:1234*/ 

class Usuario{
    constructor(usuario, password,pais){
        this.usuario= usuario
        this.password= password 
        this.pais= pais
     
    }
}

class UsuarioConectado{
    constructor(usuario, password){
        this.usuario= usuario 
        this.password= password
    }
}

class Actividad{
    constructor(idActividad, idUsuario, tiempo, fecha){
        this.idActividad= idActividad 
        this.idUsuario= idUsuario 
        this.tiempo= tiempo
        this.fecha= fecha
    }
}
 


const MENU= document.querySelector("#menu")
const ROUTER= document.querySelector("#ruteo")
const HOME= document.querySelector("#pantalla-home")
const LOGIN= document.querySelector("#pantalla-login")
const REGISTRARU= document.querySelector("#pantalla-registrarU")
const REGISTRARE= document.querySelector("#pantalla-registrarE")
const LISTADO= document.querySelector("#pantalla-listado")
const INFORME= document.querySelector("#pantalla-informe")
const MAPA= document.querySelector("#pantalla-mapa")




const URLBASE="https://movetrack.develotion.com/"

let listaActividadesUsuario = []; 
let paises 

cargarpaises()
cargarActividades() 


/*obtenerActividadesListado()*/


inicio()


function inicio(){
    ROUTER.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnRegistrarUsuario").addEventListener("click",previaRegistrarUsuario)
    document.querySelector("#btnHacerLogin").addEventListener("click",previaHacerLogin)
    document.querySelector("#btnHacerRegistroActividad").addEventListener("click",previaRegistrarActividad)
    document.querySelector("#btnLFiltrar").addEventListener("click",previaListado)
    document.querySelector("#btnInforme").addEventListener("click",previaCalcularInforme)
    document.querySelector("#btnMapa").addEventListener("click",previaMapa)




    document.querySelector("#btnMenuLogout").addEventListener("click",cerrarSesion)

    
    chequearSesion()
}
function cerrarMenu(){
   MENU.close()
}


function chequearSesion(){
    
    ocultarMenu()
    if (localStorage.getItem("usuario")!=null){
        mostrarMenuVIP()
    } else {
        mostrarMenuComun()
    }
}

function navegar(evt){
    let destino= evt.detail.to
    ocultarPantallas()
    if (destino=="/") HOME.style.display="block"
    if (destino=="/login") LOGIN.style.display="block"
    if (destino=="/registrarE") REGISTRARE.style.display="block"
    if (destino=="/registrarU") REGISTRARU.style.display="block"
    if (destino=="/listado") LISTADO.style.display="block"
    if (destino=="/informe") INFORME.style.display="block"
    if (destino=="/mapa") MAPA.style.display="block"




}

function ocultarPantallas(){
    HOME.style.display="none"
    LOGIN.style.display="none"
    REGISTRARU.style.display="none"
    REGISTRARE.style.display="none"
    LISTADO.style.display="none"
    INFORME.style.display="none"
    MAPA.style.display="none"

}

function previaRegistrarUsuario(){
    let usuario= document.querySelector("#txtRegistrarUUsuario").value  
    let password= document.querySelector("#txtRegistrarUPassword").value  
    let pais= document.querySelector("#slcRegistrarUPais").value  


    let nuevoUsuario= new Usuario(usuario, password, pais)
    hacerRegistroUsuario(nuevoUsuario)
}

function hacerRegistroUsuario(nuevoUsuario){
    fetch (`${URLBASE}usuarios.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
        })
        .then(function (response){
            console.log(response)
            return response.json()
        })
        .then(function(informacion){
             
            if (informacion.codigo=="200"){
                mostrarMensaje("SUCCESS","Registro exitoso","Puedes usar la APP",3000)
                ocultarPantallas()
                HOME.style.display="block"
                
               localStorage.setItem("usuario",informacion.id)
               localStorage.setItem("apiKey",informacion.apiKey)
                ocultarMenu()
                mostrarMenuVIP()
                mensajeBienvenida("SUCCESS","Cuenta Creada exitosamente",nuevoUsuario.usuario,3000)

            } else {
                mostrarMensaje("ERROR","Datos incorrectos","Revisa los datos",3000)

            }
            
        })
        .catch(function(error){
        console.log(error)
        })
}

function previaHacerLogin(){
  
    let usuario= document.querySelector("#txtLoginUsuario").value  
    let password= document.querySelector("#txtLoginPassword").value  

    let nuevoUsuarioConectado= new UsuarioConectado(usuario, password)
    hacerLogin(nuevoUsuarioConectado)
}


function hacerLogin(nuevoUsuarioConectado){
    listaActividadesUsuario.length = 0;
    console.log(nuevoUsuarioConectado)
    fetch (`${URLBASE}login.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuarioConectado)
        })
        .then(function (response){
            console.log(response)
            return response.json()
        })
        .then(function(informacion){
             console.log(informacion)
            if (informacion.codigo=="200"){
               
                ocultarPantallas()
                HOME.style.display="block"
                
               localStorage.setItem("usuario",informacion.id)
               localStorage.setItem("apiKey",informacion.apiKey)
                ocultarMenu()
                mostrarMenuVIP()
                mensajeBienvenida("SUCCESS","Bienvenido nuevamente",nuevoUsuarioConectado.usuario,3000)


            }else{
                mostrarMensaje("ERROR","Datos incorrectos","Revisa los datos",3000)

            }
            
        })
        .catch(function(error){
        console.log(error)

        })
}

function ocultarMenu(){
    document.querySelector("#btnMenuRegistrarU").style.display="none"
    document.querySelector("#btnMenuLogin").style.display="none"
    document.querySelector("#btnMenuRegistrarE").style.display="none"
    document.querySelector("#btnMenuListado").style.display="none"
    document.querySelector("#btnMenuLogout").style.display="none"
    document.querySelector("#btnInforme").style.display="none"
    document.querySelector("#btnMapa").style.display="none"

}

function mostrarMenuComun(){
    document.querySelector("#btnMenuRegistrarU").style.display="block"
    document.querySelector("#btnMenuLogin").style.display="block"
}

function mostrarMenuVIP(){
    document.querySelector("#btnMenuRegistrarE").style.display="block"
    document.querySelector("#btnMenuListado").style.display="block"
    document.querySelector("#btnMenuLogout").style.display="block"
    document.querySelector("#btnInforme").style.display="block"
    document.querySelector("#btnMapa").style.display="block"

    cargarActividades()  

}



function cerrarSesion(){
     ocultarPantallas()
     HOME.style.display="block"
     mostrarMensaje("SUCCESS","Sesion cerrada","Hasta pronto :)",3000)
     ocultarMenu()
     mostrarMenuComun()
     localStorage.removeItem("usuario")
     localStorage.removeItem("apiKey")

}


function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
    duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
    toast.color = 'danger';
    toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
    toast.color = 'warning';
    toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
    toast.color = 'success';
    toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}
function mensajeBienvenida(tipo, titulo, nombreUsuario, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = nombreUsuario;
    if (!duracion) {
    duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "SUCCESS") {
    toast.color = 'success';
    toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}

function cargarpaises(){
    obtenerPaises()
}

function obtenerPaises(){
  
    fetch (`https://movetrack.develotion.com/paises.php`,{
        method:'GET',
        headers:{
        'Content-Type': 'application/json',
        
        }
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
            cargarSelectPaises(informacion.paises)
            paises = informacion.paises; // guardo los países en la variable global para el mapa

        })
        .catch(function(error){
        console.log(error)
        })
}




function cargarSelectPaises(listaPaises){
    let miSelect=""
    for (let unPais of listaPaises){
        miSelect+=`<ion-select-option value=${unPais.id}>${unPais.name}</ion-select-option>`
    }
    document.querySelector("#slcRegistrarUPais").innerHTML= miSelect
}


function cargarActividades(){
    obtenerActividades()
}
function obtenerActividades(){
  
    fetch (`https://movetrack.develotion.com/actividades.php`,{
        method:'GET',
        headers:{
        'Content-Type': 'application/json',
        'apikey':localStorage.getItem("apiKey"),
        'iduser':localStorage.getItem("usuario")
        
        }
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
            cargarSelectActividades(informacion.actividades)
        })
        .catch(function(error){
        console.log(error)
        })
}

function cargarSelectActividades(listaActividades){
    let miSelect=""
    for (let unaActividad of listaActividades){
        miSelect+=`<ion-select-option value=${unaActividad.id}>${unaActividad.nombre}</ion-select-option>`
    }
    document.querySelector("#slcRegistrarEActividad").innerHTML= miSelect
}


function previaRegistrarActividad(){

    let idActividad= document.querySelector("#slcRegistrarEActividad").value 
    let tiempo= document.querySelector("#txtRegistrarETiempo").value  
    let fecha= document.querySelector("#txtRegistrarEFecha").value  
    let idUsuario= localStorage.getItem("usuario")


    if (idActividad === undefined || tiempo === '' || fecha == undefined ){
        
        return mostrarMensaje("ERROR","Todos los campos son obligatorios","",3000)
    }
    if (tiempo <=0){
        
        return mostrarMensaje("ERROR","El tiempo debe ser mayor a 0","",3000)
    }
    


    let unaActividad= new Actividad(idActividad, idUsuario, tiempo, fecha)
    registrarActividad(unaActividad)

}


function registrarActividad(unaActividad){
    
    fetch (`${URLBASE}registros.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json',
        'apikey':localStorage.getItem("apiKey"),
        'iduser':localStorage.getItem("usuario"),
        
        },
        body: JSON.stringify(unaActividad)
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
            if (informacion.codigo>199 && informacion.codigo<300){
                mostrarMensaje("SUCCESS","Actividad registrada exitosamente","",3000)
                
            } else {
                mostrarMensaje("ERROR","Datos incorrectos","Comprueba campos ingresados",3000)
            }


        })
        .catch(function(error){
        console.log(error)
        })
}


document.addEventListener('DOMContentLoaded', (event) => {limitarFechaActual();});
    function limitarFechaActual() {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
        const dia = ('0' + hoy.getDate()).slice(-2);
        const horas = ('0' + hoy.getHours()).slice(-2);
        const minutos = ('0' + hoy.getMinutes()).slice(-2);
        const segundos = ('0' + hoy.getSeconds()).slice(-2);
        const fechaMaxima = `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
        document.querySelector('#txtRegistrarEFecha').setAttribute('max', fechaMaxima);
        
    }


    function obtenerActividadesListado(){

        fetch (`https://movetrack.develotion.com/actividades.php`,{
            method:'GET',
            headers:{
            'Content-Type': 'application/json',
            'apikey':localStorage.getItem("apiKey"),
            'iduser':localStorage.getItem("usuario")
            }
            })
            .then(function (response){
                return response.json()
            })
            .then(function(respuesta){
                console.log(respuesta)
                listaActividadesUsuario=respuesta.actividades
             
             })
            .catch(function(error){
                console.log(error)
            })
    }
    
function previaListado() {
    obtenerActividadesListado()

    let filtro = document.querySelector("#slcFiltroListado").value;

    

    let url = "https://movetrack.develotion.com/registros.php?idUsuario=" + localStorage.getItem("usuario");
    fetch(`${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("usuario")
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (informacion) {
        let registrosFiltrados = filtrarActividades(informacion.registros, filtro);
        mostrarListado(registrosFiltrados);
    })
    .catch(function (error) {
        console.log(error);
    });
}

function filtrarActividades(registros, filtro) {
    const ahora = new Date();
    return registros.filter(registro => {
        let fechaRegistro = new Date(registro.fecha); 


        if (filtro === "hoy") {

            const fechaActual = new Date().toISOString().split('T')[0];


            return registro.fecha === fechaActual ;
        }else if (filtro === "semana") {
            let unaSemanaAtras = new Date();
            unaSemanaAtras.setDate(ahora.getDate() - 7);
            return fechaRegistro >= unaSemanaAtras && fechaRegistro <= ahora;
        } else if (filtro === "mes") {
            let unMesAtras = new Date();
            unMesAtras.setMonth(ahora.getMonth() - 1);
            return fechaRegistro >= unMesAtras && fechaRegistro <= ahora;
        } else if (filtro === "historialCompleto") {
            return true; // Retorna todos los registros
        }
        return false;
    });
}



function mostrarListado(listaRegistros){

    let misRegistros=""
    for (let unRegistro of listaRegistros){
        misRegistros+=`
        <ion-item>
                <ion-img src="${obtenerUrlImagenActividad(unRegistro.idActividad)}"></ion-img>
                <ion-label>
                    <h3>Id: ${unRegistro.id}</h2>
                    <h3>Actividad: ${obtenerNombreActividad(unRegistro.idActividad)}</h3>
                    <p>Tiempo: ${unRegistro.tiempo}</p>
                    <p>Fecha: ${unRegistro.fecha}</p>
                   
                </ion-label>
                <ion-button onclick="eliminarPedido(${unRegistro.id})">Eliminar</ion-button>
        </ion-item>
       `
    }
    document.querySelector("#contenedorListado").innerHTML=misRegistros
}



function eliminarPedido(idRegistro){
    let url="https://movetrack.develotion.com/registros.php?idRegistro="+idRegistro
    fetch(`${url}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'apikey':localStorage.getItem("apiKey"),
        'iduser':localStorage.getItem("usuario")
        },
        
        })
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
            mostrarMensaje("SUCCESS","Actividad eliminada exitosamente","",3000)
            previaListado()
        }
        )
        .catch(function(error){
        console.log(error)
        })

}

function obtenerNombreActividad(idActividad){

    for (let unaActividad of listaActividadesUsuario){
        if (unaActividad.id==idActividad) return unaActividad.nombre
    }

}

function obtenerUrlImagenActividad(idActividad){
    for (let unaActividad of listaActividadesUsuario){
        if (unaActividad.id==idActividad) return url="https://movetrack.develotion.com/imgs/"+unaActividad.imagen+".png"
    }
}

function previaCalcularInforme() {
    let url = "https://movetrack.develotion.com/registros.php?idUsuario=" + localStorage.getItem("usuario");
    fetch(`${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("usuario")
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (informacion) {
        calcularTiempoTotal(informacion.registros);

        let registrosdiaHoy = filtrarActividades(informacion.registros, "hoy");
        calcularTiempoHoy(registrosdiaHoy);
        console.log(registrosdiaHoy)
    })
    .catch(function (error) {
        console.log(error);
    });
}
    
function calcularTiempoTotal(listaActiv){

    let total = 0
    for (let actividad of listaActiv){
        total+=actividad.tiempo
    }
    document.querySelector("#txtTiempoTotal").innerHTML= total + " Minutos"
  
}

function calcularTiempoHoy(listaHoy){

    let total =0
    for (let actividad of listaHoy){
        total+= actividad.tiempo
    }
    document.querySelector("#txtTiempoHoy").innerHTML= total + " Minutos"
  
}

 
let listaUsuariosPorPais = []; 



function previaMapa(){
  
    fetch (`https://movetrack.develotion.com/usuariosPorPais.php`,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
            'apikey':localStorage.getItem("apiKey"),
            'iduser':localStorage.getItem("usuario")
            
        }
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
            
            listaUsuariosPorPais = informacion.paises; // guardo los países en la variable global para el mapa
            armarMapa()

        })
        .catch(function(error){
        console.log(error)
        })
}






function armarMapa(){

    

    let marker
    map = L.map('map').setView([-32.8755548,-56.0201525], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 3,
        attribution: 'OpenStreetMap'
    }).addTo(map);


    for(let unPais of paises){
        marker = L.marker([unPais.latitude, unPais.longitude]).addTo(map);
        info = `${unPais.name} -> Cantidad de usuarios:${obtenerUsuariosPorPais(unPais.id)}`
        marker.bindPopup(info).openPopup();
    }
    console.log("paises")
    console.log(paises)
    console.log("U por pais")
    console.log(listaUsuariosPorPais)
}
function obtenerUsuariosPorPais(id){

    for (let unPais of listaUsuariosPorPais){
        if(unPais.id==id)return unPais.cantidadDeUsuarios
    }


}






/*de esta linea para arrriba es codigo del obligatorio*/ 


