"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOllamaClient = createOllamaClient;
const ollama_1 = require("ollama");
function createOllamaClient(host) {
    return new ollama_1.Ollama({ host: host });
}
