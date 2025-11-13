const crypto = require('crypto');
const aws = require('aws-sdk');
const { AwsConfig } = require('../config/creds');
const encrypt = require('../utils/cripto');

const tableName = "Usuarios";
aws.config.update(AwsConfig);
const dynamoDb = new aws.DynamoDB.DocumentClient();

async function salvar(bodyRequest) {
    const encryptPass = encrypt.encrypt(bodyRequest.pass);
    bodyRequest.id = crypto.randomBytes(32).toString('hex');
    bodyRequest.ativo = true;
    bodyRequest.cadastro = new Date().toISOString();
    bodyRequest.pass = encryptPass;

    var params = {
        TableName: tableName,
        Item: bodyRequest
    };

    try {
        await dynamoDb.put(params).promise();
        return bodyRequest;

} catch (error) {
        console.error("Erro ao salvar usuário:", error);
        throw error;
    }
}

module.exports = {
    salvar
};