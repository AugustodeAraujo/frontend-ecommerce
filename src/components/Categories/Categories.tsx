// src/components/Categories.tsx
import { Link } from "react-router-dom";

interface Category {
  name: string;
  link: string;
}

interface CategoriesProps {
  items: Category[];
}

export function Categories({ items }: CategoriesProps) {
  return (
    <ul className='flex flex-row justify-center divide-gray-50 py-10'>
      {items.map((item) => (
        <li
          key={item.link}
          className='text-white font-mono italic text-sm px-3'
        >
          <Link to={item.link}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}
