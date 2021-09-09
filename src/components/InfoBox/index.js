import React from 'react';
import classes from './InfoBox.module.css';
import { Card, CardContent, Typography } from "@material-ui/core"

function InfoBox({ title, cases, active, isRed, total, ...props }) {
    return (
        <Card
            onclick={props.onClick}
            className={`${classes.infoBox} ${active && classes['infoBox-selected']} ${isRed && classes['infoBox--red']}`}
        >
            <CardContent>
                {/* Title i.e. Coronavirus cases */}
                <Typography color="textSecondary" className={classes.infoBox__title}>{title}</Typography>

                {/* 23k Number of cases */}
                <h2 className={`${classes.infoBox__cases} ${!isRed && classes['infoBox__cases--green']}`}>{cases}</h2>

                {/* 150k Total */}
                <Typography color="textSecondary" className={classes.infoBox__total}>
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
