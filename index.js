import { create } from 'venom-bot'
import * as dotenv from 'dotenv'
import OpenAI from "openai"
import request from 'request';


import fs from 'fs'

import axios from 'axios';
//const state = require("./state.js");

dotenv.config()

create({
    session: 'Chat-GPT',
    multidevice: true,
    headless: 'new'
})
    .then((client) => start(client))
    .catch((error) => {
        console.log(error);
    });

// const configuration = new Configuration({
//     organization: process.env.ORGANIZATION_ID,
//     apiKey: process.env.OPENAI_KEY,
// });

const openai = new OpenAI({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.OPENAI_KEY,
});

const getMessages = async (cellphone, from) => {

    var messages = [];
    let msg;

    from = from || cellphone

    if (process.env.STORE_NUMBER === cellphone) {
        from = cellphone
    }

    await axios.get(`${process.env.API_URL}/messages/${cellphone}/${from}`).then(response => {
        msg = response.data.messages;
    });
    
    msg = msg?.forEach((item) => {
        messages.push({
            "role": "user", "content": item.message
        })
        messages.push({
            "role": "assistant", "content": item.reply
        })
    }
    )
    return messages
}

const deleteMessages = async (cellphone, from) => {

    var messages = [];
    let msg;

    from = from || cellphone

    if (process.env.STORE_NUMBER === cellphone) {
        from = cellphone
    }

    await axios.post(`${process.env.API_URL}/messages/${cellphone}/${from}/reset`, {
        cellphone,
        from
    });

    return "Apagado com Sucesso!"
}

