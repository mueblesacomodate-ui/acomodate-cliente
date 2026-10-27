'use client';

import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CarritoPage() {
  const { cart, actualizarCantidad, removerDelCarrito, vaciarCarrito, totalCarrito } = useCart();

  const handleCheckoutBold = () => {
    if (cart.length === 0) return;
    // Reemplaza con la URL de tu Link de Pago copiado del panel de Bold
    const boldLink = "https://checkout.bold.co/payment/LNK_TU_ID_REAL"; 
    window.open(boldLink, '_blank');
  };

  return (
    <main className="w-full bg-[#FDFBF7] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ENCABEZADO */}
        <header className="border-b border-gray-200 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#8C6D53] font-medium block mb-2">
              ACOMÓDATE MUEBLES
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] font-normal">
              Carrito de Compras
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-black font-medium transition-colors"
          >
            ← Seguir Comprando
          </Link>
        </header>

        {cart.length === 0 ? (
          /* ESTADO VACÍO */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto space-y-6">
            <span className="text-5xl block">🛒</span>
            <h2 className="font-serif text-2xl text-[#1A1A1A]">Tu carrito está vacío</h2>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Explora nuestra colección de muebles de alta gama y añade tus piezas favoritas.
            </p>
            <Link
              href="/categoria/salas"
              className="inline-block bg-[#1A1A1A] text-white py-4 px-8 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8C6D53] transition-colors"
            >
              Ver Colección
            </Link>
          </div>
        ) : (
          /* VISTA CON ELEMENTOS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LISTADO DE PRODUCTOS */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Productos ({cart.length})
                </span>
                <button
                  onClick={vaciarCarrito}
                  className="text-xs text-red-500 hover:underline uppercase font-medium cursor-pointer"
                >
                  Vaciar Carrito
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-serif text-base sm:text-lg text-[#1A1A1A] font-medium">
                          {item.nombre}
                        </h3>
                        <p className="text-xs font-semibold text-[#8C6D53]">
                          ${item.precio.toLocaleString('es-CO')} COP c/u
                        </p>
                      </div>
                    </div>

                    {/* CONTROLES DE CANTIDAD */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                      <div className="flex items-center  rounded-xl ">
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors text-xs cursor-pointer"
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-sans text-xs font-bold text-[#1A1A1A]">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors text-xs cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>

                      {/* SUB-TOTAL Y REMOVER */}
                      <div className="text-right min-w-[100px]">
                        <p className="font-serif text-base font-bold text-[#1A1A1A]">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')} COP
                        </p>
                        <button
                          onClick={() => removerDelCarrito(item.id)}
                          className="text-[11px] text-red-500 hover:underline font-medium cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* CHECKOUT BOLD */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 h-fit">
              <h2 className="font-serif text-xl text-[#1A1A1A] border-b border-gray-100 pb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 text-xs text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalCarrito.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío / Despacho:</span>
                  <span className="text-[#8C6D53]">A convenir</span>
                </div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between text-base font-serif font-bold text-[#1A1A1A] pt-2">
                  <span>Total:</span>
                  <span>${totalCarrito.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckoutBold}
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#8C6D53] transition-colors py-4 rounded-xl text-xs uppercase tracking-widest font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>PAGAR</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}