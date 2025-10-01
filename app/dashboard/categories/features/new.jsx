import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axios";

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional()
});

export const New = ({ item = null, onSuccess, isOpen }) => {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });

    useEffect(() => {
        if (!isOpen) return;
        if (item) {
            form.reset({
                name: item.name || "",
                description: item.description || "",
            });
        } else {
            form.reset({
                name: "",
                description: "",
            });
        }
    }, [item, isOpen]);

    async function onSubmit(values) {
        setLoading(true);

        if (item?.id) {
            await axiosInstance.put(`/api/categories/${item.documentId}`, {
                data: values,
            });
        } else {

            await axiosInstance.post('/api/categories', { data: values });
        }

        if (onSuccess) onSuccess();
        setLoading(false);
        toast.success("Categoría creada con éxito");
    }



    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>{item?.id ? "Editar" : "Agregar"} categoría</SheetTitle>
            </SheetHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-6">

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nombre de Categoría"

                                        type=""
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe la categoría a crear..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="text-white" disabled={loading}>
                        {/* {loading ? "Guardando..." : "Guardar Cambios"} */}
                        {loading ? "Guardando..." : item?.id ? "Editar" : "Agregar"}
                    </Button>
                </form>
            </Form>
        </SheetContent>
    )
}
