import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconShoppingCart, IconLogout2 } from "@tabler/icons-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { hasNewItem } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className='fixed w-10/12 bg-black/35 text-[#DEDCDD] lg:w-1/2 mx-auto left-0 right-0 z-50 flex justify-between items-center py-8 lg:py-6 px-7 text-sm uppercase backdrop-blur-2xl rounded-full shadow mt-4'>
        <div className=' text-sm tracking-widest font-mono text-center px-4 whitespace-nowrap text-white'>
          Mini e-commerce Co.
        </div>

        <div className='absolute left-1/2 -translate-x-1/2 text-sm tracking-widest font-mono text-center px-4 whitespace-nowrap font-black'>
          {user && (
            <div className='flex gap-4 items-center'>
              <span className=' font-semibold text-white'>
                Olá, {user.name}
              </span>
            </div>
          )}
        </div>

        {/* DIREITA */}
        <div className='hidden lg:flex gap-6 relative'>
          {user ? (
            <div className='flex gap-4 items-center'>
              <Link to='/cart' className='relative'>
                <IconShoppingCart className='text-white font-light hover:text-gray-100' />

                {hasNewItem && (
                  <span className='absolute -top-1 -right-1 w-2 h-2 bg-green-400 animate-ping rounded-full'></span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className='text-white text-xs py-1 px-2 cursor-pointer hover:text-red-300'
              >
                <IconLogout2 />
              </button>
            </div>
          ) : (
            <Link
              to='/login'
              className='text-white bg-blue-500 px-2 py-1 rounded'
            >
              Entrar
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
