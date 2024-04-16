import React from 'react'
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { IMenuButtons, IUrlButton, IUrlContextMenuButtons } from '@/lib/Models';
import { Circle, Pencil, Trash } from 'lucide-react';
import { getHostFromURL, getImgUrl } from '@/lib/utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ImgOrIcon from '@/components/custom/ImgOrIcon';

interface Props {

}

const UrlList: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);

    const menuButtons: IUrlContextMenuButtons[] = [
        {
            title: 'Edit',
            onClick: (param: number) => {
                console.log(`edit param`, param)
                controller.setState({
                    editingUrlIndex: param,
                })
            }
        },
        {
            title: 'Delete',
            onClick: (param: number) => {
                console.log(`delete param`, param)
                controller.deleteUrl(param)
            }
        },
        {
            title: 'Change Icon',
            onClick: (param: number, item: any) => {
                console.log(`ci item`, item)
                console.log(`ci param`, param)
                controller.setState({
                    changingIconUrl: item,
                })
            }
        },
    ]

    const getUrls = () => {
        function sortUrlButtonsAlphabetically(urls: IUrlButton[]): IUrlButton[] {
            const copiedButtons = urls.slice(); // Create a shallow copy
            return copiedButtons.sort((a, b) => {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();

                if (titleA < titleB) {
                    return -1;
                } else if (titleA > titleB) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }

        function sortUrlButtonsByClicksDescending(buttons: IUrlButton[]): IUrlButton[] {
            const sortedButtons = buttons.slice(); // Create a shallow copy
            sortedButtons.sort((a, b) => {
                return (b?.clicks ?? 0) - (a.clicks ?? 0);
            });
            return sortedButtons;
        }

        const sortOption = states.data.sortOption
        switch (sortOption) {
            case 'Creation':
                return states.data.urls
            case 'Name':
                return sortUrlButtonsAlphabetically(states.data.urls);
            case 'Clicks':
                return sortUrlButtonsByClicksDescending(states.data.urls)
        }
    }

    function findUrlIndex(targetUrl: string): number {
        for (let i = 0; i < states.data.urls.length; i++) {
            if (states.data.urls[i].link === targetUrl) {
                return i; // Return the index if URL is found
            }
        }
        return -1; // Return -1 if URL is not found
    }

    const onUrlClicked = (link: string) => {
        const index = findUrlIndex(link)
        console.log(`UrlList.tsx :: onUrlClicked :: index -> ${index} `)
        controller.increaseClick(index)
    }

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
                    getUrls().map((urlItem, urlIndex) => {
                        return <ContextMenu key={urlIndex}>
                            <ContextMenuTrigger>
                                <a className="w-full" href={urlItem.link} onClick={() => { onUrlClicked(urlItem.link) }}>
                                    <Button className="w-full justify-start" variant="outline">
                                        <ImgOrIcon imgUrl={getImgUrl(urlItem)} />
                                        {urlItem.title}
                                    </Button>
                                </a>
                            </ContextMenuTrigger>

                            <ContextMenuContent className="w-10">
                                {
                                    menuButtons.map((item, index) => {
                                        return <ContextMenuItem key={index} onClick={() => {
                                            item.onClick(urlIndex, urlItem)
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