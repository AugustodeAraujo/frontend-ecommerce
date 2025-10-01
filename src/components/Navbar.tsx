import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconShoppingCart } from "@tabler/icons-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className='w-full flex justify-between p-4 bg-slate-800'>
      <Link to='/' className='font-bold text-white'>
        Mini e-commerce
      </Link>
      {user ? (
        <div className='flex gap-4 items-center'>
          <span className=' font-semibold text-white'>Olá, {user.name}</span>
          <Link to='/cart' className='relative'>
            <IconShoppingCart className='text-white' />
          </Link>
          <button
            onClick={handleLogout}
            className='text-red-600 text-xs py-1 px-2'
          >
            Sair
          </button>
        </div>
      ) : (
        <Link to='/login' className='text-white bg-blue-500 px-2 py-1 rounded'>
          Entrar
        </Link>
      )}
    </nav>
  );
}
