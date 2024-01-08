import React from 'react';
import {NavItemType} from "../../Types/NavItemType";
import style from "./NavItem.module.css";

type Props = {
    item: NavItemType;
}

export const NavItem = ({item}: Props) => {
    const target = isValidURL(item.target) ? item.target : 'fallback-url';
    return (
        <li className={style.container}>
            <a href={target}>{item.name}</a>
        </li>
    );
}

function isValidURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
