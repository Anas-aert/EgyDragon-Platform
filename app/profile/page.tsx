"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
// import Image from "next/image";

const Profile =  () => {
  const { data, status } = useSession();


  return (
    <div className="h-screen">
      <div className="flex flex-col items-center justify-center p-8">
        {status === "loading" && <h3>Loading...</h3>}
        {status === "unauthenticated" && (
          <p className="text-black">Please login to access your profile.</p>
        )}
        {status === "authenticated" && (
          <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
            <h1 className="mb-4 text-xl font-semibold text-black">
              Name: {data?.user?.name}
            </h1>
            <Image
              src={data?.user?.image as string}
              alt="User Image"
              width={300}
              height={300}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h4 className="mb-4 text-black">Email: {data?.user?.email}</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
