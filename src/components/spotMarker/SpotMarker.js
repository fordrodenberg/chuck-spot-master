import React, { useContext, useEffect, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import './SpotMarker.css'
import L from 'leaflet'
import spotIcon from '../../customMarkers/spot.svg'
import shopIcon from '../../customMarkers/shop.svg'
import parkIcon from '../../customMarkers/park.svg'
import { getDownloadURL, getStorage, list, ref } from 'firebase/storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartOutline } from '@fortawesome/free-regular-svg-icons';
import { useBoolean } from '../../hooks/UseBoolean'
import SideMenu from '../sideMenu/SideMenu'
import SpotDetailPage from '../spotDetailPage/SpotDetailPage'
import { MapContext } from '../../App'

export default function SpotMarker({ id, name, location, description, type, createdBy, onSpotDeleted, onSpotEdited, imagesUpload, setImagesUpload, imageIds }) {


    const [isSideMenuOpen, toggleIsSideMenuOpen] = useBoolean(false);

    const imagesRef = ref(getStorage(), 'images')
    const spotImagesRef = ref(imagesRef, id);
    const [isLiked, toggleLiked] = useBoolean();
    const [imageUrls, setImageUrls] = useState([]);
    const { disableMap } = useContext(MapContext);
    const images = imageUrls.map(img => <img width='125px' height='125px' src={img} />);

    useEffect(() => {
        if (imageUrls.length == 0) {
            getDocs()
        }
    }, [])

    function getDocs() {
        list(spotImagesRef)
            .then((response) => {
                response.items.forEach((item) => {
                    getDownloadURL(item).then((url) => {
                        setImageUrls((prev) => [...prev, url]);
                    });
                });
            });
    }

    function GetIcon(type) {
        let icon;
        if (type == 'shop') {
            icon = shopIcon
        } else if (type == 'spot') {
            icon = spotIcon
        } else if (type == 'park') {
            icon = parkIcon
        }

        return new L.Icon({
            iconUrl: icon,
            iconSize: 30

        })
    }

    function handleDetailsClicked() {
        toggleIsSideMenuOpen(true)
    }


    return (
        <>

            <Marker
                position={location}
                icon={GetIcon(type)}
                eventHandlers={{
                    click: (e) => {
                        disableMap();
                        // setMapPosition({ lat: location[0], lng: location[1] });
                    }
                }}>
                <Popup>
                    <div className='spot-popup-root'>
                        <h2 className='spot-name'>
                            {name}
                        </h2>
                        <div className='spot-description'>
                            {description}
                        </div>

                        <div className='images'>
                            {images}
                        </div>

                        <div className='buttons'>
                            <button onClick={handleDetailsClicked} className='more-info'>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </button>

                            <button className='heart' onClick={() => {
                                toggleLiked();
                            }}>
                                {isLiked
                                    ? <FontAwesomeIcon icon={faHeart} />
                                    : <FontAwesomeIcon icon={heartOutline} />}
                            </button>
                        </div>
                    </div>
                </Popup>
            </Marker >

            <SideMenu
                isOpen={isSideMenuOpen}
                toggleOpen={toggleIsSideMenuOpen}

            >
                <SpotDetailPage
                    id={id}
                    handleExitClicked={toggleIsSideMenuOpen}
                    name={name}
                    description={description}
                    location={location}
                    type={type}
                    createdBy={createdBy}
                    images={images}
                    imageIds={imageIds}
                    onSpotDeleted={onSpotDeleted}
                    onSpotEdited={onSpotEdited}
                    imagesUpload={imagesUpload}
                    setImagesUpload={setImagesUpload}
                    imageUrls={imageUrls}
                    setImageUrls={setImageUrls}
                />
            </SideMenu>
        </>

    )


}
