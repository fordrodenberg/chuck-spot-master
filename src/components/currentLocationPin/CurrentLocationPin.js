import React, { useContext, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { MapContext } from '../../App';
import currentLocationIcon from '../../customMarkers/current-location.svg'
import L from 'leaflet'
import './CurrentLocationPin.css'
export default function CurrentLocationPin() {

    const { usersCurrentPosition, disableMap } = useContext(MapContext);

    function GetIcon() {
        return new L.Icon({
            iconUrl: currentLocationIcon,
            iconSize: 30
        })
    }
    return usersCurrentPosition === null ? null : (
        <div className='current-position-root'>
            <Marker position={usersCurrentPosition} icon={GetIcon()} eventHandlers={{
                click: (e) => {
                    disableMap()
                }
            }}>
                <Popup>
                    <div className='current-position-popup-text'>
                        You are here
                    </div>
                </Popup>
            </Marker>
        </div>
    )
}