export type EventType = {
    name: string;
    type: {
        name: string;
        translation: string;
    };
    beginsAt: string;
    endsAt: string;
    zip?: string;
    location?: string;
    country?: string;
    street?: string;
    description: string;
    barrierFree: boolean;
    entryFree: boolean;
    onlineEvent: boolean;
    eventUrl: string;
    meta: {
        url: string;
    }
}