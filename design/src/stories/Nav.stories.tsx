import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Nav} from "../Components/Molekules/Nav";
import items from "../Utils/navItems.json";

export default {
    title: 'Molekules/Nav',
    component: Nav,
    argTypes: {
        items
    }
} as ComponentMeta<typeof Nav>

const Template: ComponentStory<typeof Nav> = (args) => <Nav {...args} />

export const Default = Template.bind({});

Default.args = {
    items
}