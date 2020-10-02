//variables//

const apiKey = "pxWpXgbcuD8t5LD6guqz2Xouj4UQuBjl";
const apiBaseUrl = "http://api.giphy.com/v1/gifs/search?q=";
let logo = document.getElementById("logo")
let barra = document.getElementsByClassName("barra")
let flecha = document.getElementById("flechita")
let camara = document.getElementById("camara")
let body = document.querySelector(".theme_day")
let themeNight = document.getElementById("tema_item_night")
let themeDay = document.getElementById("tema_item_day")
let video = document.getElementsByTagName("video")[0];
let article = document.getElementsByTagName("article")[0];
let aside = document.getElementsByTagName("aside")[0];
let section = document.getElementById("section");
let botonesMenu = document.getElementById("contenedor_botones");
const botonMisGifs = document.getElementById("mis_gifos");
const botonCrear = document.getElementById("crear");
let captura = document.getElementById("capturar");
let botonComenzar = document.getElementById("boton_comenzar");
let botonElegir = document.getElementsByClassName("boton_elegir");
let botonListo = document.getElementsByClassName("boton_listo");
let reloj = document.getElementById("reloj");
let contenedorCamara = document.getElementsByClassName("camara_contenedor")[0];
let botonRepetir = document.getElementById("boton_repetir");
const botonCancelar = document.getElementById("boton_cancelar");
let contenedorPlayBarra = document.getElementsByClassName("contenedor_play_barra")[0];
let recorder ;
let variableBooleana= false;
let videoGrabado ;
let gifCapturado ;
let form ;
let subirGifo = document.getElementById("subir_guifo");
let respuestaPost ;
let BotonCopiar = document.getElementById("Copiar");
let BotonDescargar = document.getElementById("Descargar") ;
let BotonListoSubido = document.getElementById("boton_listo_subido");
let stream; 

//INICIO DE PAGINA//

window.addEventListener("load", () => {
   
    //PARA MANTENER EL TEMA SELECCIONADO EN LA HOMEPAGE//

    let estiloSeleccionado = sessionStorage.getItem("estilo") 

    if(estiloSeleccionado == "true"){
        logo.setAttribute("src","assets/gifOF_logo_dark.png");
        camara.setAttribute("src","assets/camera_light.svg")
        flechita.setAttribute("src","assets/dropdown-white.svg");
        flechita.setAttribute("width","10px")
        body.classList.remove("theme_day");
        body.classList.add("theme_night");
    }

    //SI CLICKEA EL BOTON "Mis Gifos"//

    let opcionMisGif = sessionStorage.getItem("boton_mis_gifs");
    if(opcionMisGif == "true"){

        paginaMisGifos()
    }
    recorrerStorage ()

   

})

logo.addEventListener("click",()=>{
    location.reload();
})

//PARA QUE APAREZCAN LOS GIFS GUARDADOS EN MIS GIFOS//
function recorrerStorage () {
    for (var i = 0; i < localStorage.length; i++){
        let keys = localStorage.key(i)
        console.log(keys)
        if(keys.startsWith("Gif")){

            let item = localStorage.getItem(keys)
            let gifCreado = document.createElement("img");
            gifCreado.classList.add("contenedor_mis_gifos");
            gifCreado.src = item
            section.appendChild(gifCreado)
        }

    }
} 

function paginaMisGifos() {

    aside.setAttribute("style","display:none");    
    botonesMenu.setAttribute("style","display:flex"); 
}

//SELECCION DE TEMA//

themeNight.addEventListener("click" , ()=> {

    logo.setAttribute("src","assets/gifOF_logo_dark.png");
    flechita.setAttribute("src","assets/dropdown-white.svg");
    flechita.setAttribute("width","10px")
    camara.setAttribute("src","assets/camera_light.svg")
    body.classList.remove("theme_day")
    body.classList.add("theme_night")
    sessionStorage.setItem("estilo","true")
    
})  

