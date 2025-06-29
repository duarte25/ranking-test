"use client";

import ContainerPageContent from "@/components/ContainerPageContentProps";
import DataTableCompanies from "@/components/Users/DataTableUsers";
import { PopUpAlterUser } from "@/components/Users/PopUpAlterUser";
import GetTableDataComponent from "@/components/GetTableData";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Title from "@/components/Title";
import { useState } from "react";

export default function UserScore() {
  const params = useParams();
  const slug = params.slug as string;
  const [alterUsuarioOpen, setAlterUsuarioOpen] = useState(false);

  return (
    <ContainerPageContent>

      <div className="grid sm:flex items-center justify-center sm:justify-between">
        <Title>Colaborador</Title>
        <Button type="button" className="bg-gray-button" onClick={() => setAlterUsuarioOpen(true)}>
          Editar colaborador
        </Button>
      </div>

      <PopUpAlterUser open={alterUsuarioOpen}
        onOpenChange={setAlterUsuarioOpen} slug={slug} />

      <GetTableDataComponent
        TableComponent={DataTableCompanies}
        fetchTag={"getUserScore"}
        route={`/scores?idUsuario=${slug}`}
      />

    </ContainerPageContent>
  );
}