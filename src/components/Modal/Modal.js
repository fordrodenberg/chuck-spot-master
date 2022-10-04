import React, { useContext, useRef } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from "../../firebase-config";
import './modal.css'


export default function Modal({ isModalOpen, toggleIsModalOpen, id, onSpotDeleted }) {

    const markerRef = doc(db, "markers", id)

    function handleCloseClicked() {
        toggleIsModalOpen && toggleIsModalOpen();
    }

    async function deleteSpotById() {
        deleteDoc(markerRef)
            .then(() => {
                console.log('document deleted successfully')
            })
            .catch(error => {
                console.log(error)
            })
        toggleIsModalOpen && toggleIsModalOpen()
    }

    return (
        <div className={`modal-root ${isModalOpen ? 'visible' : 'hidden'}`}>
            <div className='modal'>

                <h2>
                    Delete Marker
                </h2>

                <p>
                    Are you sure you would like to delete this marker?
                </p>

                <div className='buttons'>
                    <button
                        className='go-back'
                        onClick={handleCloseClicked}
                    >
                        Go Back!
                    </button>

                    <button
                        className='delete'
                        onClick={() => {
                            deleteSpotById(id)
                            onSpotDeleted && onSpotDeleted()
                        }}>
                        DELETE
                    </button>
                </div>

            </div>
        </div >
    )
}