themeDay.addEventListener("click" , ()=> {

    logo.setAttribute("src","assets/gifOF_logo.png");
    flecha.setAttribute("src","assets/dropdown.svg");
    body.classList.remove("theme_night")
    body.classList.add("theme_day")
    sessionStorage.setItem("estilo","")
})

//CREACION DEL GIF//

botonCrear.addEventListener("click",()=>{

    aside.setAttribute("style","display:flex");
    botonesMenu.setAttribute("style","display:none");
})

botonCancelar.addEventListener("click", ()=>{

    paginaMisGifos()
})

//COMIENZO DE GRABACION//

botonComenzar.addEventListener("click",()=>{

    getStreamAndRecord();
    article.setAttribute("style","display:block");
    aside.setAttribute("style","display:none");
    section.setAttribute("style","display:none");
    document.getElementById("contenedor_titulo").setAttribute("style","display:none");
    document.getElementById("contenedor_video").setAttribute("style","display:flex");
})


function getStreamAndRecord () { 

    navigator.mediaDevices.getUserMedia({    
        audio: false,    
        video: {    
            height: { max: 434 , exact: 434},
            width: { max : 830 , exact: 830},
        }    
    })    
    .then(function(response) {
        stream = response;
        video.srcObject = stream;   
        video.play()        
        captura.addEventListener("click",capturaVideoCallback)
    })
}

function capturaVideoCallback() {

    variableBooleana = !variableBooleana            
    if(variableBooleana == true){
        console.log(variableBooleana)        
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            height: 240,
            onGifRecordingStarted: function() {console.log(" esta grabando")},

        });
        recorder.startRecording();
        recorder.camera=stream
        camara.setAttribute("src","assets/recording.svg");
        contenedorCamara.classList.replace("camara_contenedor","recording_contenedor");
        botonElegir[1].innerText= "Listo";
        botonElegir[1].classList.replace("boton_elegir","boton_listo");
        reloj.setAttribute("style","display:flex");
        barra[2].innerHTML = '<p>Capturando Tu Guifo</p><img id="boton_x" src="assets/button_close.svg"/>';
        Cronometro()
        

    }else{
        console.log(variableBooleana)
        clearInterval(contador);      
        recorder.stopRecording(callback =>{ 

            recorder.camera.stop()
            console.log("dejo de grabar")
            botonListo[0].setAttribute("style","display:none");
            subirGifo.setAttribute("style","display:inline-block");
            barra[2].innerText = "Vista Previa";
            botonRepetir.setAttribute("style","display:inline-block")
            document.getElementsByClassName("recording_contenedor")[0].setAttribute("style","display:none")
            document.getElementsByClassName("contenedor_play_barra")[0].setAttribute("style","display:flex");
            videoGrabado = recorder.getBlob()
            recorder.destroy()
            recorder = null
            video.setAttribute("style","display:none")   
            gifCapturado = document.createElement("img")
            document.getElementById("contenedor_video").appendChild(gifCapturado)
            gifCapturado.setAttribute("id","gif_capturado")
            gifCapturado.src = URL.createObjectURL(videoGrabado)
    
            return videoGrabado
        })
    }
    
}

//REPETIR EL GIF//

botonRepetir.addEventListener("click",()=>{

    barra[2].innerText = "Un Chequeo Antes de Empezar";
    botonRepetir.setAttribute("style","display:none");
    subirGifo.setAttribute("style","display:none");
    document.getElementsByClassName("recording_contenedor")[0].classList.replace("recording_contenedor","camara_contenedor");
    document.getElementsByClassName("camara_contenedor")[0].setAttribute("style","display:fex");
    gifCapturado.removeAttribute("src")
    gifCapturado.setAttribute("style","display:none");
    botonListo[0].setAttribute("style","display:inline-block");
    botonListo[0].innerText= "Capturar";
    botonListo[0].classList.replace("boton_listo","boton_elegir")
    document.getElementsByClassName("contenedor_play_barra")[0].setAttribute("style","display:none");
    reloj.setAttribute("style","display:none");
    camara.src = "assets/camera.svg";
    video.setAttribute("style","display:block");

   captura.removeEventListener("click",capturaVideoCallback)
    getStreamAndRecord()
    
})

