import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { UIKitBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { ImageAttachment } from "./lib/ImageAttachment";

import { MemeCommand } from "./commands/meme";

export class MemeBuddyApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        http: IHttp,
        modify: IModify
    ) {
        const data = context.getInteractionData();
        console.log("Data =", data);

        const { actionId } = data;

        switch (actionId) {
            case "memeSelect": {
                const memeResponse = await http.get(
                    `https://meme-api.herokuapp.com/gimme/${data.value}/1`
                );

                const { room } = context.getInteractionData();

                const builder = await modify
                    .getCreator()
                    .startMessage()
                    .addAttachment(
                        new ImageAttachment(memeResponse.data.memes[0].url)
                    );

                if (room) {
                    builder.setRoom(room);
                }

                await modify.getCreator().finish(builder);

                return {
                    success: true,
                };
            }
        }

        return {
            success: false,
        };
    }

    protected async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(
            new MemeCommand(this)
        );
    }
}
