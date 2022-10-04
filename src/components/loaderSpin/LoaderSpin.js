import React from 'react'
import './LoaderSpin.css'

export default function LoaderSpin() {
    return (
        <div className="loader-spin-root">
            <div className='blank-space'></div>
            <div className="circle">
            </div>
            <div className='map-loading'>Loading Map...</div>
            <div className='logo'>chuck
                <span className='dot'>.</span>
                <span className='spot-logo'>Spot</span>
            </div>

        </div>
    )
}

