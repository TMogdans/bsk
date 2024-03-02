import {RatingMessage, Config} from "../../../src/types/rating";
import RatingGenerator from "../../../src/services/ratingGenerator";

it('should create a RatingGenerator instance with a received message and a config array', () => {
    // Given
    const receivedMessage: RatingMessage = {
        message: "Test Message",
        meta: {
            producer: "Test Producer",
            version: "1.0"
        },
        payload: {
            object_id: "123",
            user_id: "456",
            material_quality: 5,
            layout: 4,
            complexity: 3,
            difficulty: 2,
            fun: 1,
            variety: 5,
            replayability: 4
        }
    };

    const config: Config[] = [
        {
            id: "1",
            name: "material_quality",
            weight: 1,
            order: 1
        },
        {
            id: "2",
            name: "layout",
            weight: 1,
            order: 2
        },
        {
            id: "3",
            name: "complexity",
            weight: 1,
            order: 3
        },
        {
            id: "4",
            name: "difficulty",
            weight: 1,
            order: 4
        },
        {
            id: "5",
            name: "fun",
            weight: 1,
            order: 5
        },
        {
            id: "6",
            name: "variety",
            weight: 1,
            order: 6
        },
        {
            id: "7",
            name: "replayability",
            weight: 1,
            order: 7
        }
    ];

    // When
    const ratingGenerator = new RatingGenerator(receivedMessage, config);

    // Then
    expect(ratingGenerator).toBeInstanceOf(RatingGenerator);
});
