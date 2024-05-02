type BaseMessage = {
    message: string;
    meta: Meta;
    payload: any;
}

type Meta = {
    producer: string;
    version: string;
    timestamp: string;
}

type RatingReadMessage = BaseMessage & {
    message: 'RatingReadMessage';
    payload: {
        objectId: string;
        createdAt: string;
        total: number;
        weightedTotal: number;
        normalizedTotal: number;
        ratings: Rating[];
    }
}

type Rating = {
    name: string;
    weight: number;
    value: number;
    weighted: number;
}