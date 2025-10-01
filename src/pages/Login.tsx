import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../schemas/loginSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    setErrorMessage(null); // limpa erro anterior
    try {
      await login(data.email, data.password);
      navigate("/"); // redireciona ao logar
    } catch (err) {
      setErrorMessage("Email ou senha inválidos."); // msg simples (ou pode vir da API)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='p-4 max-w-sm mx-auto flex flex-col gap-3'
    >
      <div>
        <input
          type='email'
          placeholder='Email'
          {...register("email")}
          className='border p-2 w-full'
        />
        {errors.email && (
          <p className='text-red-500 text-sm'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          type='password'
          placeholder='Senha'
          {...register("password")}
          className='border p-2 w-full'
        />
        {errors.password && (
          <p className='text-red-500 text-sm'>{errors.password.message}</p>
        )}
      </div>

      {/* erro da API */}
      {errorMessage && <p className='text-red-600 text-sm'>{errorMessage}</p>}

      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-blue-500 text-white p-2 disabled:opacity-50'
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
