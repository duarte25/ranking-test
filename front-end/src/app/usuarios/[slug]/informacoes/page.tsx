import ContainerPageContent from "@/components/ContainerPageContentProps";
import DataTableCompanies from "@/components/Users/DataTableUsers";
import ButtonLink from "@/components/ButtonLink";
import { CirclePlus } from "lucide-react";
import Title from "@/components/Title";
import GetTableDataComponent from "@/components/GetTableData";

export default async function UserScore({ params }: { params: any }) {
  const { slug } = params;

  return (
    <ContainerPageContent>

      <div className="grid sm:flex items-center justify-center sm:justify-between">
        <Title>Usuário</Title>
        <ButtonLink className="bg-green-fourth" href={"/editar/usuario"}><CirclePlus />Editar usuário</ButtonLink>
      </div>

      <GetTableDataComponent
        TableComponent={DataTableCompanies}
        fetchTag={"getUserScore"}
        route={`/scores?idUsuario=${slug}`}
      />

    </ContainerPageContent>

  );
}