import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import React, { useContext } from 'react'
import { UserContext } from '../../App'
import './ChuckSpotHeader.css'

export default function ChuckSpotHeader() {

    const { signInWithGoogle, activeUser, logout } = useContext(UserContext)

    return (
        <header>
            <div className='title'>
                chuck.<span>Spot</span>
            </div>

            <div className='login-parent'>
                {activeUser
                    ? (
                        <div className='active-user-parent'>
                            <button onClick={logout} className='logout'>
                                <FontAwesomeIcon icon={faRightToBracket} />
                            </button>
                        </ div>
                    )
                    :
                    <button className='login' onClick={signInWithGoogle}>
                        Login
                    </button>
                }

            </div>
        </header>
    )
}
