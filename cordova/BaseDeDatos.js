var bd;
var cajaContactos;
var ultimaBusqueda='';

function IniciarBaseDatos(){
    var busqueda = document.querySelector("#formulario-busqueda");
    busqueda.addEventListener("submit", buscarContacto);
    cajaContactos = document.querySelector(".caja-contactos");
    var BtnGuardar = document.querySelector("#btn-guardar");
    BtnGuardar.addEventListener("click", AlmacenarContacto);

    var solicitud = indexedDB.open("Datos-De-Contactos");

    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearAlmacen);
}

function MostrarError(evento){
    var error = evento.target.error;
    alert("Tenemos un ERROR: " + error.code + " / " + error.message);
}

function Comenzar(evento){
    bd = evento.target.result;
    Mostrar();
}

function CrearAlmacen(evento){
    var basededatos = evento.target.result;
    var almacen = basededatos.createObjectStore("Contactos", {keyPath: "id"});
    almacen.createIndex("BuscarNombre", "nombre", {unique: false});
}

function AlmacenarContacto(){
    obtenerIdMasAlto().then(idMasAlto => {
        var N = document.querySelector("#nombre").value.toLowerCase();
        var I = idMasAlto+1;
        I=String(I);
        var E = document.querySelector("#edad").value;

        var transaccion = bd.transaction(["Contactos"], "readwrite");
        var almacen = transaccion.objectStore("Contactos");
        transaccion.addEventListener("complete", Mostrar)

        almacen.add({
            id: I,
            nombre: N,
            edad: E
        });

        document.querySelector("#nombre").value = "";
        document.querySelector("#id").value = "";
        document.querySelector("#edad").value = "";
    });
    /* var N = document.querySelector("#nombre").value.toLowerCase();
    var I = document.querySelector("#id").value;
    var E = document.querySelector("#edad").value;

    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
    transaccion.addEventListener("complete", Mostrar)

    almacen.add({
        id: I,
        nombre: N,
        edad: E
    });

    document.querySelector("#nombre").value = "";
    document.querySelector("#id").value = "";
    document.querySelector("#edad").value = ""; */
}

function Mostrar(){
    cajaContactos.innerHTML = "";

    var transaccion = bd.transaction(["Contactos"]);
    var almacen = transaccion.objectStore("Contactos");

    var puntero = almacen.openCursor();
    obtenerContactos().then(contactos => {
        contactos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        MostrarContactos(contactos);
    });
}

function MostrarContactos(evento){
    evento.forEach(puntero => {
        cajaContactos.innerHTML += `<div class='col-6 d-flex justify-content-start'>
                                        ${puntero.nombre} / 
                                        ${puntero.id} / 
                                        ${puntero.edad}
                                    
                                        <input type='button' class='btn-editar' value='Editar' onclick='seleccionarContacto("${puntero.id}")'>
                                        <input type='button' class='btn-borrar' value='Borrar' onclick='eliminarContacto("${puntero.id}")'>
                                    </div>`;
    });
    /* var puntero = evento.target.result;
    if(puntero){
        cajaContactos.innerHTML += "<div>" +
                                        puntero.value.nombre + " / " +
                                        puntero.value.id + " / " +
                                        puntero.value.edad +
                                        "<input type='button' class='btn-editar' value='Editar' onclick='seleccionarContacto(\"" + puntero.value.id + "\")'>" +
                                        "<input type='button' class='btn-borrar' value='Borrar' onclick='eliminarContacto(\"" + puntero.value.id + "\")'>" +
                                "</div>";
        puntero.continue();
    } */
}
function seleccionarContacto(clave){
    console.log(clave)
    var padreBoton = document.querySelector(".padre-boton");
    padreBoton.innerHTML = "<input type='button' class='btn-actualizar' value='Actualizar' onclick='actualizarContacto()'>";

    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
    var solicitud = almacen.get(clave);

    solicitud.addEventListener("success", function(){
        document.querySelector("#nombre").value = solicitud.result.nombre;
        document.querySelector("#id").value = solicitud.result.id;
        document.querySelector("#edad").value = solicitud.result.edad;
    });
}

function buscarContacto(evento){
    evento.preventDefault();
    document.querySelector(".resultado-busqueda").innerHTML = "";
    var buscar = document.querySelector("#buscar-nombre").value.toLowerCase();
    if(buscar==''){
        buscar=ultimaBusqueda;
    }else{
        ultimaBusqueda=buscar;
    }
    const estaEnComillas = /^"/.test(buscar) && /"$/.test(buscar);
    var transaccion = bd.transaction(["Contactos"]);
    var almacen = transaccion.objectStore("Contactos");

    var indice = almacen.index("BuscarNombre");
    if(estaEnComillas){
        buscar=buscar.slice(1, -1);
        var rango=IDBKeyRange.only(buscar);
    }else{
        var rango = IDBKeyRange.bound(buscar, buscar + "\uffff");
    }
    var puntero = indice.openCursor(rango);

    puntero.addEventListener("success", mostrarBusqueda);
}

function mostrarBusqueda(evento){
    var resultadoBusqueda = document.querySelector(".resultado-busqueda");

    var puntero = evento.target.result;
    if (puntero){
        resultadoBusqueda.innerHTML += "<div>" +
                                        puntero.value.nombre + " / " +
                                        puntero.value.id + " / " +
                                        puntero.value.edad +
                                        "<input type='button' class='btn-editar' value='Editar' onclick='seleccionarContacto(\"" + puntero.value.id + "\")'>" +
                                        "<input type='button' class='btn-borrar' value='Borrar' onclick='eliminarContactoBuscado(\"" + puntero.value.id + "\")'>" +
                                        "</div>";
        puntero.continue();
    }
    document.querySelector("#buscar-nombre").value = "";
}

function eliminarContacto(key){
    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
    transaccion.addEventListener("complete", Mostrar);

    var solicitud = almacen.delete(key);
}

function eliminarContactoBuscado(key){
    var transaccion = bd.transaction(["Contactos"], "readwrite");
    var almacen = transaccion.objectStore("Contactos");
    transaccion.addEventListener("complete", buscarContacto);
    transaccion.addEventListener('complete',Mostrar)
    
    var solicitud = almacen.delete(key);
}

async function obtenerContactos() {
    return new Promise((resolve, reject) => {
        const transaccion = bd.transaction("Contactos");
        const almacen = transaccion.objectStore("Contactos");
        const puntero = almacen.openCursor();
    
        const contactos = [];
    
        puntero.addEventListener("success", () => {
            const punteroActual = puntero.result;
            if (punteroActual) {
                contactos.push(punteroActual.value);
                punteroActual.continue();
            } else {
                resolve(contactos);
            }
        });
    });
}

async function obtenerIdMasAlto() {
    const contactos = await obtenerContactos();
    const idMasAlto = contactos.reduce((maxId, contacto) => {
        return Math.max(maxId, contacto.id);
    }, 0);
    return idMasAlto;
}



window.addEventListener("load", IniciarBaseDatos);
