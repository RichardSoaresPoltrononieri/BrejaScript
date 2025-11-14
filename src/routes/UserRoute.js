const express = require('express');
const router = express.Router();
const { salvar, remover, alterar } = require('../database/userDb');


router.post('/', async (req, res) => {
    if (req.body && req.body.nome && req.body.email && req.body.pass) {
        const cadastro = await salvar(req.body);
        if (cadastro && cadastro.id) {
            return res.status(201).json(cadastro);
        }
        return res.status(400).json({mensagem: "Erro ao cadastrar usuário."});
    }

    return res.status(400).json({mensagem: "Usuário não cadastrado. Verifique os dados e tente novamente."});
});

router.delete('/', async (req, res) => {
    if (validateRequestBody(req)) {
        const sucesso = await remover(req.body.id, req.body.email);
        if (sucesso) {
            return res.json({mensagem: "Usuario removido com sucesso."});
        }
        return res.status(404).json({mensagem: "Usuário não encontrado."});
    }

    return res.status(400).json({mensagem: "Dados inválidos."});
});


router.put('/', async (req, res) => {
    if (validateRequestBody(req)) {
        const dados = await alterar(req.body);
        if (dados) {
            return res.json(dados);
        }
        return res.status(404).json({mensagem: "Usuário não encontrado."});
    }
    return res.status(400).json({mensagem: "Dados inválidos."});
});

function validateRequestBody(request) {
    return request.body && request.body.id && request.body.email;
}

module.exports = router;