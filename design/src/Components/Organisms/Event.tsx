import React from 'react';
import {EventType} from "../../Types/EventType";
import {Typography} from "../Atoms/Typography";
import {TypographyStyle} from "../../Types/TypographyType";
import dayjs from "dayjs";
import {DateContainer} from "../Molekules/DateContainer";
import style from "./Event.module.css";
import 'dayjs/locale/de' // import locale

dayjs.locale('de') // use locale

export const Event = ({name, type, onlineEvent, country, zip, location, beginsAt, endsAt}: EventType) => {
    return <div className={style.wrapper}>
        <DateContainer {...{beginsAt, endsAt}} />
        <div className={style.eventData}>
            <Typography type={TypographyStyle.h3} text={name} />
            <Typography type={TypographyStyle.span} text={type.translation} />
            {onlineEvent && <Typography
                type={TypographyStyle.p}
                text={"online"}
                className={style.bold}
            />}
            {!onlineEvent &&
                <div className={style.locationWrapper}>
                    <Typography
                        type={TypographyStyle.span}
                        text={`${country}`}
                        className={style.country}
                    />
                    {" - "}
                    <Typography type={TypographyStyle.span} text={`${zip} ${location}`}/>
                </div>
            }
        </div>
    </div>
}