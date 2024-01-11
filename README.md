# WhatsApp GPT Chatbot

## Descrição
Este projeto é um bot para WhatsApp que utiliza a biblioteca Venom-bot e a API da OpenAI para integração com modelos de linguagem como GPT-4, DALL-E e text-davinci-003.

## Instalação
1. Clone este repositório:
    ```bash
    git clone https://github.com/gmahota/whatsapp-gpt.git
    cd whatsapp-gpt
    ```
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:
    ```env
    ORGANIZATION_ID=SuaOrganizacaoID
    OPENAI_KEY=SuaChaveOpenAI
    API_URL=URLDaSuaAPI
    STORE_NUMBER=SeuNumeroDeLoja
    StableDifFusion_API_URL=SuaChaveAPIStableDiffusion
    ```

## Uso
1. Inicie o bot:
    ```bash
    npm start
    ```
2. Escaneie o código QR com o seu WhatsApp para autenticar o bot.
3. Interaja com o bot enviando mensagens no WhatsApp.

## Comandos
- `/bot`: Interaja com o modelo GPT-4.
- `/gpt`: Interaja com o modelo text-davinci-003.
- `/img`: Gere uma imagem usando o modelo DALL-E.
- `/mpesa`: Realize uma transação M-Pesa.
- `/sticker`: Gere um adesivo a partir de uma imagem.
- `/image`: Gere uma variação de imagem.

## Observação
Este projeto utiliza a biblioteca [Venom-bot](https://github.com/orkestral/venom), que não é uma biblioteca oficial do WhatsApp. O Venom-bot utiliza um navegador para interagir com o WhatsApp Web.

## Agradecimentos
Agradecemos à equipe do Venom-bot pelo desenvolvimento e manutenção desta biblioteca, que possibilita a interação com o WhatsApp de forma programática.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) e enviar pull requests.

## Licença
Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
