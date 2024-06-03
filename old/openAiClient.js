import OpenAI from "openai";
import { getAPIKey } from "./getAPIKey.js";
import { useState, useEffect, Configuration } from "react";

export const openAiClient = () => {

    const [key, setKey] = useState("");

    useEffect(() => {
        const fetchAPIKey = async () => {
            const value = await getAPIKey();
            setKey(value);
        };

        if (!key) {
            fetchAPIKey();
        }
    }, [key]);
    
    const openai = new OpenAI({
        apiKey: {key},
    });
    return openai;
};
