const { URL_PIN_MESSAGE, URL_UN_PIN_MESSAGE } = require ('../../constant');

const handlePinMessage = async (chat_id, message_id) => {
    try {
        
        const res = await fetch(URL_PIN_MESSAGE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id,
                message_id
            })
        });

        const json = await res.json();

        if (!json.ok) {
            throw new Error(json.description);
        }
       
    } catch (error) {
        throw new error;
        
    }
};

const handleUnPinMessage = async (chat_id, message_id) => {
    try {
        
        const res = await fetch(URL_UN_PIN_MESSAGE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id,
                message_id
            })
        });

        const json = await res.json();

        if (!json.ok) {
            throw new Error(json.description);
        }
       
    } catch (error) {
        throw new error;
        
    }
};

const autoPinnedTheNewOne = async (newMessageId, oldMessageId, chatId) => {
    // remove old poll
    if (oldMessageId) {
        await handleUnPinMessage(
            chatId,
            oldMessageId
        );
    }

    // pin new poll
    await handlePinMessage(chatId, newMessageId);
};

exports.handlePinMessage = handlePinMessage;
exports.handleUnPinMessage = handleUnPinMessage;
exports.autoPinnedTheNewOne = autoPinnedTheNewOne;