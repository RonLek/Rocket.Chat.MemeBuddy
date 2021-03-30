import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";

import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    IHttp,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";

export class MemeCommand implements ISlashCommand {
    public command = "meme";
    public i18nDescription = "Fetches a meme from r/ProgrammerHumor on Reddit";
    public i18nParamsExample = "";
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const sender = context.getSender(); // the user calling the slashcommand
        const room = context.getRoom(); // the current room

        const greetBuilder = await modify
            .getCreator()
            .startMessage()
            .setRoom(room)
            .setText(`Hey _${sender.username}_ !`);

        await modify.getCreator().finish(greetBuilder);

        const builder = await modify
            .getCreator()
            .startMessage()
            .setRoom(room)
            .setText(`Hey _${sender.username}_ !`);

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
}
