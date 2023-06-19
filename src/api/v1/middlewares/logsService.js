const fs = require('fs');
const path = require('path');

// Define o caminho para o diretório de logs relativo ao diretório deste arquivo
const logDirectory = path.join(__dirname, '../logs');

// Inicia um buffer vazio para armazenar as informações de requisição/resposta
const logsBuffer = []

// Cria o diretório de logs caso ainda não exista
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Define a função de middleware que será executada em todas as requisições recebidas pela aplicação
const logsMiddleware = (req, res, next) => {
    // Adiciona ao buffer uma string com informações sobre a requisição (método HTTP e URL)
    logsBuffer.push(`[${new Date().toISOString()}] - ${req.method} - ${req.url}`);

    // Adiciona um callback a ser executado quando a resposta for enviada
    res.on('finish', () => {
        // Adiciona ao buffer uma string com informações sobre a resposta (código de status HTTP e mensagem de status)
        logsBuffer.push(`- ${res.statusCode} - ${res.statusMessage}\n`);
    });
    // Chama o próximo middleware na cadeia
    next();
};

// Define um intervalo de 10 minutos para salvar o buffer em arquivos de log
setInterval(() => {
    // Verifica se o buffer está vazio antes de salvar o arquivo
    if (logsBuffer.length > 0) {
        // Cria um fluxo de escrita no arquivo de log com nome baseado na data e hora atuais
        const logStream = fs.createWriteStream(
            path.join(logDirectory, `${new Date().toISOString().replace(/:/g, '-')}.log`),
            { flags: 'a' } // Define que o arquivo será aberto em modo de apêndice (append)
        );

        // Escreve cada item do buffer no arquivo de log
        logsBuffer.forEach(log => {
            logStream.write(log);
        });

        // Finaliza o fluxo de escrita
        logStream.end();

        // Esvazia o buffer
        logsBuffer.length = 0;
    }
}, 10 * 60 * 1000); // Intervalo de 10 minutos

// Exporta a função de middleware para ser utilizada pela aplicação
module.exports = logsMiddleware;
