let nombre='';
let lista=document.getElementById('lista');

const btnAgregar=document.getElementById('agregar');
btnAgregar.addEventListener('click',()=>{
    do{
        nombre=prompt('indique el nombre del producto: ');

    }while(nombre==='')
    if (nombre !== '') {
        let nuevoProducto = document.createElement("li");
        nuevoProducto.classList.add("producto");

        let producto=document.createElement('p');
        producto.textContent=`${nombre} `;

        let btnEliminar=document.createElement('button');
        btnEliminar.addEventListener('click', eliminarProducto);
        btnEliminar.innerHTML="Eliminar";

        producto.appendChild(btnEliminar);
        nuevoProducto.appendChild(producto);

        lista.appendChild(nuevoProducto);
    }else{
        console.log(nombre)
    }
});

function contarProductos(){
    let productos=document.querySelectorAll('.producto');
    return productos;
};

function eliminarProducto(e) {
    // Eliminar el elemento "li" que contiene el botón
    let a=e.target.parentNode.parentNode;
    console.log(a.parentNode);
    a.parentNode.removeChild(a);
    
}
