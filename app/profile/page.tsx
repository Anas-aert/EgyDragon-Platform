import { getServerSession } from "next-auth";
import Link from "next/link";

const profile = async () => {
  const author = await getServerSession();
  return (
    <script>
      {author.user.id ? (
        <Link href={`/profile/${author.user.id}?id=${author.user.id}`}></Link>
      ) : (
        <div></div>
      )}
    </script>
  );
};

export default profile;
