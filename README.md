<body>

    <h1>WhatsApp GPT Chatbot</h1>

    <h2>Descrição</h2>
    <p>Este projeto é um bot para WhatsApp que utiliza a biblioteca Venom-bot e a API da OpenAI para integração com modelos de linguagem como GPT-4, DALL-E e text-davinci-003.</p>

    <h2>Instalação</h2>
    <ol>
        <li>Clone este repositório:
            <pre><code>git clone https://github.com/gmahota/whatsapp-gpt.git
cd whatsapp-gpt</code></pre>
        </li>
        <li>Instale as dependências:
            <pre><code>npm install</code></pre>
        </li>
        <li>Crie um arquivo <code>.env</code> na raiz do projeto e adicione as seguintes variáveis de ambiente:
            <pre><code>ORGANIZATION_ID=SuaOrganizacaoID
OPENAI_KEY=SuaChaveOpenAI
API_URL=URLDaSuaAPI
STORE_NUMBER=SeuNumeroDeLoja
StableDifFusion_API_URL=SuaChaveAPIStableDiffusion</code></pre>
        </li>
    </ol>

    <h2>Uso</h2>
    <ol>
        <li>Inicie o bot:
            <pre><code>npm start</code></pre>
        </li>
        <li>Escaneie o código QR com o seu WhatsApp para autenticar o bot.</li>
        <li>Interaja com o bot enviando mensagens no WhatsApp.</li>
    </ol>

    <h2>Comandos</h2>
    <ul>
        <li><code>/bot</code>: Interaja com o modelo GPT-4.</li>
        <li><code>/gpt</code>: Interaja com o modelo text-davinci-003.</li>
        <li><code>/img</code>: Gere uma imagem usando o modelo DALL-E.</li>
        <li><code>/mpesa</code>: Realize uma transação M-Pesa.</li>
        <li><code>/sticker</code>: Gere um adesivo a partir de uma imagem.</li>
        <li><code>/image</code>: Gere uma variação de imagem.</li>
    </ul>

    <h2>Observação</h2>
    <p>Este projeto utiliza a biblioteca <a href="https://github.com/orkestral/venom" target="_blank">Venom-bot</a>, que não é uma biblioteca oficial do WhatsApp. O Venom-bot utiliza um navegador para interagir com o WhatsApp Web.</p>

    <h2>Agradecimentos</h2>
    <p>Agradecemos à equipe do Venom-bot pelo desenvolvimento e manutenção desta biblioteca, que possibilita a interação com o WhatsApp de forma programática.</p>

    <h2>Contribuição</h2>
    <p>Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) e enviar pull requests.</p>

    <h2>Licença</h2>
    <p>Este projeto é licenciado sob a Licença MIT - veja o arquivo <a href="LICENSE">LICENSE</a> para mais detalhes.</p>

</body>

</html>
