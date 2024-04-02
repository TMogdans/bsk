import {BaseMessage} from "../types/messages";

export interface ProcessorInterface {
    setMessage(message: BaseMessage): Promise<void>;
    create(): Promise<any>;
}
