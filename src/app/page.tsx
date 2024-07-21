'use client'
import withAuth from "./components/WithAuth";

function Home (){
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hola</h1>
    </main>
  );
}
export default withAuth(Home)