const form = document.querySelector("#register-form");


form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(username.length < 3 ){
        alert("Nome de usuario deve ter no minimo 3 ");
        return;
    }else if(password.length < 6){
        alert("Senha deve ter no minimo 6 caracteres");
        return;
    }else if(!email.includes("@")){
        alert("Email invalido");
        return;
    }

    const dadosUsuario = {
        name: nome,
        email: email,
        password: password,
        credits: 0,
        eteps: 0
    };

    const urlAPI = "https://api-login-dsw-edcygwhhbwgcc2ds.canadacentral-01.azurewebsites.net/usuarios";

    fetch(urlAPI, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(dadosUsuario)

    })
    .then(response =>{
        if(!response.ok){
            throw new Error("Erro na resposta", response.statusText)
        }
        return response.json();
    })
    .then(data=>{
        console.log('Sucesso:', data);
        alert("Usuario Cadastrado")
        form.reset();
    })
    .catch(error=>{
        alert("ERRO")
    })
})