import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import {check, validationResult} from 'express-validator'

const router = express.Router()
const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'games'

const validaGame = [
    check('nome').not().isEmpty().trim().withMessage('É obrigatório informar o nome')
    .isLength({min:5, max:20}).withMessage('O nome pode conter letras e números')
    .custom(async (nome, {req}) => {
        const contaGame = await db.collection(nomeCollection)
        .countDocuments({
                        'nome': nome,
                        '_id': {$ne: new ObjectId(req.body._id)} // Exclui o documento atual
        }) 
        if(contaGame > 0){
            throw new Error('O Nome informado já está cadastrado!')
        }
    }),

    check('plataforma').not().isEmpty().trim().withMessage('Informar a plataforma é obrigatório')
    .isLength({min:5}).withMessage('A plataforma é muito curto. Mínimo de 5')
    .isLength({max:25}).withMessage('A plataforma é muito longa. Máximo de 25')
    .isAlphanumeric('pt-BR', {ignore: '/. '}).withMessage('A plataforma não pode conter caracteres especiais'),

    check('condicao')
    .isLength({min:8, max:8}).withMessage('A condição informada é inválido')
    .not().isEmpty().trim().withMessage('É obrigatório informar a condição'),

    check('preco').notEmpty().withMessage('O preço é obrigatório').isFloat(),

    check('ano_lancamento').matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('O formato da data é inválido. Informe yyyy-mm-dd'),
    
    check('genero').notEmpty().withMessage('O genero é obrigatório'),
    check('quantidade').isNumeric().withMessage('A quantidade deve ser um número'),
    
]

/**
 * GET /api/games
 * Lista todos os games
 * Parâmetros: limit, skip e order
 */
router.get('/', async (req, res) => {
    const { limit, skip, order } = req.query //Obter da URL
    try {
        const docs = []
        await db.collection(nomeCollection)
            .find()
            .limit(parseInt(limit) || 10)
            .skip(parseInt(skip) || 0)
            .sort({ order: 1 })
            .forEach((doc) => {
                docs.push(doc)
            })
        res.status(200).json(docs)
    } catch (error) {
        res.status(500).json(
            {
                message: 'Erro ao obter a listagem dos games',
                error: `${error.message}`
            })
    }
})


/**
 * GET /api/prestadores/id/:id
 * Lista o prestador de serviço pelo id
 * Parâmetros: id
 */

router.get('/id/:id', async (req, res) => {
    try {
        const docs = []
        await db.collection(nomeCollection)
            .find({ '_id': { $eq: new ObjectId(req.params.id) } }, {})
            .forEach((doc) => {
                docs.push(doc)
            })
        res.status(200).json(docs)
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter o prestador pelo ID',
                param: '/id/:id'
            }]
        })
    }
})
/**
 * GET /api/prestadores/id/:id
 * Lista o prestador de serviço pelo id
 * Parâmetros: id
 */
router.get('/nome/:filtro', async (req, res) => {
    try {
        const filtro = req.params.filtro.toString()
        const docs = []
        await db.collection(nomeCollection).find({
            $or: [
                { 'nome': { $regex: filtro, $options: 'i' } },
            ]
        }).forEach((doc) => {
            docs.push(doc)
        })
        res.status(200).json(docs)
    } catch (err) {
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter o jogo pelo nome',
                param: '/nome/:filtro'
            }]
        })
    }
})
/**
 * GET /api/game/id
 * Remove o prestador de serviço pelo id
 * Parâmetros: id
 */
router.delete('/:id', async(req, res)=>{
    const result = await db.collection(nomeCollection).deleteOne({
        "_id": { $eq: new ObjectId(req.params.id)}
    })
    if (result.deletedCount === 0){
        res.status(404).json({
            errors: [{
                value: `Não há nenhum jogo com o id ${req.params.id}`,
                msg: 'Erro ao excluir o jogo',
                param: '/:id'
            }]
        })
    } else {
        res.status(200).send(result)
    }
})

/**
 * POST /api/game
 * Insere um novo prestador de serviço
 * Parâmetros: Objeto prestador
 */
router.post('/', validaGame, async(req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()})
        }
        const game = 
                    await db.collection(nomeCollection).insertOne(req.body)
        res.status(201).json(game) //201 é o status created
    } catch (err){
        res.status(500).json({message: `{err.message} Erro no Server`})
    }
})

/**
 * PUT /api/game
 * Insere um novo prestador de serviço
 * Parâmetros: Objeto prestador
 */

router.put('/', validaGame, async(req, res) => {
    let idDocumento = req.body._id //armazenamos o _id do documento
    delete req.body._id //removemos o _id do body que foi recebido na req.
    try {
       /* if (req.method === 'PUT'){
            //ignora a validação do CNPJ
            req.check('cnpj').skip().if(idDocumento)
        } */
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const game = await db.collection(nomeCollection)
        .updateOne({'_id': {$eq: new ObjectId(idDocumento)}},
                    {$set: req.body})
        res.status(202).json(game) //Accepted
    } catch (err){
        res.status(500).json({errors: err.message})
    }
}) 

export default router