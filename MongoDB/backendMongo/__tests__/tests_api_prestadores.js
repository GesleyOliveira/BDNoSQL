/*
* Teste na API de Prestadores
* Tecnologias utilizadas:
* Supertest: Biblioteca para testes na API Rest do NodeJS
* dotenv: Biblioteca para gerenciar variáveis de ambiente
*/

const request = require('supertest')
const dotenv = require('dotenv')
dotenv.config() // carrega as variáveis do .env

const baseURL = 'http://localhost:4000/api'

describe('API REST de Prestadores sem o Token', () => {
    it('GET / - Lista todos os prestadores sem o token', async() => {
        const response = await request(baseURL).get('/prestadores')
        .set('Content-Type', 'application/json')
        .expect(401) //Unauthorized 
    })

    it('GET / Obtém o Prestador pelo ID sem o token', async() => {
        const id = '663023eb1a036d4f7678985d'
        const response = await request(baseURL)
        .get(`/prestadores/id/${id}`)
        .set('Content-Type','application/json')
        .expect(401) //Unauthorized
    })

    it('GET / Obtém o Prestador pela razão sem o token', async() => {
        const razao = 'TRANSP'
        const response = await request(baseURL)
        .get(`/prestadores/id/${razao}`)
        .set('Content-Type','application/json')
        .expect(401) //Unauthorized
    })
})

describe('API REST de Prestadores com o token', () => {
    let token // Armazenaremos o access_token JWT
    it('POST - Autenticar usuário para retornar token JWT', async() => {
        const senha = process.env.SENHA_USUARIO
        const response = await request(baseURL)
        .post('/usuarios/login')
        .set('Content-Type','application/json')
        .send({"email" : "gesley@gmail.com","senha": senha})
        .expect(200) //OK

        token = response.body.access_token
        expect(token).toBeDefined() // Recebemos o token?
    })

    it('GET - Listar os prestadores com autenticação', async() => {
        const response = await request(baseURL)
        .get('/prestadores')
        .set('Content-Type','application/json')
        .set('access-token', token) //Inclui o token na chamada
        .expect(200)

        const prestadores = response.body
        expect(prestadores).toBeInstanceOf(Array)
    })

    dadosPrestador = {
        "cnpj" : "45190324002241",
        "razao_social" : "JOSÉ BERNARDO TRANSPORTES LTDA",
        "cep" : "13310160",
        "endereco" : {
            "logradouro": "Av. Presidente Kennedy, 321",
            "complemento" : "",
            "bairro" : "Centro",
            "localidade" : "Votorantim",
            "uf" : "sp"
        },
        "cnae_fiscal": 451510,
        "nome_fantasia" : "ALCINA",
        "data_inicio_atividade": "2022-07-22",
        "localizacao": {
            "type" : "Point",
            "coordinates": [-23.2904, -47.2963]
        }
    }

    it('POST - Inclui um novo prestador com autenticação', async() => {
        const response = await request(baseURL)
        .post('/prestadores')
        .set('Content-Type','application/json')
        .set('access-token', token) //Inclui o token na chamada
        .send(dadosPrestador)
        .expect(201) //Created

        expect(response.body).toHaveProperty('acknowledged')
        expect(response.body.acknowledged).toBe(true)

        expect(response.body).toHaveProperty('insertedId')
        expect(typeof response.body.insertedId).toBe('string')
        idPrestadorInserido = response.body.insertedId
        expect(response.body.insertedId.length).toBeGreaterThan(0)

    })

    it('GET /:id - Lista o prestador pelo id com token', async()=> {
        const response = await request(baseURL)
        .get(`/prestadores/id/${idPrestadorInserido}`)
        .set('Content-Type','application/json')
        .set('access-token', token) //Inclui o token na chamada
        .expect(200)
    })

    it('GET /:razao - Lista o prestador pelo razao com token', async()=> {
        const response = await request(baseURL)
        .get(`/prestadores/razao/${dadosPrestador.razao_social}`)
        .set('Content-Type','application/json')
        .set('access-token', token) //Inclui o token na chamada
        .expect(200)
    })

    it('PUT - Altera os dados do prestador', async() => {
        novoDadosPrestador = {
            ...dadosPrestador, //spread operator
            '_id' : idPrestadorInserido
        }
        novoDadosPrestador.razao_social += ` alterado`
        const response = await request(baseURL)
        .put('/prestadores')
        .set('Content-Type','application/json')
        .set('access-token', token)
        .send(novoDadosPrestador)
        .expect(202) //Accepted

        expect(response.body).toHaveProperty('acknowledged')
        expect(response.body.acknowledged).toBe(true)

        expect(response.body).toHaveProperty('modifiedCount')
        expect(typeof response.body.modifiedCount).toBe('number')
        expect(response.body.modifiedCount).toBeGreaterThan(0)
    })

    it('DELETE - Remove o prestador', async() => {
        const response = await request(baseURL)
        .delete(`/prestadores/${idPrestadorInserido}`)
        .set('Content-Type','application/json')
        .set('access-token', token)
        .expect(200)

        expect(response.body).toHaveProperty('acknowledged')
        expect(response.body.acknowledged).toBe(true)

        expect(response.body).toHaveProperty('deletedCount')
        expect(typeof response.body.deletedCount).toBe('number')
        expect(response.body.deletedCount).toBeGreaterThan(0)
    })

    it('POST - Insere um prestador sem o CNPJ', async() => {
        dadosPrestador.cnpj = ''
        const response = await request(baseURL)
        .post('/prestadores')
        .set('Content-Type','application/json')
        .set('access-token', token)
        .set(dadosPrestador)
        .expect(400) //Bad Request

        expect(response.body).toHaveProperty('errors')
        const avisoErro = response.body.errors[0].msg

        expect(avisoErro).toEqual('É obrigatório informar o cnpj')

    })
})

//describe('Erros na API REST de Prestadores com o token', ()=> {})