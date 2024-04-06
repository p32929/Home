import { Download, Home, Plus, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMenuButtons, IUrlButton } from "@/lib/Models";
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';

interface Props {

}

const Header: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);

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
            icon: Plus,
            title: 'Add',
            onClick: () => {
                controller.setState({
                    isAddDialogOpen: true,
                })
            }
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
                        {
                            menuButtons.map((item, index) => {
                                return <Button key={index} title={item.title} onClick={item.onClick} size='sm' variant="outline">
                                    <item.icon className='w-3 h-3' />
                                </Button>
                            })
                        }

                    </div>

                </div>
            </div>
        </header>
    )

}

export default Header;