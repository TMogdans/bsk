import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {NavItem} from "../Components/Atoms/NavItem";

export default {
    title: 'Atoms/Nav Item',
    component: NavItem,
} as ComponentMeta<typeof NavItem>

const Template: ComponentStory<typeof NavItem> = (args) => <NavItem {...args} />

export const Default = Template.bind({});
Default.args = {
    item: {
        name: 'First Item',
        target: 'main',
    }
};
