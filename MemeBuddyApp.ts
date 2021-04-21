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
import {
    IUIKitResponse,
    UIKitLivechatBlockInteractionContext,
    UIKitBlockInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { MemeAsImageAttachment } from "./lib/MemeAsImageAttachment";

import { MemeCommand } from "./commands/meme";
import {
    IMessage,
    IPostMessageSent,
} from "@rocket.chat/apps-engine/definition/messages";
import { initiatorMessage } from "./lib/initiatorMessage";

export class MemeBuddyApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        const data = context.getInteractionData();

        const { actionId } = data;

        switch (actionId) {
            case "memeSelect": {
                try {
                    const memeResponse = await http.get(
                        `https://meme-api.herokuapp.com/gimme/${data.value}/1`
                    );

                    const { room } = context.getInteractionData();

                    const memeSender = await modify
                        .getCreator()
                        .startMessage()
                        .setText(`*${memeResponse.data.memes[0].title}*`)
                        .addAttachment(
                            new MemeAsImageAttachment(
                                memeResponse.data.memes[0].url
                            )
                        );

                    if (room) {
                        memeSender.setRoom(room);
                    }

                    await modify.getCreator().finish(memeSender);

                    return {
                        success: true,
                    };
                } catch (err) {
                    console.error(err);
                    return {
                        success: false,
                    };
                }
            }
        }

        return {
            success: false,
        };
    }

    public async executeLivechatBlockActionHandler(
        context: UIKitLivechatBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        const data = context.getInteractionData();

        const { actionId } = data;

        switch (actionId) {
            case "memeSelect": {
                try {
                    const memeResponse = await http.get(
                        `https://meme-api.herokuapp.com/gimme/${data.value}/1`
                    );

                    const { room } = context.getInteractionData();

                    const memeSender = await modify
                        .getCreator()
                        .startLivechatMessage()
                        .setVisitor(data.visitor)
                        .setText(`*${memeResponse.data.memes[0].title}*`)
                        .addAttachment(
                            new MemeAsImageAttachment(
                                `${memeResponse.data.memes[0].url}`
                            )
                        );

                    if (room) {
                        memeSender.setRoom(room);
                    }

                    await modify.getCreator().finish(memeSender);

                    return {
                        success: true,
                    };
                } catch (err) {
                    console.error(err);
                    return {
                        success: false,
                    };
                }
            }
        }

        return {
            success: false,
        };
    }

    public async executePostMessageSent(
        message: IMessage,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {
        if (message.room.type !== "l") {
            return;
        }

        if (message.text === ":meme:") {
            const data = {
                room: message.room,
                sender: message.sender,
            };
            await initiatorMessage({ data, read, persistence, modify, http });
        }
    }

    protected async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(
            new MemeCommand(this)
        );
    }
}
