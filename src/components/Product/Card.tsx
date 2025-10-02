// components/Product/Card.tsx
import type { Product } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";

type ProductCardProps = Product & {
  onAddToCart?: (id: string) => void;
  isAdding?: boolean;
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  brand,
  code,
  vehicleCompatibility,
  onAddToCart,
  isAdding = false,
}: ProductCardProps) {
  return (
    <div className='flex flex-col  rounded-lg p-4 shadow gap-4 bg-gray-50'>
      <Skeleton className='h-[125px] w-full rounded-xl' />
      <div>
        <strong className='block text-lg'>
          {name}{" "}
          <span className='text-xs text-gray-500 font-light'>{brand}</span>{" "}
        </strong>
        <span className='text-sm text-gray-600 block mb-1 font-mono'>
          {code}
        </span>
        <span className='font-semibold'>R$ {price}</span>
        <p className='text-sm text-gray-500 my-2'>
          {description} Aplicações: {vehicleCompatibility}
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          onClick={() => onAddToCart?.(id)}
          disabled={isAdding}
          className='hover:scale-105 transition-transform cursor-pointer'
        >
          {isAdding ? "Adicionando..." : "Adicionar ao carrinho"}
        </Button>
      </div>
    </div>
  );
}
