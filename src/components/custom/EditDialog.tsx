
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IUrlButton } from "@/lib/Models";
import { useForm, SubmitHandler } from "react-hook-form"
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import { cn } from "@/lib/utils";


interface Props {

}

const EditDialog: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IUrlButton>({
        // defaultValues: states.urls[states.editingUrlIndex]
        values: states.urls[states.editingUrlIndex],
    })

    const onSubmit: SubmitHandler<IUrlButton> = (data) => {
        controller.editUrl(data,)
    }

    return (
        <Dialog open={states.editingUrlIndex > -1} onOpenChange={(open) => {
            controller.setState({
                editingUrlIndex: open ? states.editingUrlIndex : -1
            })
            reset()
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit URL</DialogTitle>
                    <DialogDescription>
                        Edit the URL title or the link
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Title
                            </Label>
                            <Input
                                {...register("title", { required: true })}
                                className={cn("col-span-3", errors.title ? "focus-visible:ring-red-500" : "")}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                URL
                            </Label>
                            <Input
                                {...register("link", { required: true, pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i })}
                                className={cn("col-span-3", errors.link ? "focus-visible:ring-red-500" : "")}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditDialog;