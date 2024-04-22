const { Api, TelegramClient } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const { forwardMessages } = require("telegram/client/messages");
const { askQuestions } = require("./helpers/askQuestions");

require("dotenv").config();

const apiHash = process.env.API_TEST_HASH;
const apiId = Number(process.env.API_TEST_ID);
const phoneNumber = process.env.PHONE_TEST_NUMBER;

const sourceChatId = process.env.SOURCE_TEST_ID;
const targetChatId = process.env.TARGET_TEST_ID;

const session = new StoreSession("session1");

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

const start = async () => {
  try {
    await client.start({
      phoneNumber: phoneNumber,
      password: async () => await askQuestions("Please enter your password: "),
      phoneCode: async () =>
        await askQuestions("Please enter the code you received: "),
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
    console.error("Error when forwarding message: ", e);
  }
}

start();
