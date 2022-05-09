import React from 'react';
import style from './Typography.module.css';

type Props = {
    type: string;
    text: string;
}

const components = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p'
} as any

export const Typography = ({type, text}: Props) => {
    if (typeof components[type] !== "undefined") {
        return React.createElement(components[type], {className: style[type]}, text);
    } else return null;
}