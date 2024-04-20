const urlBase = 'http://localhost:4000/api'

async function carregaGames(){
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' // Liga antes de recarregar
    //Faremos a requisição GET para a nossa API REST
    await fetch(`${urlBase}/games`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(game => {
            tabela.innerHTML += `
            <tr>
                <td>Nome:${game.nome}</td>
                <td>Plataforma:${game.plataforma}</td>
                <td>Condição:${game.condicao}</td>
                <td>Ano de Lançamento:${new Date(game.anoLancamento).toLocaleDateString()}</td>
                <td>Genero: ${game.genero}</td>
                <td>Preço: ${game.preco}</td>
                <td>
                <button id='botaoComprar'>Comprar</button>
                </td>
            </tr>
            `  
        })
    })
}

async function carregaGames2(){
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' // Liga antes de recarregar
    //Faremos a requisição GET para a nossa API REST
    await fetch(`${urlBase}/games`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(game => {
            tabela.innerHTML += `
            <tr>
                <td>Nome:<input type="text" value="${game.nome}"></td>
                <td>Plataforma:<input type="text" value="${game.plataforma}"></td>
                <td>Condição:<input type="text" value="${game.condicao}"></td>
                <td>Ano de Lançamento:<input value="${new Date(game.anoLancamento).toLocaleDateString()}"></td>
                <td>Genero:<input value="${game.genero}"></td>
                <td>Preço:<input value="${game.preco}"></td>
                <td>
                <button id='botaoExcluir' onclick='removeGame("${game._id}")'>Exlcuir</button>
                <button id='botaoEditar' onclick='atualizaGame("${game}")'>Editar</button>
                </td>
            </tr>
            `  
        })
    })
}

async function atualizaGame(game){
    let game1 = {
        "_id": game._id,
        "nome": game.nome,
        "plataforma":game.plataforma,
        "condicao": game.condicao,
        "anoLancamento": game.anoLancamento,
        "genero": game.genero,
        "preco" : game.preco,
        "quantidade": parseFloat(game.quantidade),
    }
    if(confirm('Deseja realmente editar este jogo?')){
        await fetch(`${urlBase}/${game1}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify(game1)
        })
        .then(response => response.json())
    }
}

async function removeGame(id) {
    if (confirm('Deseja realmente excluir este jogo?')) {
        await fetch(` ${urlBase}/games/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    carregaGames2() // atualizamos a UI
                }
            })
            .catch(error => {
                window.alert(`Erro ao remover o jogo: ${error.message}`)
            })
    }
}

document.getElementById('formGame').addEventListener('submit',function (event){
    event.preventDefault() // evita o recarregamento
    let game = {} // Objeto prestador
    game = {
        "nome": document.getElementById('nome').value,
        "plataforma": document.getElementById('plataforma').value,
        "condicao": document.getElementById('condicao').value,
        "anoLancamento": document.getElementById('anoLancamento').value,
        "genero": document.getElementById('genero').value,
        "preco" : document.getElementById('preco').value,
        "quantidade": parseFloat(document.getElementById('qtd').value),
    }/* Fim do objeto */
   // alert(JSON.stringify(prestador)) apenas para testes
   salvarGame(game)
})

async function salvarGame(game){
    await fetch(`${urlBase}/games`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    })
    .then(response => response.json())
    .then(data =>{
        if (data.acknowledged){
            alert('Jogo incluído com sucesso!')
            //limpamos o formulário
            document.getElementById('formGame').reset()
            //atualizamos a listagem
            carregaGames()
        }else if (data.errors){
            const errorMessages = data.errors.map(error => error.msg)
            .join('\n')
           window.alert(`Erros:\n ${errorMessages}`)
        }
    })
}