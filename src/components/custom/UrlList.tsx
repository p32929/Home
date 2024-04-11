import React from 'react'
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { IMenuButtons, IUrlContextMenuButtons } from '@/lib/Models';
import { Pencil, Trash } from 'lucide-react';
import { getHostFromURL } from '@/lib/utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface Props {

}

const UrlList: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);

    const menuButtons: IUrlContextMenuButtons[] = [
        {
            icon: Pencil,
            title: 'Edit',
            onClick: (param: number) => {
                console.log(`edit`, param)
                controller.setState({
                    editingUrlIndex: param,
                })
            }
        },
        {
            icon: Trash,
            title: 'Delete',
            onClick: (param: number) => {
                controller.deleteUrl(param)
            }
        },
    ]

    return (
        <>
            {
                states.data.urls.length == 0 && (
                    < div className="px-8 py-6" >
                        <p className="text-xl font-semibold tracking-tight">
                            Add your first URL by clicking on the + button
                        </p>
                    </div>
                )
            }
            < div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2" >
                {
                    states.data.urls.map((item, urlIndex) => {
                        // const imgUrl = `https://sporting-ivory-emu.faviconkit.com/${getHostFromURL(item.link)}/64`
                        const imgUrl = `https://favicon.yandex.net/favicon/${getHostFromURL(item.link)}?size=32`

                        return <ContextMenu key={urlIndex}>
                            <ContextMenuTrigger>
                                <a className="w-full" href={item.link}>
                                    <Button className="w-full justify-start" variant="outline">
                                        <LazyLoadImage
                                            id={`image-${urlIndex}`}
                                            className='w-4 h-4 rounded-sm mr-3'
                                            src={imgUrl}
                                        />
                                        {item.title}
                                    </Button>
                                </a>
                            </ContextMenuTrigger>

                            <ContextMenuContent className="w-10">
                                {
                                    menuButtons.map((item, index) => {
                                        return <ContextMenuItem key={index} onClick={() => {
                                            item.onClick(urlIndex)
                                        }}>
                                            {item.title}
                                        </ContextMenuItem>
                                    })
                                }
                            </ContextMenuContent>
                        </ContextMenu>
                    })
                }
            </div >
        </>
    )

}

export default UrlList;