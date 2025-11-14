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

async function alterar(usuario) {
    var params = {
        TableName: tableName,
        Key: {"id": usuario.id, "email": usuario.email},
        UpdateExpression: "set nome = :nome",
        ExpressionAttributeValues: {
            ":nome": usuario.nome
        },
        ReturnValues: "ALL_NEW"
    };
    try {
        const dados = await dynamoDb.update(params).promise();
        return dados;
        
    } catch (error) {
        console.error("Erro ao alterar usuário:", error);
        console.error("Parâmetros enviados:", JSON.stringify(params, null, 2));
        return false;
    }
}

async function buscaPorEmailSenha(email, senha) {
    try {
        var params = {
            TableName: tableName,
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

            const dados = await dynamoDb.scan(params).promise();

        if (dados && dados.Items) {
            const usuario = dados.Items[0];
            const decrypt = encrypt.getPassDecrypt(usuario.pass);
            return (senha === decrypt) ? usuario : null;
        }
            return null;

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    };
}


module.exports = {
    salvar,
    remover,
    alterar,
    buscaPorEmailSenha
};