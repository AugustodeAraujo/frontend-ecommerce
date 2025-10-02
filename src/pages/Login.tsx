import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../schemas/loginSchema";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      setErrorMessage("Email ou senha inválidos.");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-black'>
      <Card className='w-full max-w-sm bg-gray-900 border border-gray-800 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold text-white'>
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email */}
            <div className='flex flex-col gap-1'>
              <Label htmlFor='email' className='text-gray-200'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='Digite seu email'
                {...register("email")}
                className='bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className='flex flex-col gap-1'>
              <Label htmlFor='password' className='text-gray-200'>
                Senha
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='Digite sua senha'
                {...register("password")}
                className='bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              />
              {errors.password && (
                <p className='text-red-500 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* erro da API */}
            {errorMessage && (
              <p className='text-red-600 text-sm'>{errorMessage}</p>
            )}

            {/* Botão */}
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white'
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Link de registro */}
          <p className='text-center text-sm text-gray-400 mt-4'>
            Não tem uma conta?{" "}
            <Link to='/register' className='text-blue-500 hover:underline'>
              Crie agora
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