//SUBIDA DEL GIF A GYPHY//

subirGifo.addEventListener("click",()=>{

    form = new FormData();
    form.append('file', videoGrabado, 'myGif.gif');   
    console.log(form.get('file'))   
    botonRepetir.setAttribute("style","display:none");
    contenedorPlayBarra.setAttribute("style","display:none");
    subirGifo.innerText = "Cancelar";
    subirGifo.setAttribute("id","boton_cancelar");
    reloj.setAttribute("style","display:none");
    barra[2].innerHTML = '<p>Subiendo Guifo</p><img id="boton_x" src="assets/button_close.svg"/>';  
    variableBooleana = !variableBooleana
    if(variableBooleana == true){
        postRecord(form)
       console.log("SE CLICKEO EL BOTON SUBIR")

    }else{
        console.log("se clickeo CANCELAR")
        location.reload();
    }


})

function postRecord(form){
    
    console.log("se esta ejecutando la subida a GIPHY")
    document.getElementById("contenedor_video").setAttribute("style","display:none");
    document.getElementById("subiendo_gifo").setAttribute("style","display:flex"); 
    fetch( 'http://upload.giphy.com/v1/gifs?api_key=' + apiKey ,{
        method:"POST",
        body: form
    }).then(response =>{
        if(response.status !== 200){
            console.log("falla")
        }     
      respuestaPost = response.json()      
      .then(response =>{
        let idGif = response.data.id
        console.log(idGif)
        article.setAttribute("style","display:none")     
        document.getElementsByClassName("contenedor_subida_exitosa")[0].setAttribute("style","display:block");  
        let imgSubida = document.createElement("img");
        document.getElementById("imagen_subida").appendChild(imgSubida);
        imgSubida.setAttribute("id","gif_subida-exitosa")
        imgSubida.src= URL.createObjectURL(videoGrabado)
       idUpload(idGif) 

      })      
    })
}


//OPCION DE DESCARGA DE GIF O COPIA DE ENLACE//

function idUpload(id){
    section.setAttribute("style","display:grid");
    document.getElementById("contenedor_titulo").setAttribute("style","display:block");
    fetch(`http://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`)
    .then(resp =>{
        return resp.json()
    })
    .then(response => {
        console.log(response)
        let gifUrl = response.data.images.fixed_height.url;
        let gifCreado = document.createElement("img");
        gifCreado.classList.add("contenedor_mis_gifos");
        gifCreado.src = gifUrl
        section.appendChild(gifCreado)
        localStorage.setItem(`Gif${response.data.id}`,`${gifUrl}`)

        BotonCopiar.addEventListener("click",()=>{
            navigator.clipboard.writeText(response.data.images.fixed_height.url)
            alert("se copio el link en el clipboard")
        })

        BotonDescargar.addEventListener("click",() => {
            let a = document.createElement('a');
            let file = videoGrabado;
            a.download = 'myGif.gif';
            a.href = window.URL.createObjectURL(file);
            a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
            a.click();
        })

        BotonListoSubido.addEventListener("click",()=>{
            location.reload();
        })
    })    
}

//CRONOMETRO DE REPRODUCCION//
       

function Cronometro() {
    m = 0;
    s = 0;
    ms = 0;
    contador = setInterval(() => {
         ms++;
         if (ms>59){s++;ms = 0;}
         if (s>59){m++;s = 0;}
         if (m>59){h++;m = 0;}

        if (ms<10){miliSegundos = "0"+ms;}else{miliSegundos = ms;}
        if (s<10){segundos = "0"+s;}else{segundos = s;}
        if (m<10){minutos = "0"+m;}else{minutos = m;}
    reloj.innerHTML = "00:" + minutos + ":" + segundos+ ":" + miliSegundos;
    }, 10);
}


