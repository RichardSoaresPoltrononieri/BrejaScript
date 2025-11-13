const express = require('express');
const router = express.Router();
const { salvar, remover } = require('../database/userDb');


router.post('/', async (req, res) => {
    if (req.body && req.body.nome && req.body.email && req.body.pass) {
        const cadastro = await salvar(req.body);
        return res.send(cadastro);
    }

    return res.status(500).json({mensagem: "Usuário não cadastrado. Verifique os dados e tente novamente."});
});

router.delete('/', async (req, res) => {
    if (validateRequestBody(req)) {
        const sucess = await remover(req.body.id, req.body.email);
        return res.send({sucess: sucess});
    }

    return res.status(404).json({mensagem: "Usuário não encontrado."});
});

function validateRequestBody(request) {
    return request.body && request.body.id && request.body.email;
}

module.exports = router;