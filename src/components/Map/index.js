import React from 'react';
import classes from './Map.module.css';
import { Map as LeafletMap, TitleLayer } from 'react-leaflet';
import { showDataOnMap } from '../../utils';

// npm i react-leaflet

function Map({ countries, casesType, center, zoom }) {
    return (
        <div className={classes.map}>
            <LeafletMap center={center} zoom={zoom}>
                <TitleLayer
                    url="https://{s}.title.openstreetmap.org/{z}/{x}/{y}"
                    attribution='&copy; <a href="http://osm.org/copyright"> OpnStreet Map</a>'
                />
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
