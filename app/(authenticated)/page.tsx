import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
}
