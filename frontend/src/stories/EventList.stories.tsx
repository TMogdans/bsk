import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {EventList} from "../Components/Organisms/EventList";
import {EventType} from "../Types/EventType";

export default {
    title: 'Organisms/Event List',
    component: EventList
} as ComponentMeta<typeof EventList>

const Template: ComponentStory<typeof EventList> = (args) => <EventList {...args} />

export const Default = Template.bind({});
Default.args = {
    heading: 'Termine 2022',
    months: [
        {
            heading: 'Mai 2022',
            events: [
                {
                    name: 'Super Convention',
                    type: {
                        name: 'convention',
                        translation: 'Kongress'
                    },
                    country: 'de',
                    zip: '99999',
                    location: 'Musterhausen',
                    beginsAt: '2022-05-17T00:00:00.000000Z',
                    endsAt: '2022-05-17T00:00:00.000000Z',
                    onlineEvent: false

                } as EventType,
                {
                    name: "Noch 'ne Super Convention",
                    type: {
                        name: 'convention',
                        translation: 'Kongress'
                    },
                    country: 'de',
                    zip: '99999',
                    location: 'Musterhausen',
                    beginsAt: '2022-05-20T00:00:00.000000Z',
                    endsAt: '2022-05-21T00:00:00.000000Z',
                    onlineEvent: false
                } as EventType
            ]
        },
        {
            heading: 'Juni 2022',
            events: [
                {
                    name: 'Super Preisverleihung',
                    type: {
                        name: 'award',
                        translation: 'Preisverleihung'
                    },
                    beginsAt: '2022-06-01T00:00:00.000000Z',
                    endsAt: '2022-06-01T00:00:00.000000Z',
                    onlineEvent: true
                } as EventType,
                {
                    name: 'Veröffentlichung vong 1 neues Game',
                    type: {
                        name: 'release',
                        translation: 'Veröffentlichung'
                    },
                    beginsAt: '2022-06-10T00:00:00.000000Z',
                    endsAt: '2022-06-11T00:00:00.000000Z',
                    onlineEvent: true
                } as EventType
            ]
        }
    ]
}