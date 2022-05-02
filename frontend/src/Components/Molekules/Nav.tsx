import React from 'react';
import {NavItem} from "../Atoms/NavItem";
import {NavItemType} from "../../Types/NavItemType";
import style from "./Nav.module.css";

type Props = {
    items: Array<NavItemType>;
}

export const Nav = ({items}: Props) => {
    return <ul className={style.container}>
        {items && items.map((item, index) => <NavItem item={item} key={index} />)}
    </ul>
}