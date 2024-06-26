
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IUrlButton } from "@/lib/Models";
import { useForm, SubmitHandler } from "react-hook-form"
import { controller } from '@/lib/StatesController';
import { useSelector } from 'react-redux';
import { cn, getImgUrl, isColorCodeOrLink } from "@/lib/utils";
import ImgOrIcon from "@/components/custom/ImgOrIcon";
import { useEffect, useState } from "react";


interface Props {

}

const ChangeIconDialog: React.FC<Props> = (props) => {
    const states = useSelector(() => controller.states);
    const [item, setItem] = useState<IUrlButton>()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IUrlButton>({
        values: item,
    })

    useEffect(() => {
        reset({ icon: '' })
        setItem(states.data.urls[states.changingIconUrlIndex])
    }, [states.changingIconUrlIndex])

    const onSubmit: SubmitHandler<IUrlButton> = (data) => {
        controller.editUrlIcon(data)
        reset({ icon: '' })
    }

    return (
        <Dialog open={states.changingIconUrlIndex !== -1} onOpenChange={(open) => {
            setItem(undefined)
            reset({ icon: '' })
            if (!open) {
                controller.setState({
                    changingIconUrlIndex: -1,
                })
            }
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change icon</DialogTitle>
                    <DialogDescription>
                        Enter an icon / image URL or a color code
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 py-4">
                        <Input
                            placeholder="Icon URL / Color code"
                            {...register("icon", {
                                required: false, onChange: (e) => {
                                    console.log(`etv`, e.target.value)
                                    const value = e.target.value

                                    if (isColorCodeOrLink(value)) {
                                        // @ts-ignore
                                        setItem({
                                            ...item,
                                            icon: value,
                                        })
                                    }

                                    return e
                                }
                            })}
                            className={cn("col-span-3", errors.icon ? "focus-visible:ring-red-500" : "")}
                        />

                        <Button type="button" className="w-full justify-start" variant="outline">
                            <ImgOrIcon imgUrl={getImgUrl(item)} icon={item?.icon} />
                            {item?.title}
                        </Button>
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