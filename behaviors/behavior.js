
//VARIABLES//

 const apiKey = "pxWpXgbcuD8t5LD6guqz2Xouj4UQuBjl";
 const apiBaseUrl= "http://api.giphy.com/v1/gifs/search?q=";
 let logo = document.getElementById("logo")
 let flechita = document.getElementById("flechita")
 let lupa =document.getElementById("lupa")
 let body = document.querySelector(".theme_day")
 let themeNight = document.getElementById("tema_item_night")
 let themeDay= document.getElementById("tema_item_day")
 let botonBuscador=document.getElementById("boton_buscador")
 let inputBuscador = document.getElementById("buscar")
 let despliegueBusqueda= document.getElementsByClassName("despliegue_busqueda")
 let tituloTendencia = document.getElementById("Tendencias")
 const aside = document.getElementsByTagName("aside")
 const gifSugeridos = document.getElementById("gifs_sugeridos")
 const botonMisGifs = document.getElementById("mis_gifos")
 const botonCrear = document.getElementById("crear")
 const buscadorBoton= document.getElementById("boton_buscador");
 const busquedaResultado = document.getElementById("gifs");

 

 //Carga de pagina//

window.addEventListener("load", () => {

    let estiloSeleccionado= sessionStorage.getItem("estilo")
    console.log(estiloSeleccionado)
    if(estiloSeleccionado == "true"){
        logo.setAttribute("src","assets/gifOF_logo_dark.png");
        lupa.setAttribute("src","assets/Combined_Shape.svg");
        flechita.setAttribute("src","assets/dropdown-white.svg");
        flechita.setAttribute("width","10px")
        body.classList.remove("theme_day")
        body.classList.add("theme_night")
        InputNight()
    }
    InputDay()
    hardcore(topicosSugeridos);
    hardcoreTendencia();

})

logo.addEventListener("click",()=>{

    location.reload();
})

//clickeo de botones//


botonMisGifs.addEventListener("click",()=>{

    sessionStorage.setItem("boton_mis_gifs","true")
})

botonCrear.addEventListener("click",()=>{

    sessionStorage.setItem("boton_mis_gifs","")
})


//temas:cambio(Sailor Day y Sailor Night)//

themeNight.addEventListener("click" , ()=> {

    logo.setAttribute("src","assets/gifOF_logo_dark.png");
    flechita.setAttribute("src","assets/dropdown-white.svg");
    flechita.setAttribute("width","10px")
    lupa.setAttribute("src","assets/Combined_Shape.svg");
    body.classList.remove("theme_day")
    body.classList.add("theme_night")
    InputNight()    
    sessionStorage.setItem("estilo","true")
}) 

themeDay.addEventListener("click" , ()=> {

    logo.setAttribute("src","assets/gifOF_logo.png");
    flechita.setAttribute("src","assets/dropdown.svg");
    lupa.setAttribute("src","assets/lupa_inactive.svg");
    body.classList.remove("theme_night")
    body.classList.add("theme_day")
    InputDay() 
    sessionStorage.setItem("estilo","")
}) 

//DESPLIEGUE DEL BUSCADOR//

function InputNight() {

    inputBuscador.addEventListener("input",despliegue)
    function despliegue() {

        if(inputBuscador.value == ""){
            despliegueBusqueda[0].setAttribute("style","display:none");
            lupa.setAttribute("src","assets/Combined_Shape.svg");
            botonBuscador.setAttribute("id","boton_buscador");
        }else{
            despliegueBusqueda[0].setAttribute("style","display:block");
            botonBuscador.setAttribute("id","boton_buscador_input");
            lupa.setAttribute("src","assets/lupa_light.svg");
        }

    }
    inputBuscador.removeEventListener("click",despliegue)
}

function InputDay() {

    inputBuscador.addEventListener("input",despliegue)
    function despliegue() {
        if(inputBuscador.value == ""){
            despliegueBusqueda[0].setAttribute("style","display:none");
            botonBuscador.setAttribute("id","boton_buscador");
            lupa.setAttribute("src","assets/lupa_inactive.svg");
        }else{
            despliegueBusqueda[0].setAttribute("style","display:block");
            botonBuscador.setAttribute("id","boton_buscador_input");
            lupa.setAttribute("src","assets/lupa.svg");
        }  

    }
    inputBuscador.removeEventListener("click",despliegue)
}

