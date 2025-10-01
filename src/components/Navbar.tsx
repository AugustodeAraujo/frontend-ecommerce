import { useAuth } from "../context/AuthContext";
import { IconShoppingCart } from "@tabler/icons-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className='w-full flex justify-between p-4 bg-slate-800'>
      <span className='font-bold text-white'>Mini E-commerce</span>
      {user ? (
        <div className='flex gap-4 items-center'>
          <span className=' font-semibold text-white'>Olá, {user.name}</span>
          <span>
            <IconShoppingCart className='text-white' />
          </span>
          <button onClick={logout} className='text-red-600 text-xs py-1 px-2'>
            Sair
          </button>
        </div>
      ) : (
        <a href='/login' className='text-white bg-blue-500 px-2 py-1 rounded'>
          Entrar
        </a>
      )}
    </nav>
  );
}
