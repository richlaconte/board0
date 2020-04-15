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
        this.statusMessage = (text) => {
            let message = {
                playerName: null,
                text
            }
            return message;
        }
    };
}

module.exports = Chat;