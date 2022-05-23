import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {DateContainer} from "../Components/Molekules/DateContainer";

export default {
    title: 'Molekules/Date Container',
    component: DateContainer
} as ComponentMeta<typeof DateContainer>

const Template: ComponentStory<typeof DateContainer> = (args) => <DateContainer {...args} />

export const SingleDay = Template.bind({});
SingleDay.args = {
    beginsAt: '2022-12-17T00:00:00.000000Z',
    endsAt: '2022-12-17T00:00:00.000000Z'
}

export const MultiDay = Template.bind({});
MultiDay.args = {
    beginsAt: '2022-12-17T00:00:00.000000Z',
    endsAt: '2022-12-20T00:00:00.000000Z'
}