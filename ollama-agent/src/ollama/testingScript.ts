

import ollama, { Ollama } from 'ollama';

const ollamaHost = 'http://191.101.233.154:11434';
const llmModel = 'llama3.1';

export const ollamaClient = new Ollama({ host: ollamaHost });

// Los roles de sistema definen el comportamiento que debe de seguir el llm al momento de recibir el query
export async function generateJSONResponse(responseFormat: string, query: string, systemContext: string) {
    var systemRoleContext = {role: 'system', content: `${systemContext}, genera un JSON con el siguiente formato: ${responseFormat}, solamente regresa el json, no se necesita otra cosa, ni siquiera una explicacion, solamente el json`};

    var userQuery = {role: 'user', content: query};

    const response = await ollamaClient.chat({
        model: llmModel,
        messages: [systemRoleContext, userQuery],
    })

    console.log(response)
    return response;
}

const jsonSample = `
{
    "dog_breed": string,
    "expected_lifetime": number,
}
`

//generateJSONResponse(jsonSample, 'Dame informacion sobre los pugs', 'Eres un sistema que se encarga de dar informacion general acerca de razas de perros');
generateJSONResponse(jsonSample, 'Dame informacion sobre los pugs', 'Eres un sistema que se encarga de dar informacion general acerca de razas de perros').then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});

