import {Typography} from "../Atoms/Typography";
import {TypographyStyle} from "../../Types/TypographyType";
import dayjs from "dayjs";
import style from "./Date.module.css";
import React from "react";

type Properties = {
    date: string;
}

export const Date = ({date}: Properties) => {
    return <div className={style.container}>
        <Typography
            type={TypographyStyle.span}
            text={dayjs(date).format('DD')}
            className={style.day}
        />
        <Typography
            type={TypographyStyle.span}
            text={dayjs(date).format('MMM')}
            className={style.month}
        />
    </div>
}