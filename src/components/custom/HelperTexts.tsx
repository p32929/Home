import { Dot } from 'lucide-react'
import React from 'react'

interface Props {

}

const HelperTexts: React.FC<Props> = (props) => {

    const usages = [
        "Click to open the URL in the same tab",
        "CTRL + Click to openthe  URL in a new tab",
        "Right click on the URL to edit or delete"
    ]

    return (
        <div className='flex flex-col px-8 pt-2'>
            <h3 className="text-xl font-bold tracking-tight">
                How to use
            </h3>

            {
                usages.map((item, index) => {
                    return <p key={index} className="text-sm text-muted-foreground flex items-center">
                        <Dot /> {item}
                    </p>
                })
            }

        </div>
    )

}

export default HelperTexts;