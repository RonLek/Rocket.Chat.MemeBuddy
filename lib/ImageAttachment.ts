import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';

export class ImageAttachment implements IMessageAttachment{
    imageUrl?: string; // [1]

    constructor(imgUrl: string){
        this.imageUrl = imgUrl;
    }

}