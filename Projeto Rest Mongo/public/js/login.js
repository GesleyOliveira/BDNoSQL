function verificaLogin(){
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    if(email == "adm" && senha == "adm123"){
        window.location = 'cadastro.html'    
    }
    else{
        document.getElementById('aviso').innerHTML = "Email ou Senha incorreto"
    }
}