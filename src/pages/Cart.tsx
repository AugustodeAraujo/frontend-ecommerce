import { useEffect, useMemo, useState } from "react";
import { cartService } from "@/api/cartService";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CartItem } from "@/models/CartItem";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.list();
      setItems(data);
      const nextQuantities = data.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
      setQuantities(nextQuantities);
    } catch (err) {
      console.error("Erro ao carregar carrinho", err);
      setError("Não foi possível carregar seu carrinho. Tente novamente.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items]);

  const handleQuantityChange = (itemId: string, rawValue: number) => {
    if (Number.isNaN(rawValue)) return;
    const sanitized = Math.max(1, Math.floor(rawValue));
    setQuantities((prev) => ({ ...prev, [itemId]: sanitized }));
  };

  const syncQuantity = async (itemId: string, desiredQuantity: number) => {
    const desired = Math.max(1, Math.floor(desiredQuantity));
    const current = items.find((item) => item.id === itemId)?.quantity;

    if (!current || desired === current) {
      setQuantities((prev) => ({ ...prev, [itemId]: current ?? 1 }));
      return;
    }

    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    setError(null);
    try {
      const updated = await cartService.updateItem(itemId, { quantity: desired });
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, ...updated } : item))
      );
      setQuantities((prev) => ({ ...prev, [itemId]: updated.quantity }));
    } catch (err) {
      console.error("Erro ao atualizar item do carrinho", err);
      setError("Não foi possível atualizar a quantidade. Tente novamente.");
      setQuantities((prev) => ({ ...prev, [itemId]: current ?? 1 }));
    } finally {
      setUpdatingItems((prev) => {
        const nextState = { ...prev };
        delete nextState[itemId];
        return nextState;
      });
    }
  };

  const handleIncrement = async (itemId: string) => {
    const current = quantities[itemId] ?? items.find((item) => item.id === itemId)?.quantity ?? 1;
    const next = current + 1;
    setQuantities((prev) => ({ ...prev, [itemId]: next }));
    await syncQuantity(itemId, next);
  };

  const handleDecrement = async (itemId: string) => {
    const current = quantities[itemId] ?? items.find((item) => item.id === itemId)?.quantity ?? 1;
    const next = Math.max(1, current - 1);
    if (next === current) return;
    setQuantities((prev) => ({ ...prev, [itemId]: next }));
    await syncQuantity(itemId, next);
  };

  const handleRemove = async (itemId: string) => {
    setRemovingItems((prev) => ({ ...prev, [itemId]: true }));
    setError(null);
    try {
      await cartService.removeItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setQuantities((prev) => {
        const nextState = { ...prev };
        delete nextState[itemId];
        return nextState;
      });
    } catch (err) {
      console.error("Erro ao remover item do carrinho", err);
      setError("Não foi possível remover o item. Tente novamente.");
    } finally {
      setRemovingItems((prev) => {
        const nextState = { ...prev };
        delete nextState[itemId];
        return nextState;
      });
    }
  };

  const handleManualUpdate = async (itemId: string, desiredQuantity: number) => {
    await syncQuantity(itemId, desiredQuantity);
  };

  return (
    <Container>
      <div className='mx-auto max-w-4xl py-8'>
        <h1 className='text-2xl font-bold mb-6'>Meu carrinho</h1>

        {error && (
          <div className='mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700'>
            {error}
          </div>
        )}

        {loading && <div>Carregando itens...</div>}

        {!loading && items.length === 0 && !error && (
          <div className='rounded border border-dashed p-6 text-center text-gray-600'>
            Seu carrinho está vazio.
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className='space-y-6'>
            <ul className='space-y-4'>
              {items.map((item) => {
                const isUpdating = !!updatingItems[item.id];
                const isRemoving = !!removingItems[item.id];
                const quantityValue = quantities[item.id] ?? item.quantity;
                const lineTotal = item.product.price * item.quantity;

                return (
                  <li
                    key={item.id}
                    className='flex flex-col gap-4 rounded-lg border p-4 shadow-sm md:flex-row md:items-center md:justify-between'
                  >
                    <div>
                      <h2 className='text-lg font-semibold'>{item.product.name}</h2>
                      <p className='text-sm text-gray-600'>{item.product.code}</p>
                      <p className='text-sm text-gray-600'>
                        Valor unitário: {currencyFormatter.format(item.product.price)}
                      </p>
                      <p className='text-sm font-semibold text-gray-900'>
                        Total: {currencyFormatter.format(lineTotal)}
                      </p>
                    </div>
                    <div className='flex flex-col gap-3 md:items-end'>
                      <div className='flex items-center gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => void handleDecrement(item.id)}
                          disabled={isUpdating || isRemoving || quantityValue <= 1}
                        >
                          -
                        </Button>
                        <Input
                          className='w-20 text-center'
                          type='number'
                          min={1}
                          value={quantityValue}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          onBlur={(e) => void handleManualUpdate(item.id, Number(e.target.value))}
                          disabled={isUpdating || isRemoving}
                        />
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => void handleIncrement(item.id)}
                          disabled={isUpdating || isRemoving}
                        >
                          +
                        </Button>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => void handleManualUpdate(item.id, quantityValue)}
                          disabled={isUpdating || isRemoving}
                        >
                          Atualizar
                        </Button>
                        <Button
                          type='button'
                          variant='destructive'
                          onClick={() => void handleRemove(item.id)}
                          disabled={isRemoving || isUpdating}
                        >
                          {isRemoving ? "Removendo..." : "Remover"}
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className='flex items-center justify-between rounded-lg border bg-gray-50 p-4'>
              <span className='text-lg font-semibold'>Subtotal</span>
              <span className='text-xl font-bold'>
                {currencyFormatter.format(subtotal)}
              </span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className='mt-4'>
            <Button variant='outline' onClick={() => void loadCart()}>
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
