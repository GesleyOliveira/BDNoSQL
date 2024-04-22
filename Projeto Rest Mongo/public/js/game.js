const urlBase = 'http://localhost:4000/api'

async function carregaGames() {
    const cardContainer = document.getElementById('dadosTabela');
    cardContainer.innerHTML = ''; // Limpa antes de recarregar

    try {
        const response = await fetch(`${urlBase}/games`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            data.forEach(game => {
                cardContainer.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${game.nome}</h5>
                                <p class="card-text"><strong>Plataforma:</strong> ${game.plataforma}</p>
                                <p class="card-text"><strong>Condição:</strong> ${game.condicao}</p>
                                <p class="card-text"><strong>Data de Lançamento:</strong> ${new Date(game.anoLancamento).toJSON().substring(0, 10)}</p>
                                <p class="card-text"><strong>Gênero:</strong> ${game.genero}</p>
                                <p class="card-text"><strong>Preço:</strong> R$${game.preco}</p>
                                <p class="card-text"><strong>Quantidade disponível:</strong> ${game.quantidade}</p>
                                <button class="btn btn-success">Comprar</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            window.alert('Erro ao carregar os jogos. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao carregar os jogos:', error.message);
        window.alert('Erro ao carregar os jogos. Por favor, tente novamente.');
    }
}



async function carregaGames2(){
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = ''; // Limpa antes de recarregar
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
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <div class="form-group">
                            <label for="nome${game._id}">Nome:</label>
                            <input id="nome${game._id}" class="form-control" type="text" value="${game.nome}">
                        </div>
                        <div class="form-group">
                            <label for="plataforma${game._id}">Plataforma:</label>
                            <input id="plataforma${game._id}" class="form-control" type="text" value="${game.plataforma}">
                        </div>
                        <div class="form-group">
                            <label for="condicao${game._id}">Condição:</label>
                            <input id="condicao${game._id}" class="form-control" type="text" value="${game.condicao}">
                        </div>
                        <div class="form-group">
                            <label for="anoLancamento${game._id}">Data de Lançamento:</label>
                            <input id="anoLancamento${game._id}" class="form-control" type="text" value="${new Date(game.anoLancamento).toJSON().substring(0, 10)}">
                        </div>
                        <div class="form-group">
                            <label for="genero${game._id}">Gênero:</label>
                            <input id="genero${game._id}" class="form-control" type="text" value="${game.genero}">
                        </div>
                        <div class="form-group">
                            <label for="preco${game._id}">Preço:</label>
                            <input id="preco${game._id}" class="form-control" type="number" value="${game.preco}">
                        </div>
                        <div class="form-group">
                            <label for="quantidade${game._id}">Quantidade disponível:</label>
                            <input id="quantidade${game._id}" class="form-control" type="number" value="${game.quantidade}">
                        </div>
                        <button id='botaoExcluir' class="btn btn-danger" onclick="removeGame('${game._id}')">Excluir</button>
                        <button id='botaoEditar' class="btn btn-primary" onclick="atualizaGame('${game._id}')">Editar</button>
                    </div>
                </div>
            </div>
        `;
        })
        
    })
}



async function atualizaGame(id){
        game = {
        "_id": id,
        "nome": document.getElementById('nome' + id).value,
        "plataforma": document.getElementById('plataforma' + id).value,
        "condicao": document.getElementById('condicao' + id).value,
        "anoLancamento": document.getElementById('anoLancamento' + id).value,
        "genero":  document.getElementById('genero' + id).value,
        "preco" :  document.getElementById('preco' + id).value,
        "quantidade": parseFloat(document.getElementById('quantidade' + id).value),
    }
    if(confirm('Deseja realmente editar este jogo?')){
        await fetch(`${urlBase}/games`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify(game)
        })
        .then(response => response.json())
        .then(data =>{
        if (data.acknowledged){
            alert('Jogo Editado com sucesso!')
            //atualizamos a listagem
            carregaGames2()
        }else if (data.errors){
            const errorMessages = data.errors.map(error => error.msg)
            .join('\n')
           window.alert(`Erros:\n ${errorMessages}`)
        }
    })
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
    let game = {} // Objeto Jogo
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