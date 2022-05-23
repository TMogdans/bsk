import React from 'react';
import {EventListType} from "../../Types/EventListType";
import {Typography} from "../Atoms/Typography";
import {TypographyStyle} from "../../Types/TypographyType";
import {Event} from "./Event";

export const EventList = ({heading, months}: EventListType) => {
    return <>
        <Typography type={TypographyStyle.h1} text={heading} />
        <div>
            {months && months.map((month, index) => {
                return <div key={index}>
                    <Typography type={TypographyStyle.h2} text={month.heading} key={`m${index}`} />
                    <div>
                        {month.events && month.events.map((event, eventIndex) => {
                            return <Event
                                {...event}
                                key={eventIndex}
                            />;
                        })}
                    </div>
                </div>
            })}
        </div>
    </>
}