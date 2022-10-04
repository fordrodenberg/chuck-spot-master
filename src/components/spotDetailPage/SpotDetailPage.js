import React, { useContext, useEffect, useState } from 'react'
import './SpotDetailPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faStore as shopIcon, faBullseye as spotIcon, faStar as parkIcon } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal/Modal'
import { useBoolean } from '../../hooks/UseBoolean';
import { UserContext } from '../../App';
import { v4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


export default function ({ handleExitClicked, name, description, location, type, images, createdBy, id, onSpotDeleted, onSpotEdited, imageIds, imagesUpload, setImagesUpload, imageUrls, setImageUrls }) {

    const { activeUser } = useContext(UserContext);
    const newId = v4();
    function getIcon(type) {
        let icon;
        if (type == 'spot') {
            icon = spotIcon
        } else if (type == 'park') {
            icon = parkIcon
        } else if (type == 'shop') {
            icon = shopIcon
        }
        return icon
    }

    const markerRef = doc(db, "markers", id);

    const [isModalOpen, toggleIsModalOpen] = useBoolean(false);
    const [isEditModeOn, toggleIsEditModeOn] = useBoolean(false);
    const [formData, setFormData] = useState({
        name: name,
        description: description,
        imageIds: [...imageIds] // do not add to this via the form. only add during upload
    });

    function displayModal() {
        toggleIsModalOpen(true);
    }

    function handleEditClicked() {
        toggleIsEditModeOn(true);
    }

    function handleInputChange(e) {
        let name = e.target.name;
        let value = e.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function updateSpot() {

        await setDoc(markerRef, {
            location, type, createdBy, id,
            imageIds: [...formData.imageIds],
            name: formData.name,
            description: formData.description,

        });

        for (let i = 0; i < imagesUpload.length; i++) {
            let imageId = formData.imageIds[i]
            uploadImage(imagesUpload[i], newId, id);
        }

        toggleIsEditModeOn();
        clearForm();
    }

    function handleCancelClicked() {
        toggleIsEditModeOn(false)
    }

    function handleImageUploadChange(e) {

        setImagesUpload([...imagesUpload, e.target.files[0]])
        setFormData((formData) => {
            return {
                ...formData,
                imageIds: [...formData.imageIds, newId]
            }
        });
    }

    function clearForm() {
        setImagesUpload([])
        // setFormData({
        //     ...formData,
        //     name: '',
        //     description: '',
        //     location: [position.lat, position.lng],
        //     type: 'spot',
        //     imageIds: [] // do not add to this via the form. only add during upload
        // })
    }

    function uploadImage(img, imageId, spotId) {

        const imageRef = ref(storage, `images/${spotId}/${imageId}`);
        uploadBytes(imageRef, img)
            .then((snapshot) => {
                // .then has to be here to actually make the promise resolve
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        console.log(url)
                        setImageUrls((prev) => [...prev, url])
                    });
            });
    }


    if (!isEditModeOn) {
        return (
            <div className='spot-detail-page-root'>

                <div className='header'>
                    <div className='left'>
                        <FontAwesomeIcon className='exit' icon={faArrowLeft} onClick={handleExitClicked} />
                        <h1>Spot Details</h1>
                    </div>
                    <div className='right'>
                        <div className='logo'>
                            chuck<span className='dot'>.</span><span className='title-spot'>Spot</span>
                        </div>

                    </div>
                </div>


                <div>
                    <div className='spot-details'>
                        <div className='name-type-flex'>
                            <h2 className='spot-name'>
                                {name}
                            </h2>
                            <div className='spot-type'>
                                <div className={type}>
                                    <FontAwesomeIcon icon={getIcon(`${type}`)} />

                                </div>
                            </div>
                        </div>
                        <p className='spot-description'>
                            {description}
                        </p>

                        <div className='spot-location-parent'>
                            <h3>Location:</h3>
                            <div className='spot-coordinates'>
                                <div className='spot-lat'>
                                    <h4>Latitude:</h4>
                                    <div>
                                        {location[0]}
                                    </div>
                                </div>

                                <div className='spot-long'>
                                    <h4>Longitude:</h4>
                                    <div>
                                        {location[1]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='image-container'>
                        <div className='image'>
                            {images}
                        </div>
                    </div>
                </div>

                {activeUser?.uid == createdBy &&
                    <div className='buttons'>
                        <button className='delete' onClick={displayModal}>Delete</button>

                        <button className='edit' onClick={handleEditClicked}>Edit</button>
                    </div>}

                {isModalOpen && (
                    < Modal
                        isModalOpen={isModalOpen}
                        toggleIsModalOpen={toggleIsModalOpen}
                        id={id}
                        onSpotDeleted={onSpotDeleted}
                    />
                )}
            </div>
        )
    } else if (isEditModeOn) {
        return (

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateSpot();
                    onSpotEdited && onSpotEdited();
                }}>
                <div className='spot-detail-page-root '>
                    <div className='header'>

                        <div className='left'>
                            <FontAwesomeIcon
                                className='exit'
                                icon={faArrowLeft}
                                onClick={handleExitClicked} />
                            <h1>Spot Details</h1>
                        </div>

                        <div className='right'>
                            <div className='logo'>
                                chuck<span className='dot'>.</span><span className='title-spot'>Spot</span>
                            </div>
                        </div>
                    </div>
                    <div className='editable'>
                        <div className='name-type-flex'>
                            <div>
                                <label>Name:</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder='Addlestone Double Set'
                                    required
                                    id='name'
                                />
                            </div>

                            <div className='spot-type'>
                                <div className={type}>
                                    <FontAwesomeIcon icon={getIcon(`${type}`)} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label>Description:</label>
                            <textarea
                                type='text'
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                placeholder='6 stair with handrail, gap, ledges, etc'
                                id='description' />
                        </div>

                        <div className='spot-location-edit'>
                            <h3>Location:</h3>
                            <div className='spot-coordinates'>
                                <div className='spot-lat'>
                                    <h4>Latitude:</h4>
                                    <div>
                                        {location[0]}
                                    </div>
                                </div>

                                <div className='spot-long'>
                                    <h4>Longitude:</h4>
                                    <div>
                                        {location[1]}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {images}
                        </div>

                        <div>
                            <input
                                type='file'
                                multiple
                                onChange={handleImageUploadChange}
                            />
                        </div>

                        <div className='buttons'>
                            <button onClick={handleCancelClicked} className='cancel'>Cancel</button>

                            <button className='submit' type='submit'>Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}
