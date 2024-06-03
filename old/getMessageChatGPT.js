import OpenAI from "openai";
import { useState, useEffect } from 'react';
import { getAPIKey } from "../getAPIKey.js";

export const getMessageChatGPT = () => {

    const [apiKey, setApiKey] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchAPIKey = async () => {
            const key = await getAPIKey();
            setApiKey(key);
        };

        if (!apiKey) {
            fetchAPIKey();
        }
    }, [apiKey]);

    useEffect(() => {
        const fetchMessage = async() => {
            if (apiKey) {
                setMessage(apiKey);
            }
        }

        fetchMessage();
    }, [apiKey])

    return message;
};