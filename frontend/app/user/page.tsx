'use server'

export default async function User() {
  const response = await fetch('http://localhost:4000/users')

  return (
    <main className="w-full h-full bg-pink">
      <div className="">{users.map((user: any) => <p>{user.name}</p>)}</div>
    </main>
  );
}
