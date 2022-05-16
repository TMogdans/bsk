import React from 'react';
import style from './Typography.module.css';
import {TypographyStyle} from "../../Types/TypographyType";

type Props = {
    type: TypographyStyle;
    text: string;
}

export const Typography = ({type, text}: Props) => {
    if (typeof type !== "undefined") {
        return React.createElement(type.toString(), {className: style[type]}, text);
    } else return null;
}