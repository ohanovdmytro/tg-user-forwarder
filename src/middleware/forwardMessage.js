const { Api } = require("telegram");
require("dotenv").config();

const sourceChatId = process.env.SOURCE_TEST_ID;
const targetChatId = process.env.TARGET_TEST_ID;

async function forwardMessage(handleEvent) {
  const { event, client } = handleEvent;

  try {
    const messageId = event.message.id;
    const chatId = event.message.peerId.userId?.value.toString();

    if (typeof event.message.fromId?.userId?.value === "bigint") {
      console.log(
        `Selfsent message ignored from ${event.message.fromId?.userId.value.toString()}`
      );
    } else if (chatId === sourceChatId) {
      const result = await client.invoke(
        new Api.messages.ForwardMessages({
          fromPeer: parseInt(sourceChatId),
          toPeer: parseInt(targetChatId),
          id: [parseInt(messageId)],
        })
      );
      console.log(`${new Date()} -- Message forwarded to StudenHelp_bot`);
    }
  } catch (e) {
    console.error("Error when forwarding message: ", e.message);
  }
}

module.exports = {
  forwardMessage,
};
