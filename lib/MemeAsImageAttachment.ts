import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';

export class MemeAsImageAttachment implements IMessageAttachment{
    imageUrl?: string; // [1]

    constructor(imgUrl: string){
        this.imageUrl = imgUrl;
    }

}