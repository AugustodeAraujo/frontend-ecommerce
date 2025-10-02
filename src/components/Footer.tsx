import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className='bg-gray-100 dark:bg-gray-900'>
      <div className='relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24'>
        <div className='lg:flex lg:items-end lg:justify-between'>
          <div>
            <p className='mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left dark:text-gray-400'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt
              consequuntur amet culpa cum itaque neque.
            </p>
          </div>

          <ul className='mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12'>
            <li>
              <Link
                className='text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75'
                to='/'
              >
                Produtos
              </Link>
            </li>

            <li>
              <Link
                className='text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75'
                to='/login'
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        <p className='mt-12 text-center text-sm text-gray-500 lg:text-right dark:text-gray-400'>
          Copyright &copy; 2022. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
