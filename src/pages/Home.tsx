import { useEffect, useMemo, useState } from "react";
import {
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

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<PaginatedResponse<Product>["meta"]>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [addingProductIds, setAddingProductIds] = useState<Record<string, true>>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  useEffect(() => {
    if (!feedback && !actionError) return;
    const timeout = setTimeout(() => {
      setFeedback(null);
      setActionError(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [feedback, actionError]);

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

    setFeedback(null);
    setActionError(null);
    setAddingProductIds((prev) => ({ ...prev, [productId]: true }));

    try {
      await cartService.addItem({ productId, quantity: 1 });
      setFeedback("Produto adicionado ao carrinho.");
    } catch (err) {
      console.error("Erro ao adicionar item ao carrinho", err);
      setActionError("Não foi possível adicionar este produto ao carrinho.");
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
      <h1 className='text-center text-2xl font-bold my-8'>Mini E-commerce</h1>
      <Container>
        <form onSubmit={handleSearch} className='mb-4 flex'>
          <Input
            type='text'
            name='q'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Buscar produto...'
            className='border px-8 py-10 rounded-l-full'
          />
          <Button type='submit' className='px-20 py-10 rounded-r-full'>
            <IconSearch /> Buscar
          </Button>
        </form>
        {feedback && (
          <div className='mb-4 rounded bg-green-100 px-4 py-2 text-sm text-green-800'>
            {feedback}
          </div>
        )}
        {actionError && (
          <div className='mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700'>
            {actionError}
          </div>
        )}
      </Container>
      <div className='mx-auto p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>Produtos</h2>
          {productCountLabel && (
            <span className='text-sm text-gray-600'>{productCountLabel}</span>
          )}
        </div>

        {loading && <div>Carregando...</div>}
        {!loading && products.length === 0 && (
          <p>
            {query
              ? "Nenhum produto encontrado para sua busca."
              : "Não há produtos nesta página."}
          </p>
        )}
        {!loading && products.length > 0 && (
          <ul className='space-y-4'>
            {products.map((p) => (
              <li
                key={p.id}
                className='flex flex-col md:flex-row md:items-center md:justify-between border rounded-lg p-4 shadow-sm gap-4'
              >
                <div>
                  <strong className='block text-lg'>{p.name}</strong>
                  <span className='text-sm text-gray-600 block mb-1'>{p.code}</span>
                  <span className='font-semibold'>
                    {currencyFormatter.format(p.price)}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => handleAddToCart(p.id)}
                    disabled={addingProductIds[p.id] === true}
                  >
                    {addingProductIds[p.id] ? "Adicionando..." : "Adicionar ao carrinho"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && meta && meta.totalPages > 1 && (
          <div className='flex gap-2 mt-4'>
            {page > 1 && (
              <button
                onClick={() => handlePageChange(page - 1)}
                className='px-3 py-1 border bg-gray-200'
              >
                Anterior
              </button>
            )}
            {page < meta.totalPages && (
              <button
                onClick={() => handlePageChange(page + 1)}
                className='px-3 py-1 border bg-gray-200'
              >
                Próxima
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
