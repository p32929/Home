import { Download, Home, Plus, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMenuButtons } from "@/lib/Models";
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
                controller.setState({
                    exportText: JSON.stringify(states.urls, null, 4)
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
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span className="hidden font-bold sm:inline-block">
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