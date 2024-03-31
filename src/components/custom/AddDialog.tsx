
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

const AddDialog: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<IUrlButton>()
    const onSubmit: SubmitHandler<IUrlButton> = (data) => {
        controller.addUrl(data)
        reset()
    }

    return (
        <Dialog open={states.isAddDialogOpen} onOpenChange={(open) => {
            controller.setState({
                isAddDialogOpen: open,
            })
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add URL</DialogTitle>
                    <DialogDescription>
                        Add URLs one by one or use the import option
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Title
                            </Label>
                            <Input
                                {...register("title", { required: true, maxLength: 20, })}
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
                        <Button  type="submit">Save</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    )

}

export default AddDialog;