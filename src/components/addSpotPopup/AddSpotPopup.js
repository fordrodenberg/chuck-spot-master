import React, { useContext, useState } from 'react'
import { Popup, useMapEvents } from 'react-leaflet'
import { MapContext, UserContext } from '../../App';
import { useBoolean } from '../../hooks/UseBoolean';
import NewSpotForm from '../newSpotForm/NewSpotForm';
import SideMenu from '../sideMenu/SideMenu';
import './AddSpotPopup.css'

export default function AddSpotPopup({ onNewSpotAdded, imagesUpload, setImagesUpload }) {

    const [position, setPosition] = useState(null);
    const [isSideMenuOpen, toggleIsSideMenuOpen] = useBoolean(false);
    const { isMapDisabled, disableMap, enableMap } = useContext(MapContext);
    const { activeUser } = useContext(UserContext);

    const map = useMapEvents({
        click(e) {

            if (isSideMenuOpen) {
                return
            }
            if (isMapDisabled && !isSideMenuOpen) {
                enableMap();
                return
            }

            // is enabled / nothing open
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
            disableMap();

        },
        locationfound(e) {
        },
    });

    function handleAddSpotClicked() {
        toggleIsSideMenuOpen();

    }
    function handleCancelClicked() {
        toggleIsSideMenuOpen();
        enableMap();

    }

    if (position === null) {
        return null
    }
    else if (!activeUser) {
        return (
            <div className='logged-out-message'>
                <Popup position={position}>
                    <p className='message'>Login to create a spot</p>
                </Popup>
            </div>
        )

    } else {
        return (
            <div>
                <Popup position={position} >
                    <button className='add-spot' onClick={handleAddSpotClicked}> + New Spot</button>
                </Popup >

                <SideMenu isOpen={isSideMenuOpen}
                    toggleOpen={toggleIsSideMenuOpen}
                >
                    <NewSpotForm
                        onSubmit={() => {
                            toggleIsSideMenuOpen();
                            onNewSpotAdded && onNewSpotAdded()
                        }}
                        handleCancelClicked={handleCancelClicked}
                        position={position}
                        imagesUpload={imagesUpload}
                        setImagesUpload={setImagesUpload} />
                </SideMenu>

            </div>
        )
    }
}