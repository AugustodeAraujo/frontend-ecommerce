import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className='w-full flex justify-between p-4 bg-slate-800'>
      <span className='font-bold text-white'>Mini E-commerce</span>
      {user ? (
        <div className='flex gap-4 items-center'>
          <span>Olá, {user.name}</span>
          <button onClick={logout} className='text-red-600'>
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
