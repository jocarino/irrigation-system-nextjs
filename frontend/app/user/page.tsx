import { Suspense } from "react";

async function Users() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)

  const users = await response.json();

  return <p>{JSON.stringify(users)}</p>
}
export default function User() {
  return (
    <main className="w-full h-full bg-pink">
      <Suspense fallback={null}>      <Users /></Suspense>

    </main>
  );
}
