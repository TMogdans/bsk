import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Event} from "../Components/Organisms/Event";

export default {
    title: 'Organisms/Event',
    component: Event
} as ComponentMeta<typeof Event>

const Template: ComponentStory<typeof Event> = (args) => <Event {...args} />

export const Default = Template.bind({});
Default.args = {
    name: 'Super Convention',
    type: {
        name: 'convention',
        translation: 'Kongress'
    },
    country: 'de',
    zip: '99999',
    location: 'Musterhausen',
    beginsAt: '2022-12-17T00:00:00.000000Z',
    endsAt: '2022-12-17T00:00:00.000000Z',
    onlineEvent: false
}

export const MultiDay = Template.bind({});
MultiDay.args = {
    name: 'Super Multiday Convention',
    type: {
        name: 'convention',
        translation: 'Kongress'
    },
    country: 'de',
    zip: '99999',
    location: 'Musterhausen',
    beginsAt: '2022-12-17T00:00:00.000000Z',
    endsAt: '2022-12-19T00:00:00.000000Z',
    onlineEvent: false
}

export const OnlineEvent = Template.bind({});
OnlineEvent.args = {
    name: 'Super Online Release Party',
    type: {
        name: 'release',
        translation: 'Veröffentlichung'
    },
    beginsAt: '2022-12-17T00:00:00.000000Z',
    endsAt: '2022-12-19T00:00:00.000000Z',
    onlineEvent: true
}