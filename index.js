import { create } from 'venom-bot'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai"
import { Client } from '@paymentsds/mpesa'

import fs from 'fs'
//const state = require("./state.js");

dotenv.config()

create({
    session: 'Chat-GPT',
    multidevice: true
})
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

const configuration = new Configuration({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const mpesa = new Client({
    apiKey: process.env.MPESA_APIKEY,             // API Key
    publicKey: process.env.MPESA_PUBLICKEY,          // Public Key
    serviceProviderCode: process.env.MPESA_SERVICEPROVIDERCODE // Service Provider Code
});

const getGPTResponse = async (name,clientText) => {
    const options = {
        model: "gpt-3.5-turbo", // Modelo GPT a ser usado
        messages: [
            {"role": "user", "content": "meu nome é " + name},
            {"role": "user", "content": clientText}
        ],
        user: name,
        temperature: 0
        //temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
        //max_tokens: 10000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
    }

    try {
        const response = await openai.createChatCompletion(options)
        
        let resp = response.data.choices[0].message.content;
        
        return `Chat GPT 🤖\n\n ${resp.trim()}`
    } catch (e) {
        return `❌ OpenAI Response Error: ${e.response?.data?.error?.message}`
    }
}

const getDavinciResponse = async (clientText) => {
    const options = {
        model: "text-davinci-003", // Modelo GPT a ser usado
        prompt: clientText, // Texto enviado pelo usuário
        temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
        max_tokens: 4000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
    }

    try {
        const response = await openai.createCompletion(options)
        let botResponse = ""
        response.data.choices.forEach(({ text }) => {
            botResponse += text
        })
        return `Chat GPT 🤖\n\n ${botResponse.trim()}`
    } catch (e) {
        return `❌ OpenAI Response Error: ${e.response?.data?.error?.message}`
    }
}

const getDalleResponse = async (clientText) => {
    const options = {
        prompt: clientText, // Descrição da imagem
        n: 1, // Número de imagens a serem geradas
        size: "1024x1024", // Tamanho da imagem
    }

    try {
        const response = await openai.createImage(options);
        return response.data.data[0].url
    } catch (e) {
        return `❌ OpenAI Response Error: ${e?.response?.data?.error?.message || e}`
    }
}

const generateSticker = async (client,message) => {
    
    if (message.type === "image") {
        try {
            const mimetype = message.mediaData.mimetype.split("/");

            const extension =
            mimetype[0] === "audio" ? 
                mimetype[1].split(";")[0] : 
                mimetype[1];

            var fileName =  `./content/${message.id}.${extension}`  
            let buff = await client.decryptFile(message);
                    
            fs.writeFileSync(
                fileName,
                buff,
                'binary',
                function (err) {
                    if (err != null) {
                      console.log(err);
                    }
                  }
            );
            
            return fileName;

        } catch (e) {
            return("❌ Erro ao processar imagem")
        }
    } else {
        try {

            const url = msg.body.substring(msg.body.indexOf(" ")).trim()
            const { data } = await axios.get(url, { responseType: 'arraybuffer' })
            const returnedB64 = Buffer.from(data).toString('base64');
            const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg")

            return image;
        } catch (e) {
            return "❌ Não foi possível gerar um sticker com esse link"
        }
    }
}

const generateImageVariation = async (client,message) => {
    
    if (message.type === "image") {
        try {
            const mimetype = message.mediaData.mimetype.split("/");

            const extension =
            mimetype[0] === "audio" ? 
                mimetype[1].split(";")[0] : 
                mimetype[1];

            var fileName =  `./content/${message.id}.${extension}`  
            let buff = await client.decryptFile(message);
                    
            fs.writeFileSync(
                fileName,
                buff,
                'binary',
                function (err) {
                    if (err != null) {
                      console.log(err);
                    }
                  }
            );
            
            return fileName;

        } catch (e) {
            return("❌ Erro ao processar imagem")
        }
    } else {
        try {

            const url = msg.body.substring(msg.body.indexOf(" ")).trim()
            const { data } = await axios.get(url, { responseType: 'arraybuffer' })
            const returnedB64 = Buffer.from(data).toString('base64');
            const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg")

            return image;
        } catch (e) {
            return "❌ Não foi possível gerar um sticker com esse link"
        }
    }
}

const commands = async (client, message) => {

    
    if (message.body === 'Hi' && message.isGroupMsg === false) {
        // await client
        //     .sendText(message.from, '👋 Hello from 🕷')
        //     .then((result) => {
        //         console.log('Result: ', result); //return object success
        //     })
        //     .catch((erro) => {
        //         console.error('Error when sending: ', erro); //return object error
        //     });

        await client
            .sendText(message.from, '👋 Seja muito bem vindo a nossa loja 🕷')
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });

        await client
            .sendText(message.from, 'Abaixo o nosso catalogo 👇🏿')
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });

        // Send List menu
        //This function does not work for Bussines contacts
        const listA = [
            {
                title: "Biblias",
                rows: [
                    {
                        title: "The Love Book",
                        description: "XXXX",
                    },
                    {
                        title: "Reed Box",
                        description: "XXXX",
                    },
                    {
                        title: "Cruz",
                        description: "XXXX",
                    },
                ]
            },
            {
                title: "Camisetes",
                rows: [
                    {
                        title: "The Truth - A Original",
                        description: "xxxx",
                    },
                    {
                        title: "Mundo",
                        description: "xxxx",
                    }
                ]
            }
        ];

        await client.sendListMenu(message.from, 'Produtos', 'Linha de Produtos', 'Catalogo', listA)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });

        // Send Messages with Buttons Reply
        // const buttons = [
        //     {
        //       "buttonText": {
        //         "displayText": "Text of Button 1"
        //         }
        //       },
        //     {
        //       "buttonText": {
        //         "displayText": "Text of Button 2"
        //         }
        //       }
        //     ]

        //     await client.sendButtons(message.from, 'Title', buttons, 'Description')
        //   .then((result) => {
        //     console.log('Result: ', result); //return object success
        //   })
        //   .catch((erro) => {
        //     console.error('Error when sending: ', erro); //return object error
        //   });

        //   let firstMessage = `Ola, Me encontro com acesso limitado a este telefone, em caso de urgencia entre em contacto com o meu número +258 84 95 35 156.
        //             Esta Mensaguem, é uma resposta automática, gerada pelo meu assistente - ChatBoot do WhatsApp`;

        //         client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, firstMessage)

        //         firstMessage = `Fica avontade para interagir mais com ele, encontra-se em fase de testes com os seguintes comandos:

        //             Comandos da mensaguem:
        //             /bot colaca o texto
        //             /img contexto da imagem
        //             /mpesa numero valor`;

        //         client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, firstMessage)

        //         firstMessage = `Ex: /bot faz uma letra de rap com 16 versos

        //             /bot cria um sitemap para o meu site de vendas

        //             /bot cria um programa em pyton para dizer olá

        //             /bot quais são os principais princípios de de design?

        //             /bot qual foi a melhor partida de Kasparov em pgn com comentários

        //             /img 3D render of a cute tropical fish in an aquarium on a dark blue background, digital art

        //             /img A centered explosion of colorful powder on a black background

        //             /img A photo of Michelangelo's sculpture of David wearing headphones djing

        //             /mpesa 849535156 10
        //         `;
        //         client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, firstMessage)

    } else {
        const iaCommands = {
            gpt: "/bot",
            davinci3: "/gpt",
            dalle: "/img",
            mpesa: "/mpesa",
            sticker: "/sticker",
            imageVariation: "/image",
            slogan: "/slogan",
        }

        let firstWord = message.text?.substring(0, message.text.indexOf(" ")) || "";

        switch (firstWord) {
            case iaCommands.imageVariation:
                if (message.type === "image") {
                    
                    var imageDescription = message.text.substring(message.text.indexOf(" "));

                    
                    generateImageVariation(client,message).then((image)=>{
                        client.sendImage(
                            message.from === process.env.BOT_NUMBER ? message.to : message.from,
                            image,
                            imageDescription,
                            'Imagem editada pela IA DALL-E 🤖'
                        );

                        

                    })
                    
                }
                //var image = await generateSticker(message, message.from);          
                break;

            case iaCommands.sticker:
                if (message.type === "image") {
                    
                    generateSticker(client,message).then((image)=>{
                        client.sendImageAsSticker(
                            message.from === process.env.BOT_NUMBER ? message.to : message.from,
                            image
                        );

                        

                    })
                    
                }else{
                    const imgUrl= message.text.substring(message.text.indexOf(" "));
                    await client.sendImageAsSticker(
                        message.from === process.env.BOT_NUMBER ? message.to : message.from, 
                        imgUrl
                    );
                }
                //var image = await generateSticker(message, message.from);          
                break;
            
                case iaCommands.gpt:
                    
                    const name = message.sender.name;
                    const question2 = message.text.substring(message.text.indexOf(" "));
                    getGPTResponse(name,question2).then((response) => {
                        /*
                         * Faremos uma validação no message.from
                         * para caso a gente envie um comando
                         * a response não seja enviada para
                         * nosso próprio número e sim para 
                         * a pessoa ou grupo para o qual eu enviei
                         */
                        client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, response)
                    })
                    break;
            
                case iaCommands.davinci3:
                
                const question = message.text.substring(message.text.indexOf(" "));
                getDavinciResponse(question).then((response) => {
                    /*
                     * Faremos uma validação no message.from
                     * para caso a gente envie um comando
                     * a response não seja enviada para
                     * nosso próprio número e sim para 
                     * a pessoa ou grupo para o qual eu enviei
                     */
                    client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, response)
                })
                break;
                case iaCommands.slogan:
                    const slogan = "Sugira um slogan para " + message.text.substring(message.text.indexOf(" "));
                    getDavinciResponse(slogan).then((response) => {
                        /*
                         * Faremos uma validação no message.from
                         * para caso a gente envie um comando
                         * a response não seja enviada para
                         * nosso próprio número e sim para 
                         * a pessoa ou grupo para o qual eu enviei
                         */
                        client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, response)
                    })
                    break;
            case iaCommands.dalle:
                const imgDescription = message.text.substring(message.text.indexOf(" "));
                getDalleResponse(imgDescription, message).then((imgUrl) => {
                    client.sendImage(
                        message.from === process.env.BOT_NUMBER ? message.to : message.from,
                        imgUrl,
                        imgDescription,
                        'Imagem gerada pela IA DALL-E 🤖'
                    )
                })
                break;

            case iaCommands.mpesa:
                const description = message.text.substring(message.text.indexOf(" "));

                var texts = description.split(" ");

                client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from,
                    "Vai Iniciar o Processo de Compra No Mpesa")

                const paymentData = {
                    from: texts[1],               // Customer MSISDN
                    reference: Math.round(6),              // Third Party Reference
                    transaction: Math.round(6),          // Transaction Reference
                    amount: texts[2]                   // Amount
                };

                mpesa.receive(paymentData).then(r => {
                    // Handle success scenario
                    client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, "Compra efectuada com sucesso")
                }).catch(e => {
                    // Handle success scenario
                    client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, e)
                });
                break;

            
        }
    }
}

async function start(client) {
    client.onAnyMessage((message) => commands(client, message));
}