const getGPTResponse = async (name, clientText, messages) => {

    messages.unshift({ "role": "user", "content": "meu nome é " + name })
    messages.push({ "role": "user", "content": clientText })

    const options = {
        model: "gpt-4-0613", // Modelo GPT a ser usado
        messages: messages,
        user: name,
        temperature: 0
        //temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
        //max_tokens: 10000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
    }

    try {

        console.log(messages)

        const chatCompletion  = await openai.chat.completions.create(options)
        
        let resp = chatCompletion.choices[0].message.content;

        return `Chat GPT 🤖\n\n ${resp.trim()}`
    } catch (e) {
        console.log(e)
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

const getGptImageResponse = async (clientText) => {
    const options = {
        prompt: clientText, // Descrição da imagem
        n: 1, // Número de imagens a serem geradas
        size: "1024x1024", // Tamanho da imagem
    }

    try {
        const response = await openai.images.generate(options);
        console.log(response.data)
        return response.data[0].url
    } catch (e) {
        return `❌ OpenAI Response Error: ${e?.response?.data?.error?.message || e}`
    }
}

const getStableDifFusion = async(clientPrompt) =>{
    
    var imgUrl;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");
    myHeaders.append("Access-Control-Allow-Headers", "Content-Type");
    myHeaders.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization",`Bearer ${process.env.StableDifFusion_API_URL}`)

    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            "Accept": "application/json"
        }
      }

    var raw = JSON.stringify({
        "key": process.env.StableDifFusion_API_URL,
        "prompt": clientPrompt,
        "negative_prompt": null,
        "width": "512",
        "height": "512",
        "samples": "1",
        "num_inference_steps": "20",
        "seed": null,
        "guidance_scale": 7.5,
        "safety_checker": "yes",
        "multi_lingual": "no",
        "panorama": "no",
        "self_attention": "no",
        "upscale": "no",
        "embeddings_model": null,
        "webhook": null,
        "track_id": null
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

    await axios.post('https://stablediffusionapi.com/api/v3/text2img',raw,axiosConfig )
    .then(function (response) {
        imgUrl = response.data.output[0];

    }).catch(function (error) {
        console.log(error);
    });

    return imgUrl
}

const generateSticker = async (client, message) => {

    if (message.type === "image") {
        try {
            const mimetype = message.mediaData.mimetype.split("/");

            const extension =
                mimetype[0] === "audio" ?
                    mimetype[1].split(";")[0] :
                    mimetype[1];

            var fileName = `./content/${message.id}.${extension}`
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
            return ("❌ Erro ao processar imagem")
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

const generateImageVariation = async (client, message) => {

    if (message.type === "image") {
        try {
            const mimetype = message.mediaData.mimetype.split("/");

            const extension =
                mimetype[0] === "audio" ?
                    mimetype[1].split(";")[0] :
                    mimetype[1];

            var fileName = `./content/${message.id}.${extension}`
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
            return ("❌ Erro ao processar imagem")
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
        await client
            .reply(message.from, '👋 Seja muito bem vindo a nossa loja 🕷',
                message.id)
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
        // const listA = [
        //     {
        //         title: "Biblias",
        //         rows: [
        //             {
        //                 title: "The Love Book",
        //                 description: "XXXX",
        //             },
        //             {
        //                 title: "Reed Box",
        //                 description: "XXXX",
        //             },
        //             {
        //                 title: "Cruz",
        //                 description: "XXXX",
        //             },
        //         ]
        //     },
        //     {
        //         title: "Camisetes",
        //         rows: [
        //             {
        //                 title: "The Truth - A Original",
        //                 description: "xxxx",
        //             },
        //             {
        //                 title: "Mundo",
        //                 description: "xxxx",
        //             }
        //         ]
        //     }
        // ];

        // await client.sendListMenu(message.from, 'Produtos', 'Linha de Produtos', 'Catalogo', listA)
        //     .then((result) => {
        //         console.log('Result: ', result); //return object success
        //     })
        //     .catch((erro) => {
        //         console.error('Error when sending: ', erro); //return object error
        //     });

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
            gptImage: "/img",
            dalle: "/dalle",
            mpesa: "/mpesa",
            sticker: "/sticker",
            imageVariation: "/image",
            slogan: "/slogan",
            reset: "/bot reset",
        }

        if (iaCommands.reset === message.body) {

            var msg = await deleteMessages(message.from, message.author)

            await client.reply(message.from === process.env.BOT_NUMBER ? message.to : message.from, msg, message.id)
            return;
        }


        let firstWord = message.body?.substring(0, message.body.indexOf(" ")) || "";

        switch (firstWord) {
            case iaCommands.imageVariation:
                if (message.type === "image") {

                    var imageDescription = message.text.substring(message.text.indexOf(" "));

                    generateImageVariation(client, message).then((image) => {
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

                    generateSticker(client, message).then((image) => {
                        client.sendImageAsSticker(
                            message.from === process.env.BOT_NUMBER ? message.to : message.from,
                            image
                        );
                    })

                } else {
                    const imgUrl = message.text.substring(message.text.indexOf(" "));
                    await client.sendImageAsSticker(
                        message.from === process.env.BOT_NUMBER ? message.to : message.from,
                        imgUrl
                    );
                }
                //var image = await generateSticker(message, message.from);          
                break;

            case iaCommands.gpt:
                const name = message.sender.name;
                const question2 = message.body.substring(message.body.indexOf(" "));

                var msg = await getMessages(message.from, message.author)

                await getGPTResponse(name, question2, msg).then(async (response) => {
                    /*
                        * Faremos uma validação no message.from
                        * para caso a gente envie um comando
                        * a response não seja enviada para
                        * nosso próprio número e sim para 
                        * a pessoa ou grupo para o qual eu enviei
                        */

                    await client.reply(message.from === process.env.BOT_NUMBER ? message.to : message.from, response, message.id)

                    var cellphone = message.author

                    if (process.env.STORE_NUMBER === message.from) {
                        cellphone = message.from
                    }

                    await axios.post(`${process.env.API_URL}/messages/create`, {
                        name: name,
                        cellphone: message.from,
                        text: cellphone,//message.author,
                        message: question2,
                        reply: response.replace("Chat GPT 🤖\n\n ", ""),
                        json: message
                    }).then(function (response) {

                    }).catch(function (error) {
                        console.log(error);
                    });
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

            case iaCommands.gptImage:
                const imgDescriptionGpt = message.body.substring(message.body.indexOf(" "));

                var cellphone = message.author

                    if (process.env.STORE_NUMBER === message.from) {
                        cellphone = message.from
                    }

                getStableDifFusion(imgDescriptionGpt).then((imgUrl) => {
                    console.log(imgUrl)
                    client.sendImage(
                        message.from === process.env.BOT_NUMBER ? message.to : message.from,
                        imgUrl,
                        "gpt1",
                        `Receba ${cellphone}`
                    )
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
        }
    }
}

async function start(client) {
    await client.onAnyMessage((message) => commands(client, message));

    await client.sendText(process.env.PHONE_NUMBER2, "Ola, já estamos online")

    //var msg = await getGPTResponse("Grupo de Testes","Me envia uma mensagem simples para o whatsapp um grupo de amigos jovens que estamos a testar o Chat-GPT, a avisar que ja estas online, e uma mensaguem motivacional sem mensionar que é motivacional, e a avisar que estamos prontos para fazer a assistencia virtual, durante o periodo das 8:30 as 17:30. O texto deve conter paragrafos")
    var msg = "Ola, já estamos online"
    await client.sendText(process.env.GROUP_ID, msg);
    console.log(msg)

}