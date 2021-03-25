import {ISlashCommand, SlashCommandContext} from '@rocket.chat/apps-engine/definition/slashcommands';
import {IHttp, IModify, IRead} from '@rocket.chat/apps-engine/definition/accessors';
import {App} from '@rocket.chat/apps-engine/definition/App';
import {ImageAttachment} from '../lib/ImageAttachment'

export class ScottyCommand implements ISlashCommand {
    public command = 'scotty';
    public i18nDescription = 'Fetches a meme from r/ProgrammerHumor on Reddit';
    public i18nParamsExample = '';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {

        const memeResponse = await http.get("https://meme-api.herokuapp.com/gimme/ProgrammerHumor/1")
        const message = JSON.stringify(memeResponse.data, null, 2);

        const messageStructure = await modify.getCreator().startMessage();
        const sender = context.getSender(); // the user calling the slashcommand
        const room = context.getRoom(); // the current room

        messageStructure
        .setRoom(room)
        .setText(`Here's a meme by _${sender.username}_ to cheer you up! :tada:`)
        .addAttachment(new ImageAttachment(memeResponse.data.memes[0].url));

        await modify.getCreator().finish(messageStructure);
    }
}