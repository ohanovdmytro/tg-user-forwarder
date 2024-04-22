const { Api } = require("telegram");

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

module.exports = {
  forwardMessage,
};
