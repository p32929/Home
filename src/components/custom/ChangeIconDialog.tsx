
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

const ChangeIconDialog: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IUrlButton>({
        // defaultValues: states.urls[states.editingUrlIndex]
        // values: states.data.urls[states.editingUrlIndex],
    })

    const onSubmit: SubmitHandler<IUrlButton> = (data) => {
        controller.editUrl(data,)
    }

    return (
        <Dialog open={states.changingIconUrl !== null} onOpenChange={(open) => {
            if (!open) {
                controller.setState({
                    changingIconUrl: null,
                })
            }
            reset()
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change icon</DialogTitle>
                    <DialogDescription>
                        Enter an icon/image URL or a color code
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Icon
                            </Label>
                            <Input
                                {...register("icon", { required: true, maxLength: 20, })}
                                className={cn("col-span-3", errors.title ? "focus-visible:ring-red-500" : "")}
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

export default ChangeIconDialog;