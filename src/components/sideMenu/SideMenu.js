import React, { useContext, useRef } from 'react'
import { useMapEvents } from 'react-leaflet';
import { MapContext } from '../../App'
import './SideMenu.css'

export default function SideMenu({ children, isOpen, toggleOpen }) {

    const { disableMap } = useContext(MapContext)

    if (isOpen) {
        disableMap();
    }
    return (
        <div className={`side-menu-root ${isOpen ? 'visible' : 'hidden'}`}>
            <div className="side-menu">
                {children}
            </div>
        </div>
    )
}
