// Versão Simplificada e Direta
const PROXY_CONFIG = [
  {
    context: [
      "/api"
    ],
    // Endereço do backend colocado diretamente
    target: "https://localhost:7243", 
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;