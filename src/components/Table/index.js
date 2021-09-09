import React from 'react';
import classes from './Table.module.css';
import numeral from 'numeral';

function Table({ countries }) {
    return (
        <div className={classes.table}>
            {countries.map(({ country, cases }) => (
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
