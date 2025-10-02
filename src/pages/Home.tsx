import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { productService, type PaginatedResponse } from "@/api/productService";
import { cartService } from "@/api/cartService";
import type { Product } from "@/models/Product";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { IconSearch } from "@tabler/icons-react";
import { Hero } from "@/components/Hero";
import ProductCard from "@/components/Product/Card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { PaginationButton } from "@/components/Pagination";
import { Categories } from "@/components/Categories/Categories";

export default function Home() {
  const categories = [
    { name: "Bosch", link: "/?q=Bosch&page=1" },
    { name: "Fiat", link: "/?q=Fiat&page=1" },
    { name: "Óleo", link: "/?q=Óleo&page=1" },
    { name: "Filtro", link: "/?q=Filtro&page=1" },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<PaginatedResponse<Product>["meta"]>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [addingProductIds, setAddingProductIds] = useState<
    Record<string, true>
  >({});

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setHasNewItem } = useCart();

  const pageParam = Number(searchParams.get("page"));
  const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
  const query = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let result: PaginatedResponse<Product>;
        if (query) {
          result = await productService.search(query);
        } else {
          result = await productService.list(page);
        }
        setProducts(result.data);
        setMeta(result.meta);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
        setProducts([]);
        setMeta(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    const params: Record<string, string> = { page: newPage.toString() };
    if (query) params.q = query;
    setSearchParams(params);
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setAddingProductIds((prev) => ({ ...prev, [productId]: true }));

    try {
      await cartService.addItem({ productId, quantity: 1 });
      setHasNewItem(true);
      toast.success("Adicionado ao carrinho");
    } catch (err) {
      console.error("Erro ao adicionar item ao carrinho", err);

      toast.error("Não foi possível adicionar este produto ao carrinho.");
    } finally {
      setAddingProductIds((prev) => {
        const nextState = { ...prev };
        delete nextState[productId];
        return nextState;
      });
    }
  };

  const productCountLabel = useMemo(() => {
    if (loading) return "";
    if (!meta) return "";
    const { page: currentPage = 1, totalPages = 1 } = meta;
    return `Página ${currentPage} de ${totalPages}`;
  }, [loading, meta]);

  return (
    <>
      <Hero
        image={{
          src: "https://images.pexels.com/photos/315938/pexels-photo-315938.jpeg",
          alt: "",
        }}
      />

      <div className='bg-blue-900'>
        <Container>
          <Categories items={categories} />
        </Container>
      </div>

      <Container>
        <form onSubmit={handleSearch} className='flex items-center my-8  z-50'>
          <Input
            type='text'
            name='q'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Buscar por peça, modelo, carro, placa...'
            className='px-8 h-20 rounded-l-full bg-gray-50 shadow border border-gray-200
               focus:outline-none focus:border-gray-300 focus:ring-0 focus:ring-transparent focus:ring-offset-0 text-xl'
          />
          <Button
            type='submit'
            className='px-12 h-20 py-6 rounded-l-none rounded-r-full cursor-pointer  bg-blue-500 hover:bg-blue-600 shadow outline-none focus:outline-none active:outline-none w-1/4 flex items-center'
          >
            <IconSearch className='mr-1 text-2xl' />

            <span className='hidden md:block text-xl font-mono  uppercase'>
              Buscar
            </span>
          </Button>
        </form>

        <div className='mx-auto p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-white'>
              {query
                ? `Buscando por: ${query}`
                : "Encontre as melhores auto peças"}
            </h2>
            {productCountLabel && (
              <span className='tracking-widest font-mono text-center px-4 whitespace-nowrap text-white text-sm'>
                {productCountLabel}
              </span>
            )}
          </div>

          {loading && (
            <div className='grid grid-cols-3 gap-8'>
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className='h-[125px] w-full rounded-xl' />
              ))}
            </div>
          )}
          {!loading && products.length === 0 && (
            <p className='text-center py-10 text-white text-xl'>
              {query
                ? "Nenhum produto encontrado para sua busca."
                : "Não há produtos nesta página."}
            </p>
          )}
          {!loading && products.length > 0 && (
            <ul className='grid grid-cols-3 gap-8'>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                  isAdding={addingProductIds[product.id] === true}
                />
              ))}
            </ul>
          )}

          {!loading && meta && meta.totalPages > 1 && (
            <div className='flex gap-2 mt-4'>
              {page > 1 && (
                <PaginationButton onClick={() => handlePageChange(page - 1)}>
                  Anterior
                </PaginationButton>
              )}

              {page < meta.totalPages && (
                <PaginationButton onClick={() => handlePageChange(page + 1)}>
                  Próxima
                </PaginationButton>
              )}
            </div>
          )}
        </div>
      </Container>
      <Container className='bg-gray-800'>
        <div>hi</div>
      </Container>
    </>
  );
}
