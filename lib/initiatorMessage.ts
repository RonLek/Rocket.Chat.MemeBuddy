import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";

export async function initiatorMessage({
    data,
    read,
    persistence,
    modify,
    http
}: {
    data;
    read: IRead;
    persistence: IPersistence;
    modify: IModify;
    http: IHttp;
}) {
    const greetBuilder = await modify
        .getCreator()
        .startMessage()
        .setRoom(data.room)
        .setText(`Hey _${data.sender.username}_ !`);

    await modify.getCreator().finish(greetBuilder);

    const builder = await modify.getCreator().startMessage().setRoom(data.room);

    const block = modify.getCreator().getBlockBuilder();
    // TODO: Make options disappear when one selected

    block.addSectionBlock({
        text: block.newPlainTextObject("Choose a meme subreddit below 👇 "),
    });

    block.addActionsBlock({
        blockId: "subreddits",
        elements: [
            block.newButtonElement({
                actionId: "memeSelect",
                text: block.newPlainTextObject("ProgrammerHumor"),
                value: "programmerhumor",
                style: ButtonStyle.PRIMARY,
            }),
            block.newButtonElement({
                actionId: "memeSelect",
                text: block.newPlainTextObject("DankMemes"),
                value: "dankmemes",
                style: ButtonStyle.PRIMARY,
            }),
            block.newButtonElement({
                actionId: "memeSelect",
                text: block.newPlainTextObject("WholesomeMemes"),
                value: "wholesomememes",
                style: ButtonStyle.PRIMARY,
            }),
        ],
    });

    builder.setBlocks(block);

    await modify.getCreator().finish(builder);
}
