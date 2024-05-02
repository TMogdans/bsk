import dayjs from "dayjs";
import React from "react";
import style from "./DateContainer.module.css";
import {Date} from "./Date";

type Properties = {
    beginsAt: string;
    endsAt: string;
}

export const DateContainer = ({beginsAt, endsAt}: Properties) => {
    return <div className={style.wrapper}>
        <div className={style.container}>
            <Date date={beginsAt} />
        </div>
        {!dayjs(beginsAt).isSame(endsAt) &&
            <div className={style.container}>
                <div className={style.dash} />
                <Date date={endsAt} />
            </div>
        }
    </div>
}