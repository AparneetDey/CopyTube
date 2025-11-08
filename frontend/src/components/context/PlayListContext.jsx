import React, { createContext, useContext, useState } from 'react'

const PlayListContext = createContext()

export const PlayListProvider = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [videoData, setVideoData] = useState({});

    const handleOpenPlayList = (id, title) => {
        const video = {
            id,
            title
        }

        setVideoData(video);
        setIsOpen(true)
    }
    
    const handleClosePlayList = () => {
        setIsOpen(false);
        setVideoData(false);
    }

    const value = {
        isOpen,
        setIsOpen,
        videoData,
        setVideoData,
        handleOpenPlayList,
        handleClosePlayList
    }

    return (
        <PlayListContext.Provider value={value}>
            {children}
        </PlayListContext.Provider>
    )
}

export const usePlayList = () => useContext(PlayListContext);