"use client";

import { useSession } from "next-auth/react";
import Navbar from "./Navbar";


export const AllComponents = () => {
  const { data, status } = useSession();

  return (
    <div>
      <Navbar user={data?.user} status={status} />
    </div>
  );
};
