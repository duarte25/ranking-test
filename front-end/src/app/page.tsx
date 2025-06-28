"use client";

import { ViewFirtsRank, ViewUserData } from "@/api/models/User";
import { fetchUseQuery } from "@/api/services/fetchUseQuery";
import { RankingTable } from "@/components/home/RankingTable";
import { TopUserCard } from "@/components/home/TopUserCard";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["listUser"],
    queryFn: async () => {
      const response = await fetchUseQuery<unknown, ViewUserData[]>({
        route: "/users",
        method: "GET",
        nextOptions: {},
      });

      return response.data;
    },
    retry: 2,
  });

  const { data: dataFirtsRank } = useQuery({
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
    <div className="flex justify-between px-10">
      <TopUserCard dataFirtsRank={dataFirtsRank} />
      <RankingTable data={data} />
    </div>
  );
}