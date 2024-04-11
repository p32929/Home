
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form"
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import { Textarea } from "@/components/ui/textarea";
import { cn, setSavedData } from "@/lib/utils";


interface Props {

}

interface IImportValues {
    importText: string
}

const ImportDialog: React.FC<Props> = () => {
    const states = useSelector(() => controller.states);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IImportValues>()

    const onSubmit: SubmitHandler<IImportValues> = async (data) => {
        setSavedData(JSON.parse(data.importText))
        reset()
    }

    const validateJSON = (jsonString: string) => {
        try {
            const jsonData = JSON.parse(jsonString);
            if (Array.isArray(jsonData.urls)) {
                for (const item of jsonData.urls) {
                    if (!item.title || !item.link || item.title.length > 20) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    return (
        <Dialog open={states.isImportDialogOpen} onOpenChange={(open) => {
            controller.setState({
                isImportDialogOpen: open
            })
            reset()
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import URL</DialogTitle>
                    <DialogDescription>
                        Enter the JSON you want to import
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <Textarea {...register("importText", { required: true, validate: validateJSON })} className={cn("h-32", errors.importText ? "focus-visible:ring-red-500" : "")} />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ImportDialog;