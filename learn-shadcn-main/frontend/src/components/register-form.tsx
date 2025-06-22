import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CiLogin } from "react-icons/ci"
import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import useDataStore from '@/store/dataStore';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
    const { updateAuthToken, updateUserEmail, updateUserName } = useDataStore();
    const [serverError, setServerError] = useState("")
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: unknown) => {
        try {
            setServerError("")
            const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || "Registration failed")
            }

            const result = await res.json()
            updateAuthToken(result?.token)
            updateUserEmail(result?.user?.email)
            updateUserName(result?.user?.name)
            console.log("User registered:", result)
            reset()
            toast('Registration successful!')
            navigate('/dashboard')
        } catch (err) {
            setServerError((err as Error).message)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Toaster />
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-muted-foreground text-balance">
                                    Register to start using our services
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" placeholder="Enter name" {...register("name")} />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Register"}
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <a href="/login" className="underline underline-offset-4">
                                    Sign in
                                </a>
                            </div>
                        </div>
                    </form>

                    <div className="bg-muted relative hidden md:block">
                        <CiLogin className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
                    </div>
                </CardContent>
            </Card>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
