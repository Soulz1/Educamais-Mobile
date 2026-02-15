import { useEffect, useState } from 'react';

/**
 * Hook para criar um valor com debounce
 * @param value - Valor a aplicar debounce
 * @param delay - Atraso em milissegundos (padrão: 500ms)
 * @returns Valor com debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timeout se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
