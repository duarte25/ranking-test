"use client";

import { ViewFirtsRank } from "@/api/models/User";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import { RankingTable } from "@/components/home/RankingTable";
import { TopUserCard } from "@/components/home/TopUserCard";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: dataFirtsRank, isLoading } = useQuery({
    queryKey: ["firsrtRank"],
    queryFn: async () => {
      const response = await fetchUseQuery<unknown, ViewFirtsRank>({
        route: "/users/first_rank",
        method: "GET",
        nextOptions: {},
      });

      return response.data;
    },
    retry: 2,
  });

  return (
    <div className="flex items-center flex-col lg:items-start lg:flex-row lg:justify-between px-10">
      <div className="sm:w-full md:w-5/6 lg:w-3/6 xl:w-5/12 2xl:w-4/12 ">
        <TopUserCard dataFirtsRank={dataFirtsRank} isLoading={isLoading} />
      </div>
      <div className="sm:w-full md:w-5/6 lg:w-4/6 xl:w-7/12 2xl:w-4/12">
        <RankingTable />
      </div>
    </div>
  );
}