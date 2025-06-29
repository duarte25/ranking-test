"use client";

import { handleErrorMessages } from "@/errors/handleErrorMessage";
import PaginationComponent from "./PaginationComponent";
import { fetchApi } from "@/api/services/fetchApi";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoading from "./SkeletonTable";
import React, { useState } from "react";

interface GetTableDataProps<T> {
  TableComponent: React.ComponentType<{ dados: T; onUpdate: () => void }>;
  fetchTag?: string;
  route: string;
}

export default function GetTableDataComponent<T>({
  TableComponent,
  fetchTag,
  route
}: GetTableDataProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Atualiza os parâmetros com a página atual
  const updatedQuerys = {
    pagina: currentPage, // Usa o estado interno da página
  };

  const { data, isFetching, isLoading, isError, refetch } = useQuery<T>({
    queryKey: [fetchTag || "defaultKey", updatedQuerys],
    queryFn: async () => {
      // Converte os parâmetros em uma query string
      const queryString = new URLSearchParams(updatedQuerys as unknown as Record<string, string>).toString();
      const apiUrl = `${route}&${queryString}`;  // Monta a URL com os parâmetros

      const response = await fetchApi<undefined, T>({
        route: apiUrl,
        method: "GET",
        nextOptions: {},
      });

      if (response.error) {
        handleErrorMessages(response.errors);
      }
      return response as T;
    },
    staleTime: 0,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,

    structuralSharing: fetchTag ? undefined : false,
  });

  const handleUpdate = () => {
    refetch(); // Refaz a solicitação GET para atualizar os dados
  };

  if (isLoading || isFetching) {
    return (
      <SkeletonLoading />
    );
  }

  if (isError) {
    return <div>Error loading datas</div>;
  }
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center">
          {data && (data as any).resultados !== undefined && (
            <span data-test="total-documentos">Total: {(data as any).resultados}</span>
          )}
        </div>
        <TableComponent dados={(data as any)?.data || null} onUpdate={handleUpdate} />
      </div>
      {(data as any)?.totalPaginas > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={(data as any).totalPaginas}
          onPageChange={(page) => setCurrentPage(page)} // Atualiza o estado interno
        />
      )}
    </>
  );
}