const socket = io();
let chatBox  = document.getElementById('chatBox');
let sendBtn = document.getElementById('sendBtn');
let log = document.getElementById('messageLogs')
let user; 

const sendMessage = (message, element)=>{
    if(message.length > 0){
        socket.emit('message', {
            user,
            message
        });
        element.value = ''
    }
}

const printMessage = (arr, element)=>{
    console.log(arr )
    let message = ''
    arr.map(e =>{
        message +=`
        <div class="row">
            <div class="card">
                <div clas="card-header">
                    <div class="card-title">${e.user}</div>
                </div>
                <div class="card-body">
                    <p>${e.message}</p>
                </div>
            </div>
        </div>
       
        `
    })
    element.innerHTML = message
}

const firstLoad = ()=>{
    fetch('/message').then((res)=>{return res.json()}).then((data)=>{
        console.log('first data => ',data)
        printMessage(data, log)
    })
}

sendBtn.addEventListener('click',(e)=>{
    sendMessage(chatBox.value.trim(), chatBox)
})

chatBox.addEventListener('keyup', (e) =>{
    if(e.key === 'Enter'){
        sendMessage(chatBox.value.trim(), chatBox)
    }
})


socket.on('messageLogs', (data)=>{
    printMessage(data, log)
})

socket.on('new-user-connected', (data) =>{
    if(data.id != socket.id){
        Swal.fire({
            text: `${data.user} se ha conectado al chat`,
            toast: true,
            position: "top-end"
        })
    }
})

firstLoad()


Swal.fire({
    title:'Iniciar sesion',
    text:'Ingrese su nombre de usuario',
    input:'text',
    confirmButtonText: "Cool",
    allowOutsideClick: false,
    inputValidator: (value) =>{
        if(!value){
            return "Debe ingresar un nombre de usuario"
        }
        
    }
}).then((result)=>{
    if(result.value){
        user = result.value;
        socket.emit('new-user', {user, id : socket.id})
    }
})


