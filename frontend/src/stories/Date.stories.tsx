import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Date} from "../Components/Molekules/Date";

export default {
    title: 'Molekules/Date',
    component: Date
} as ComponentMeta<typeof Date>

const Template: ComponentStory<typeof Date> = (args) => <Date {...args} />

export const Default = Template.bind({})
Default.args = {
    date: '2022-12-17T00:00:00.000000Z'
}