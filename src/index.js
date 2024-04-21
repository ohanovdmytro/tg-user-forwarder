const { Api, TelegramClient } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const readline = require("readline");
const { forwardMessages } = require("telegram/client/messages");
require("dotenv").config();

const apiHash = process.env.API_HASH;
const apiId = Number(process.env.API_ID);
const phoneNumber = process.env.PHONE_NUMBER;

const sourceChatId = process.env.SOURCE_ID;
const targetChatId = process.env.TARGET_ID;

const session = new StoreSession("session1");

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

const start = async () => {
  try {
    await client.start({
      phoneNumber: phoneNumber,
      password: async () => await askQuestion("Please enter your password: "),
      phoneCode: async () =>
        await askQuestion("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });

    console.log(
      `Tracking messages in chat ${sourceChatId} and forwarding them to ${targetChatId}`
    );

    await client.addEventHandler(
      forwardMessage,
      new NewMessage({ chats: [sourceChatId] })
    );
  } catch (e) {
    console.error("Error when listening for messages: ", e);
  }
};

async function forwardMessage(event) {
  try {
    const messageId = event.message.id;
    const chatId = event.message.peerId.userId?.value.toString();

    if (typeof event.message.fromId?.userId?.value === "bigint") {
      console.log(
        `Selfsent message ignored from ${event.message.fromId?.userId.value.toString()}`
      );
    } else if (chatId === sourceChatId) {
      await client.invoke(
        new Api.messages.ForwardMessages({
          fromPeer: parseInt(sourceChatId),
          toPeer: parseInt(targetChatId),
          id: [parseInt(messageId)],
        })
      );
    }
  } catch (e) {
    console.error("Error when forwarding message: ", e.message);
  }
}

async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

start();
