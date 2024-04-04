import { LucideIcon } from "lucide-react"

export interface IMenuButtons {
    icon: LucideIcon
    title: string
    onClick: (param?: any) => void
}

export interface IUrlButton {
    title: string
    link: string
    colors: string[]
}