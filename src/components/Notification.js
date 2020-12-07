import React from 'react'

const Notification = ({ message, style }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={style ? 'notification' : 'error'}>
            {message}
        </div>
    )
}

export default Notification