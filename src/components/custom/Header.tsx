import { Download, Home, Plus, Share, Settings, User, ArrowDownWideNarrow, Mail, MessageSquare, PlusCircle, UserPlus, Cloud, CreditCard, Github, Keyboard, LifeBuoy, LogOut, Users, CalendarPlus, ArrowDownAZ, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMenuButtons, IUrlButton } from "@/lib/Models";
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";

interface Props {

}

const Header: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);

    const addButton: IMenuButtons = {
        icon: Plus,
        title: 'Add',
        onClick: () => {
            controller.setState({
                isAddDialogOpen: true,
            })
        }
    }

    const menuButtons: IMenuButtons[] = [
        {
            icon: Download,
            title: 'Import',
            onClick: () => {
                controller.setState({
                    isImportDialogOpen: true,
                })
            }
        },
        {
            icon: Share,
            title: 'Export',
            onClick: () => {
                const urls: IUrlButton[] = []
                for (var i = 0; i < states.urls.length; i++) {
                    urls.push({
                        link: states.urls[i].link,
                        title: states.urls[i].title,
                    })
                }
                controller.setState({
                    exportText: JSON.stringify(urls, null, 4)
                })
            }
        },
        {
            icon: ArrowDownWideNarrow,
            title: 'Sort',
            radios: [
                {
                    title: "Creation",
                    icon: CalendarPlus,
                },
                {
                    title: "Name",
                    icon: ArrowDownAZ,
                },
                {
                    title: "Clicks",
                    icon: MousePointerClick,
                }
            ]
        },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 w-full items-center px-6">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span className="font-bold sm:inline-block">
                            Home
                        </span>
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                        <Button title={addButton.title} onClick={addButton.onClick} size='sm' variant="outline">
                            <addButton.icon className='w-3 h-3' />
                        </Button>



                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button title={`Options`} size='sm' variant="outline">
                                    <Settings className='w-3 h-3' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuGroup>
                                    {
                                        menuButtons.map((item, index) => {
                                            if (item.radios && item.radios?.length > 0) {
                                                return <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        <span>{item.title}</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuRadioGroup value={item.radios[2].title} onValueChange={undefined}>
                                                                {
                                                                    item.radios.map((ritem, rindex) => {
                                                                        return <DropdownMenuRadioItem value={ritem.title}>
                                                                            <ritem.icon key={rindex} className="mr-2 h-4 w-4" />
                                                                            <span>{ritem.title}</span>
                                                                        </DropdownMenuRadioItem>
                                                                    })
                                                                }
                                                            </DropdownMenuRadioGroup>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                            }
                                            else {
                                                return <DropdownMenuItem key={index}>
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </DropdownMenuItem>
                                            }
                                        })
                                    }
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                </div>
            </div>
        </header>
    )

}

export default Header;