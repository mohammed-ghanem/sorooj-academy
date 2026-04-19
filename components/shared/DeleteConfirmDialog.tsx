"use client";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { CircleAlert, Trash2 } from "lucide-react";

type DeleteConfirmDialogProps = {
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    isLoading?: boolean;
};

export default function DeleteConfirmDialog({
    onConfirm,
    title,
    description,
    confirmText,
    cancelText,
    isLoading,
}: DeleteConfirmDialogProps) {
    return (
        <AlertDialog> 
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="cursor-pointer scoundBgColor text-white!">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <div className="flex items-center justify-center">
                    <CircleAlert className="h-20 w-20 scoundBgColor text-white!" />
                </div>
                <AlertDialogHeader className="text-center! my-4">
                    <AlertDialogTitle className="text-2xl font-bold">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="font-bold my-1.5">{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="justify-center! items-center! space-x-3 my-2">
                    <AlertDialogCancel 
                        className=" px-8 py-5 text-white hover:text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                        disabled={isLoading}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="scoundBgColor text-white! cursor-pointer px-8 py-5"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
