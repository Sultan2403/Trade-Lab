import { Outlet } from "react-router-dom";


export default function Main() {
  
  return (
    <div className="flex h-screen w-full">
      <aside className="w-[20%] h-full overflow-y-auto">
        {/* <Nav /> */}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b bg-cream shadow-soft">
          <h1 className="text-2xl ml-8 font-serif font-semibold text-primaryText">
            Dump Your Thoughts
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
