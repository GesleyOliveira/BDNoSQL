function verificaLogin(){
    var usuario = document.getElementById('usuario').value;
    var senha = document.getElementById('senha').value;

    if(usuario == "adm" && senha == "adm123"){
        window.location = 'cadastro.html'    
    }
    else{
        document.getElementById('aviso').innerHTML = "Email ou Senha incorreto"
    }
}