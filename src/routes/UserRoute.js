const express = require('express');
const router = express.Router();
const { salvar } = require('../database/userDb');


router.post('/', async (req, res) => {
    if (req.body && req.body.nome && req.body.email && req.body.pass) {
        const cadastro = await salvar(req.body);
        return res.send(cadastro);
    }

    return res.status(500).json({mensagem: "Usuário não cadastrado. Verifique os dados e tente novamente."});
});

module.exports = router;