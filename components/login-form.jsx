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

export function LoginForm({
  className,
  ...props
}) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("From data:", formData);

    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password
    });

    if (res?.ok) {
      toast.success("Ha ingresado correctamente")
      router.push("/dashboard")
    } else {
      toast.error("Credenciales invalidas")
    }

    setLoading(false);
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="grid gap-6">
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
                  {loading ? "Ingresando..." : "Ingresar"}
                </Button>
              </div>
              <div className="text-center text-sm">
                No tienes una cuenta?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Registrate
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
