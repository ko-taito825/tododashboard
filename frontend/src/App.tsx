function App() {
  return (
    <div
      className="min-h-screen bg-[#09090B] text-gray-100 antialiased font-sans"
      style={{
        backgroundImage: "url('/src/assets/main.png')",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto",
      }}
    >
      <div className="w-full px-12 pt-87.5 pb-12">
        <header className="mb-10">
          <h1 className="text-5xl font-bold tracking-widest border-b border-purple-600 pb-4">
            DASHBOARD
          </h1>
        </header>
      </div>
    </div>
  );
}
export default App;
