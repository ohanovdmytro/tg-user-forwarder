const { TelegramClient } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");

const { forwardMessage } = require("./middleware/forwardMessage");
const { authUser } = require("./middleware/authUser");

require("dotenv").config();

const apiHash = process.env.API_TEST_HASH;
const apiId = Number(process.env.API_TEST_ID);

const sourceChatId = process.env.SOURCE_TEST_ID;
const targetChatId = process.env.TARGET_TEST_ID;

const session = new StoreSession("session1");

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

const start = async () => {
  try {
    await authUser(client);

    console.log(
      `Tracking messages in chat ${sourceChatId} and forwarding them to ${targetChatId}`
    );

    await client.addEventHandler(
      (event) => forwardMessage({ event, client }),
      new NewMessage({ chats: [sourceChatId] })
    );
  } catch (e) {
    console.error("Error when listening for messages: ", e);
  }
};

start();
