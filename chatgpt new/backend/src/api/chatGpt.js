const axios = require('axios');
const moment = require('moment');
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

const router = express.Router();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


router.post('/store', async (req, res) => {
    let text = "";
    let prompt = "";

    // David: Can I help you with anything ? 

    prompt = `
    Imagine you are an RPA robot and can answer every field. If asked to run a process, respond with the syntax: "I'm starting process {Process name}. Please wait a few minutes." (With the process name taken from the request)'

        Patient : ${req.body.message}
    `;

    const response = await openai.createCompletion({
        model: "gpt-3",
        prompt: prompt,
        max_tokens: 100,
        temperature: 0,
    });

    text = response?.data?.choices[0]?.text;
    text = text.replace(/<\/?[^>]+(>|$)/g, "").trim();
    // text = "Hi, doctor. To be honest, I'm feeling quite stressed lately";

    // const linkVideo = await storeDid(text);

    res.json({
        response: text,
        // linkVideo: linkVideo,
    });
    
});

const storeDid = async (message) => {
    let response = "";

    const options = {
        method: 'GET',
        url: 'https://api.d-id.com/talks/tlk_K16JjGEkgrfm02wx2EtSX',
        headers: {
            // accept: 'application/json',
            // authorization: 'Basic bmhhaWRpaUB5YWhvby5jb20:ehTHZ6_GoQ5ndrNhDuVTt',
            // 'Content-Type': 'application/json', // Set the content type to JSON
            'Authorization': 'Basic dmV0bmFuZzExMDJAZ21haWwuY29t:y06spLSPHdZti44Oo_l-_'
        },
        data: {
            "script": {
                "type": "text",
                "input": "Hi, Can I help you with anything ?",
                "provider": {
                    "type": "microsoft",
                    "voice_id": "Jenny",
                    "voice_config": {
                        "style": "Chat"
                    }
                }
            },
            "config": {
                "stich": "true"
            },
            "source_url": "https://create-images-results.d-id.com/DefaultPresenters/Fotisa_f_ai/image.jpg"
        }
    };

    await axios
        .request(options)
        .then(function (responses) {
            console.log(responses.data);
            response = responses.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return response;
}
    
module.exports = router;