//Fetch de busqueda en Giphy//

function getSearchResults(search) {
    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data=> {
            return data;
        })
        .catch(error => {
            return error;
        });
    return found;
}

   
function getAleatorieResults() {
    const found = fetch('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey)
    .then(response => {
        return response.json();
    })
    .then(data=> {
        return data;
    })
    .catch(error => {
        return error;
    });
    return found;
}



//Buscador y resultado de busqueda//


function hardcoreTendencia(){

    const gifAleatorio =document.getElementById("gifsFijos")
    getAleatorieResults().then((resultado) => {
        let primero= resultado.data;        
        primero.forEach(element => {       
            let contenedorGif = document.createElement("img");
            contenedorGif.classList.add("contenedor_gif_buscados")
            contenedorGif.src = element.images.fixed_height.url;
            gifAleatorio.appendChild(contenedorGif)
        })
    })

}

buscadorBoton.addEventListener("click",() =>{

    const palabraBuscador= inputBuscador.value;
    busquedaGif(palabraBuscador)
})

function busquedaGif(palabraBuscador) {

    const gifAleatorio =document.getElementById("gifsFijos")
    let cuadroResultado = document.getElementById("cuadros_busqueda");
    aside[0].setAttribute("style","display: none");
    gifAleatorio.setAttribute("style","display: none");
    console.log(palabraBuscador);
    tituloTendencia.innerHTML= `${palabraBuscador} (resultados)`;
    despliegueBusqueda[0].setAttribute("style","display: none");
    cuadroResultado.setAttribute("style","display: flex"); 

    getSearchResults(palabraBuscador).then((response)=>{
        busqueda(response);

    }).catch((error)=>{    
        console.log("hubo un error")
    })    
}


function busqueda(resp) {

    busquedaResultado.innerHTML="";
    busquedaResultado.setAttribute("style","display: grid")    
    console.log(resp)
    if(resp.data.length >0){
        resp.data.forEach(element => {
            let gifBuscado = document.createElement("img")
            gifBuscado.classList.add("contenedor_gif_buscados")
            gifBuscado.src = element.images.fixed_height.url;        
            busquedaResultado.appendChild(gifBuscado)          
            gifBuscado.addEventListener("click",() =>{
                localStorage.setItem(`Gif${element.id}`,`${element.images.fixed_height.url}`);               
                gifBuscado.removeEventListener("click",()=>{localStorage.setItem(`Gif${element.id}`,`${element.images.fixed_height.url}`);})
            })              
        })  
    } 
}


despliegueBusqueda[0].addEventListener("mousedown",(evento)=>{  

    console.log(evento.target.dataset.search)
    busquedaGif(evento.target.dataset.search)
})


//Gifs sugeridos//

const topicosSugeridos =["JonathanVanNess","SailorMercury","DragonBall","Unicorns&Rainbows"];

  function hardcore(topicosSugeridos) {    

    topicosSugeridos.forEach(  element => {

        getSearchResults(element).then((resultado) => {
            
            let primero= resultado.data[0];
            let contenedor = document.createElement("div");
            contenedor.classList.add("marco_gifs")
            contenedor.innerHTML = `
                <div class = "bar_gif_sugerido" > #${element}
                    <img id="boton_x" src="assets/button_close.svg"/>
                </div>
                <div class= "contenedor_gif_sugerencia">
                     <img class="gif_hardcode" src = ${primero.images.fixed_height.url}/>
                    <div class="ver_mas" data-search=${element}>Ver más…</div>
                </div> `
            gifSugeridos.appendChild(contenedor)   
            contenedor.addEventListener("mousedown", (evento)=>{
                console.log(evento.target.dataset.search)
                busquedaGif(evento.target.dataset.search)
            })
        })           
    })   
}









