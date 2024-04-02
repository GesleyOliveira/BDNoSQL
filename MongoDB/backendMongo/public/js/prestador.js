const urlBase = 'http://localhost:4000/api'
const resultadoModal = new bootstrap.Modal(document.getElementById('modalMensagem'))

async function carregaPrestadores(){
    const tabela = document.getElementById('dadosTabela')           
    tabela.innerHTML = '' //limpa antes de recarregar 
    //Faremos a requisição GET para a nossa API REST
    await fetch(`${urlBase}/prestadores`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
       // console.table(data)
       data.forEach(prestador => {
            tabela.innerHTML += `
            <tr>
                <td>${prestador.razao_social}</td>
                <td>${prestador.nome_fantasia}</td>
                <td>${prestador.cnae_fiscal}</td>
                <td>${new Date (prestador.data_inicio_atividade).
                        toLocaleDateString()}</td>
                <td>${prestador.localizacao.coordinates[0]} / ${prestador.localizacao.coordinates[1]}</td>
                <td>
                <button class='btn btn-danger btn-sm' onclick='removePrestador("${prestador._id}")'>🗑 Excluir</button>
                </td>
            <tr>
            `
       })
    })
}

async function removePrestador(id){
    if(confirm('Deseja realmente excluir este prestador?')){
        await fetch(`${urlBase}/prestadores/${id}`, {
            method: 'DELETE',
            headers: {
                'Contend-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.deletedCount > 0){
                carregaPrestadores() // atualizamos o UI
            }
        })
        .catch(error => {
            document.getElementById('mensagem').innerHTML = `Erro ao remover o prestador: ${error.message}`
            resultadoModal.show() // exibe o modal com o erro
        })
            
    }

}

document.getElementById('formPrestador').addEventListener('submit',function (event){
    event.preventDefault() // evita o recarregamento
    let prestador = {} // Objeto prestador
    prestador = {
        "cnpj": document.getElementById('cnpj1').value,
        "razao_social": document.getElementById('razao-social2').value,
        "nome_fantasia": document.getElementById('nome-fantasia').value,
        "cnae_fiscal": document.getElementById('cnae13').value,
        "data_inicio_atividade": document.getElementById('data-de-inicio-de-atividade15').value,
        "localizacao": {
            "type": "Point",
            "coordinates": [document.getElementById('latitude10').value,
                            document.getElementById('longitude11').value]
        },
        "cep": document.getElementById('cep3').value,
        "endereco": {
            "logradouro": document.getElementById('logradouro5').value,
            "complemento": document.getElementById('complemento8').value,
            "bairro": document.getElementById('bairro6').value,
            "localidade": document.getElementById('localidade7').value,
            "uf": document.getElementById('unidade-da-federacao9').value
        }
       
    }/* Fim do objeto */
    //alert(JSON.stringify(prestador)) 
    salvaPrestador(prestador)
})


async function salvaPrestador(prestador){
    await fetch(`${urlBase}/prestadores`, {
        method: 'POST',
        headers: {
            'Contend-Type': 'application/json'
        },
        body: JSON.stringify(prestador)
    })
    .then(response => response.json())
    .then(data => {
        if (data.acknowledged){
            alert('Prestador incluído com sucesso!')
            //limpamos o formulario
            document.getElementById('formPrestador').reset()
            //atualizamos a listagem
            carregaPrestadores()
        } else if (data.errors){
            const errorMessages = data.errors.map(error => error.msg).join('\n')
            document.getElementById('mensagem').innerHTML = `<span class='text-danger'>${errorMessages}</span>`
            resultadoModal.show() //Mostra o modal
        }
        
    })
}