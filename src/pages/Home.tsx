import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productService, type PaginatedResponse } from "@/api/productService";
import type { Product } from "@/models/Product";
import { Container } from "@/components/Container";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { IconSearch } from "@tabler/icons-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<PaginatedResponse<Product>["meta"]>();
  const [searchParams, setSearchParams] = useSearchParams();

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

  return (
    <>
      <h1 className='text-center text-2xl font-bold my-8'>Mini E-commerce</h1>
      <Container>
        <form onSubmit={handleSearch} className='mb-4 flex s '>
          <Input
            type='text'
            name='q'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Buscar produto...'
            className='border px-8 py-10 rounded-l-full'
          />
          <Button type='submit' className='px-20 py-10  rounded-r-full'>
            <IconSearch /> Buscar
          </Button>
        </form>
      </Container>
      <div className='mx-auto  p-4'>
        <h1 className='text-xl font-bold mb-4'>Produtos</h1>

        {/* Lista */}
        {loading && <div>Carregando...</div>}
        {!loading && products.length === 0 && (
          <p>
            {query
              ? "Nenhum produto encontrado para sua busca."
              : "Não há produtos nesta página."}
          </p>
        )}
        {!loading && products.length > 0 && (
          <ul>
            {products.map((p) => (
              <li key={p.id} className='border-b py-2'>
                <strong>{p.name}</strong> - R$ {p.price}
                <br />
                <span className='text-sm text-gray-600'>{p.code}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Paginação */}
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
