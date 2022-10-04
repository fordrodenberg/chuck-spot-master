import React, { useContext, useEffect, useState } from 'react'
import './NewSpotForm.css'
import { collection, addDoc } from 'firebase/firestore'
import { getStorage } from "firebase/storage"
import { ref, uploadBytes } from 'firebase/storage';
import { db } from "../../firebase-config";
import { v4 } from 'uuid';
import { faStore, faBullseye, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UserContext } from '../../App'
import { storage } from '../../firebase-config'
export default function NewSpotForm({ position, handleCancelClicked, onSubmit, imagesUpload, setImagesUpload }) {

    const { activeUser } = useContext(UserContext)

    const markersCollectionRef = collection(db, "markers");

    const [formData, setFormData] = useState({
        name: '',
        createdBy: activeUser.uid,
        description: '',
        location: [position.lat, position.lng],
        type: 'spot',
        imageIds: [] // do not add to this via the form. only add during upload
    });

    function clearForm() {
        setImagesUpload([])
        setFormData({
            ...formData,
            name: '',
            description: '',
            location: [position.lat, position.lng],
            type: 'spot',
            imageIds: [] // do not add to this via the form. only add during upload
        })
    }

    function handleInputChange(e) {
        let name = e.target.name;
        let value = e.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function submitSpot() {

        // then upload the doc
        let spotDoc = await addDoc(markersCollectionRef, formData)

        // upload images and get "URLs" / ids for the images
        for (let i = 0; i < imagesUpload.length; i++) {
            let imageId = formData.imageIds[i]
            uploadImage(imagesUpload[i], imageId, spotDoc.id);
        }

        onSubmit && onSubmit();
        clearForm();
    }

    function uploadImage(img, imageId, spotId) {

        const imageRef = ref(storage, `images/${spotId}/${imageId}`);
        uploadBytes(imageRef, img)
            .then((snapshot) => {
                // .then has to be here to actually make the promise resolve

            });
    }

    function handleImageUploadChange(e) {
        let newId = v4();
        setImagesUpload([...imagesUpload, e.target.files[0]])
        setFormData((formData) => {
            return {
                ...formData,
                imageIds: [...formData.imageIds, newId]
            }
        });
    }

    // Displays uploaded image on newSpotForm
    useEffect(() => {
        // listAll(imagesListRef).then((response) => {
        //     response.items.forEach((item) => {
        //         getDownloadURL(item).then((url) => {
        //             setImageUrls((prev) => [...prev, url]);
        //         });
        //     });
        // });
    }, []);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            submitSpot();
        }}>
            <div className='new-spot-form-root'>
                <div className='header'>
                    <h1>Create a spot</h1>
                    <div className='logo'>
                        chuck<span className='dot'>.</span><span className='title-spot'>Spot</span>
                    </div>

                </div>

                <div className='form-data'>
                    {/* name */}
                    <div className='spot-name'>
                        <label htmlFor='name'>
                            Name:
                        </label>
                        <input

                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder='Addlestone Double Set'
                            id='name'
                        />
                    </div>

                    {/* description */}
                    <div>
                        <label htmlFor='description'>
                            Description:
                        </label>
                        <textarea
                            type='text'
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            required

                            placeholder='6 stair with handrail, gap, ledges, etc'
                            id='description'
                        />
                    </div>

                    {/* lat, long */}
                    <label className='location'>Location:</label>
                    <div className='location-root'>
                        <div className='lat-input'>
                            <label htmlFor='latitude'>Latitude:</label>
                            <input
                                type='number'
                                value={formData.location[0]}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        location: [e.target.value, formData.location[1]]
                                    })
                                }}
                                required
                                id='spotLatitude' />
                        </div>
                        <div className='long-input'>
                            <label htmlFor='longitude'>Longitude:</label>
                            <input
                                type='number' value={formData.location[1]}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        location: [formData.location[0], e.target.value]
                                    })
                                }}
                                required
                                id='spotLongitude' />
                        </div>
                    </div>

                    {/* type radio group */}
                    <div className='type-root'>
                        <legend htmlFor='spotType' className='type-label'>Type:</legend>
                        <div className='spot-type-container'>
                            <div className='spot'>
                                <input
                                    id="typeSpotOption"
                                    type='radio'
                                    name='type'
                                    value='spot'
                                    checked={formData.type === 'spot'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor='typeSpotOption'>
                                    <FontAwesomeIcon className='icon' icon={faBullseye} />
                                    <div>Spot</div>
                                </label>
                            </div>


                            <div className='park'>
                                <input

                                    id="typeParkOption"
                                    type='radio'
                                    name='type'
                                    value='park'
                                    checked={formData.type === 'park'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor='typeParkOption'>
                                    <FontAwesomeIcon className='icon' icon={faStar} />
                                    <div>Park</div>
                                </label>
                            </div>

                            <div className='shop'>
                                <input
                                    id="typeShopOption"
                                    type='radio'
                                    name='type'
                                    value='shop'
                                    checked={formData.type === 'shop'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor='typeShopOption'>
                                    <FontAwesomeIcon className='icon' icon={faStore} />
                                    <div>
                                        Shop
                                    </div>
                                </label>
                            </div>
                        </div>


                    </div>

                    {/* image upload */}
                    <div>
                        <input
                            type='file'
                            multiple
                            onChange={handleImageUploadChange} />
                    </div>
                </div>

                {/* cancel and submit buttons */}
                <div className='buttons'>
                    <button
                        type='button'
                        onClick={handleCancelClicked}
                        className='cancel'>
                        Cancel
                    </button>

                    <button
                        className='submit'
                        type='submit'>
                        Submit
                    </button>
                </div>
            </div>
        </form >
    )
}



// images/:spotId/:imageId