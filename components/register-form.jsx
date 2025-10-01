"use client";


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

export function RegisterForm({
    className,
    ...props
}) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            // Step 1
            const registerRes = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
                {
                    username: formData.email,
                    email: formData.email,
                    password: formData.password,
                }
            );

            const jwt = registerRes.data.jwt;
            const userId = registerRes.data.user.id;

            //Paso 2
            await axios.put(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            //Paso 3
            const res = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password
            });

            if (!res?.error) {
                router.replace("/dashboard");
            } else {
                toast.error("Error al iniciar sesion, intente iniciar sesion manualmente.");
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.error?.message || "Error al registrar el usuario");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Nuevo Usuario</CardTitle>
                    <CardDescription>
                        Rellena los campos para registrarte.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="firstName">Nombre</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="ej. Juan"
                                        required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="lastName">Apellido</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="ej. Perez"
                                        required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Correo Electronico</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="m@example.com"
                                        required />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Contraseña</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type="password"
                                        required />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Registrando..." : "Registarse"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Ya tienes una cuenta?{" "}
                                <a href="/login" className="underline underline-offset-4">
                                    Accede
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
