import type {BaseMessage} from "../types/messages";

export interface ProcessorInterface<T = unknown> {
    setMessage(message: BaseMessage): Promise<void>;
    create(): Promise<T | null>;
}
