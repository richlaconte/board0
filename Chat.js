class Chat {
    constructor() {
        this.messages = [];
        this.newMessage = (playerName, text) => {
            let message = {
                playerName,
                text
            }
            this.messages.push(message);
            return message;
        }
    };
}

module.exports = Chat;