const contenedorLista=document.getElementById('caja-productos');
const btnAgregar=document.getElementById('agregar');

btnAgregar.addEventListener('click',()=>{
    let nombre='';
    let lista=document.getElementById('lista',null);
    if(!lista){
        lista=document.createElement('ul');
        lista.id="lista";
    }else{
        lista=lista;
    }
    
   //obtenemos los valores de los inputs

    do{
        nombre=prompt('indique el nombre del producto: ');

    }while(nombre==='')
    if (nombre !== '') {
        contenedorLista.classList.remove('text-center','text-secondary');
        contenedorLista.classList.add('col-lg-6','col-sm-12')
        contenedorLista.textContent = '';
        contenedorLista.appendChild(lista);

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

function eliminarProducto(e) {
    // Eliminar el elemento "li" que contiene el botón
    let a=e.target.parentNode.parentNode;
    console.log(a.parentNode);
    a.parentNode.removeChild(a);
    
}
