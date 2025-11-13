const crypto = require('crypto');
const aws = require('aws-sdk');
const { AwsConfig } = require('../config/creds');
const encrypt = require('../utils/cripto');

const tableName = "Usuarios";
aws.config.update(AwsConfig);
const dynamoDb = new aws.DynamoDB.DocumentClient();

async function salvar(bodyRequest) {
    const encryptPass = encrypt.encrypt(bodyRequest.pass);
    bodyRequest.id = crypto.randomBytes(8).toString('hex');
    bodyRequest.active = true;
    bodyRequest.DataCadastro = new Date().toISOString();
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

async function remover(id, email) {
    var params = {
        TableName: tableName,
        Key: { 
            id: id,
            email: email
        }  
    }

    try {
        await dynamoDb.delete(params).promise();
        return true;
        
    } catch (error) {
        console.error("Erro ao remover usuário:", error);
        return false;
    }
}

module.exports = {
    salvar,
    remover
};