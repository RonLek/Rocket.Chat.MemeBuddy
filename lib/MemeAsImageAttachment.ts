import { IMessageAttachment } from "@rocket.chat/apps-engine/definition/messages";

export class MemeAsImageAttachment implements IMessageAttachment {
    imageUrl?: string;

    constructor(imgUrl: string) {
        this.imageUrl = imgUrl;
    }
}
