import React, { useContext } from 'react'
import './NavBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore, faBullseye, faStar } from '@fortawesome/free-solid-svg-icons'



export default function NavBar({ setTypeFilter, selectedType }) {

    function handleTypeChanged(type) {
        if (type == selectedType) {
            setTypeFilter()
        } else {
            setTypeFilter(type);
        }
    };

    return (
        <nav>
            <div className='middle'>
                <div className={selectedType == 'spot' ? 'spot active' : 'spot'}
                    onClick={() => { handleTypeChanged('spot') }}
                    value='spot'>
                    <FontAwesomeIcon className='spot-icon' icon={faBullseye} />
                    <div>Spots</div>
                </div>
                <div className={selectedType == 'park' ? 'park active' : 'park'}
                    onClick={() => { handleTypeChanged('park') }}
                    value='park'>
                    <FontAwesomeIcon icon={faStar} />
                    <div>
                        Parks
                    </div>
                </div>
                <div className={selectedType == 'shop' ? 'shop active' : 'shop'}
                    onClick={() => { handleTypeChanged('shop') }}
                    value='shop'>
                    <FontAwesomeIcon icon={faStore} />
                    <div>Shops</div>
                </div>

            </div>


        </nav>
    )
}
