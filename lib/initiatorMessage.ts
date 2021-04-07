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
    http,
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

    // Notifier not applicable to LiveChat Rooms
    if (data.room.type !== "l") {
        await modify
            .getNotifier()
            .notifyUser(data.sender, greetBuilder.getMessage());
    } else {
        await modify.getCreator().finish(greetBuilder);
    }

    const builder = await modify.getCreator().startMessage().setRoom(data.room);

    const block = modify.getCreator().getBlockBuilder();

    block.addSectionBlock({
        text: block.newPlainTextObject("Choose a meme category below 👇 "),
    });

    block.addActionsBlock({
        blockId: "subreddits",
        elements: [
            block.newButtonElement({
                actionId: "memeSelect",
                text: block.newPlainTextObject("Programmer"),
                value: "programmerhumor",
                style: ButtonStyle.PRIMARY,
            }),
            block.newButtonElement({
                actionId: "memeSelect",
                text: block.newPlainTextObject("Dank"),
                value: "dankmemes",
                style: ButtonStyle.PRIMARY,
            }),
            block.newButtonElement({
                actionId: "memeSelect",
                text: block.newPlainTextObject("Wholesome"),
                value: "wholesomememes",
                style: ButtonStyle.PRIMARY,
            }),
        ],
    });

    builder.setBlocks(block);

    // Notifier not applicable to LiveChat Rooms
    if (data.room.type !== "l") {
        await modify
            .getNotifier()
            .notifyUser(data.sender, builder.getMessage());
    } else {
        await modify.getCreator().finish(builder);
    }
}
