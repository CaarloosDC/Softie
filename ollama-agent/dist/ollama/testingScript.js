"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaClient = void 0;
exports.generateJSONResponse = generateJSONResponse;
const ollama_1 = require("ollama");
const ollamaHost = 'http://191.101.233.154:11434';
const llmModel = 'llama3.1';
exports.ollamaClient = new ollama_1.Ollama({ host: ollamaHost });
// Los roles de sistema definen el comportamiento que debe de seguir el llm al momento de recibir el query
async function generateJSONResponse(responseFormat, query, systemContext) {
    var systemRoleContext = { role: 'system', content: `${systemContext}, genera un JSON con el siguiente formato: ${responseFormat}, solamente regresa el json, no se necesita otra cosa, ni siquiera una explicacion, solamente el json` };
    var userQuery = { role: 'user', content: query };
    const response = await exports.ollamaClient.chat({
        model: llmModel,
        messages: [systemRoleContext, userQuery],
    });
    console.log(response);
    return response;
}
const jsonSample = `
{
    "dog_breed": string,
    "expected_lifetime": number,
}
`;
//generateJSONResponse(jsonSample, 'Dame informacion sobre los pugs', 'Eres un sistema que se encarga de dar informacion general acerca de razas de perros');
generateJSONResponse(jsonSample, 'Dame informacion sobre los pugs', 'Eres un sistema que se encarga de dar informacion general acerca de razas de perros').then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});
