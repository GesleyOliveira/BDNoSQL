const urlBase = 'http://localhost:4000/api'
const resultadoModal = new booststrap.Modal(document.getElementById('modalMensagem'))

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
                <td>${prestador.fantasia}</td>
                <td>${prestador.cnae_fiscal}</td>
                <td>${prestador.data_inicio_atividade}</td>
                <td>${prestador.localizacao.coordinates[0]} / ${prestador.coordinates[1]}</td>
                <td>${prestador.cnae_fiscal}</td>
            <tr>`
       })
    })
}