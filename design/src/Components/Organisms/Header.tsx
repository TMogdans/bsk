import items from "../../Utils/navItems.json";
import {Nav} from "../Molekules/Nav";
import React from "react";
import style from "./Header.module.css";

export const Header = () => {
    return <header className={style.container}>
        <div className={style.wrapper}>
            <Nav items={items} />
        </div>
    </header>
}