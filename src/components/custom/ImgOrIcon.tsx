"use client"

import { controller } from '@/lib/StatesController';
import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';

interface Props {
    imgUrl: string
    icon?: string
}

const ImgOrIcon: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);
    const { icon, imgUrl } = props

    if (icon) {
        if (icon.startsWith("#")) {
            return <div className='w-4 h-4 rounded-sm mr-3' style={{ backgroundColor: 'red' }} />
        }
        else {
            return <div className='w-4 h-4 rounded-sm mr-3' style={{ backgroundColor: 'green' }} />
        }
    }
    else {
        return (
            <LazyLoadImage
                className='w-4 h-4 rounded-sm mr-3'
                src={imgUrl}
            />
        )
    }


}

export default ImgOrIcon;