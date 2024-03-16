export type BaseMessage = {
  message: string;
  meta: {
    producer: string;
    version: string;
  };
};

export type PersonMessage = BaseMessage & {
    message: "person-provided";
    payload: {
        firstName: string;
        lastName: string;
        description: string;
    };
}

export type CategoryMessage = BaseMessage & {
    message: "category-provided";
    payload: {
        name: string;
        description: string;
    };
}

export type MechanicMessage = BaseMessage & {
    message: "mechanic-provided";
    payload: {
        name: string;
        description: string;
    };
}

export type AwardMessage = BaseMessage & {
    message: "award-provided";
    payload: {
        name: string;
        description: string;
    };
}

export type PublisherMessage = BaseMessage & {
    message: "publisher-provided";
    payload: {
        name: string;
        description: string;
    };
}

export type BoardgameMessage = BaseMessage & {
    message: "boardgame-provided";
    payload: {
        name: string;
        description: string;
        minAge: number;
        minNumberOfPlayers: number;
        maxNumberOfPlayers: number;
        minPlayTimeMinutes: number;
        maxPlayTimeMinutes: number;
    };
}
