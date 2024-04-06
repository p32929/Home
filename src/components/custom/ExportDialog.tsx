
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IUrlButton } from "@/lib/Models";
import { useForm, SubmitHandler } from "react-hook-form"
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import { Textarea } from "@/components/ui/textarea";


interface Props {

}

const ExportDialog: React.FC<Props> = () => {
    const states = useSelector(() => controller.states);

    const {
        handleSubmit,
        reset,
    } = useForm<IUrlButton>({
        // defaultValues: states.urls[states.editingUrlIndex]
        // values: states.urls[states.editingUrlIndex],
    })

    const onSubmit: SubmitHandler<IUrlButton> = () => {
        controller.setState({
            exportText: ""
        })
        reset()
    }

    return (
        <Dialog open={states.exportText != ''} onOpenChange={(open) => {
            controller.setState({
                exportText: open ? states.exportText : ""
            })
            reset()
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export URLs</DialogTitle>
                    <DialogDescription>
                        Copy the JSON to import all the URLs later
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <Textarea className="h-32" value={states.exportText} />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Dismiss</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ExportDialog;