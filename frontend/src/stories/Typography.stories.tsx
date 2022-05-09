import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {Typography} from "../Components/Atoms/Typography";

export default {
    title: 'Atoms/Typography',
    component: Typography,
} as ComponentMeta<typeof Typography>

const Template: ComponentStory<typeof Typography> = (args) => <Typography {...args} />

export const H1 = Template.bind({});
H1.args = {
    type: 'h1',
    text: 'lorem ipsum'
}

export const H2 = Template.bind({});
H2.args = {
    type: 'h2',
    text: 'lorem ipsum'
}

export const H3 = Template.bind({});
H3.args = {
    type: 'h3',
    text: 'lorem ipsum'
}

export const Paragraph = Template.bind({});
Paragraph.args = {
    type: 'p',
    text: 'The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother\'s keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.'
}