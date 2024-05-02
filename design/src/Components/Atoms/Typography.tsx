import React from 'react';
import style from './Typography.module.css';
import {TypographyStyle} from "../../Types/TypographyType";

type Properties = {
    type: TypographyStyle;
    text: string;
    className?: string;
}

export const Typography = ({type, text, className}: Properties) => {
    if (typeof type !== "undefined") {
        const combinedStyle = [style[type], className].join(" ");
        return React.createElement(type.toString(), {className: combinedStyle}, text);
    } else return null;
}