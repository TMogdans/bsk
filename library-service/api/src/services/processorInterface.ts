export interface ProcessorInterface {
    setMessage(message: any): ProcessorInterface;
    create(): Promise<any>;
}
