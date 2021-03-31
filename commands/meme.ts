import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    IHttp,
    IModify,
    IRead,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { initiatorMessage } from "../lib/initiatorMessage";

export class MemeCommand implements ISlashCommand {
    public command = "meme";
    public i18nDescription = "Fetches a meme from famous meme subreddits!";
    public i18nParamsExample = "";
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const sender = context.getSender(); // the user calling the slashcommand
        const room = context.getRoom(); // the current room

        const data = {
            room: room,
            sender: sender,
        };

        await initiatorMessage({ data, read, persistence, modify, http });
    }
}
