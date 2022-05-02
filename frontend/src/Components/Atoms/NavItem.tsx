import React from 'react';
import {NavItemType} from "../../Types/NavItemType";
import style from "./NavItem.module.css";

type Props = {
    item: NavItemType;
}

export const NavItem = ({item}: Props) => {
    return <li className={style.container}>{item.name}</li>
}