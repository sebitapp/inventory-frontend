import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Bienvenido a <span className="text">ONE</span><span className="text-primary">ERP</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10">
          Simplify your inventory management with smart, powerful tools.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary text-white hover:bg-white hover:text-primary transition rounded-full text-lg font-semibold shadow-lg text-primary-foreground"
          >
            Ingresar
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white transition rounded-full text-lg font-semibold shadow-lg"
          >
            Registrarte
          </Link>
        </div>
      </div>
    </main>
  );
}
