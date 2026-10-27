'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import CarruselAmbientes from '@/app/components/CarruselAmbientes';
import { MedidasMueble } from '@/app/components/MedidasMueble';
import { MaterialesMueble } from '@/app/components/MaterialesMueble';
import { useCart } from '@/app/context/CartContext';


interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria?: string;
  precio: number | string;
  imagen: string;
  imagenes?: string[]; 
  descripcion?: string;
  medidas?: any;
  materiales?: any;
}

export default function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);

  // Hook global del carrito
  const { agregarAlCarrito } = useCart();

  useEffect(() => {
    async function obtenerProducto() {
      try {
        setCargando(true);
        const docRef = doc(db, 'productos', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProducto({
            id: docSnap.id,
            ...data,
            imagenes: data.imagenes || [data.imagen],
          } as Producto);
        } else {
          setProducto(null);
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      } finally {
        setCargando(false);
      }
    }

    if (slug) {
      obtenerProducto();
    }
  }, [slug]);

  if (cargando) {
    return (
      <main className="w-full bg-[#FDFBF7] min-h-screen py-24 px-6 flex items-center justify-center">
        <p className="text-gray-400 font-light text-sm tracking-widest uppercase animate-pulse">
          Cargando producto...
        </p>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="w-full bg-[#FDFBF7] min-h-screen py-24 px-6 text-center">
        <div className="max-w-md mx-auto bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4">
            Producto no encontrado
          </h2>
          <p className="text-sm text-gray-500 mb-6 font-light">
            El mueble que buscas no está disponible o ha sido retirado del catálogo.
          </p>
          <Link
            href="/categoria/salas"
            className="inline-block bg-[#1A1A1A] text-white text-xs uppercase tracking-widest px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Volver a la colección
          </Link>
        </div>
      </main>
    );
  }

  // Parsear precio numérico de forma limpia
  const precioNumerico = typeof producto.precio === 'number'
    ? producto.precio
    : parseFloat(String(producto.precio).replace(/[^0-9.-]+/g, '')) || 0;

  const mensajeWhatsApp = `Hola, estoy interesado en cotizar el producto *${producto.nombre}* visto en la tienda online.`;
  const urlWhatsApp = `https://wa.me/message/D6QREGANQXL3O1?text=${encodeURIComponent(mensajeWhatsApp)}`;

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: precioNumerico,
      imagen: producto.imagen,
    });
  };

  return (
    <main className="w-full bg-[#FDFBF7] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* NAVEGACIÓN Y BREADCRUMBS */}
        <nav className="mb-8 text-xs font-sans text-gray-400 tracking-wider uppercase flex items-center gap-2">
          <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href={`/categoria/${producto.categoria}`}
            className="hover:text-[#1A1A1A] transition-colors capitalize"
          >
            {producto.categoria}
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium">{producto.nombre}</span>
        </nav>

        {/* SECCIÓN PRINCIPAL: INFO Y FOTO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm mb-16">
          
          {/* FOTO PRINCIPAL */}
          <div className="lg:col-span-7 relative h-[400px] md:h-[550px] w-full bg-gray-50 rounded-xl overflow-hidden">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* INFORMACIÓN DEL PRODUCTO Y ACCIONES DE COMPRA */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-sans tracking-[0.3em] uppercase text-[#8C6D53] block mb-2 font-medium">
                {producto.subcategoria || producto.categoria}
              </span>

              <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] font-normal mb-4">
                {producto.nombre}
              </h1>

              <p className="font-sans text-2xl font-semibold text-[#1A1A1A] mb-6">
                ${precioNumerico.toLocaleString('es-CO')} COP
              </p>

              <hr className="border-gray-100 my-6" />

              {producto.descripcion && (
                <div className="mb-6 space-y-2">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                    Descripción
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {producto.descripcion}
                  </p>
                </div>
              )}

              {/* COMPONENTE DE MEDIDAS */}
              <MedidasMueble medidas={producto.medidas} />

              {/* COMPONENTE DE MATERIALES */}
              <MaterialesMueble materiales={producto.materiales} />
            </div>

            {/* BOTONES DE ACCIÓN: AGREGAR AL CARRITO Y WHATSAPP */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <button
                type="button"
                onClick={handleAgregarAlCarrito}
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#8C6D53] transition-colors py-4 px-6 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-3 shadow-sm cursor-pointer"
              >
                <span>AGREGAR AL CARRITO</span>
                <span className="text-base">🛒</span>
              </button>

              <a
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-50 text-[#1A1A1A] border border-gray-200 hover:bg-gray-100 transition-colors py-3.5 px-6 rounded-xl font-sans text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-3"
              >
                <span>Cotizar por WhatsApp</span>
                <svg
                  className="w-4 h-4 fill-current text-green-600"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.031 0C5.393 0 0 5.393 0 12.031c0 2.12.553 4.11 1.519 5.84L0 24l6.302-1.488a11.97 11.97 0 0 0 5.729 1.519h.005c6.638 0 12.031-5.393 12.031-12.031 0-3.212-1.251-6.233-3.524-8.506A11.95 11.95 0 0 0 12.031 0z" />
                </svg>
              </a>
            </div>

          </div>
        </div>

        {/* CARRUSEL DE AMBIENTES */}
        <CarruselAmbientes 
          imagenes={producto.imagenes || []} 
          nombreProducto={producto.nombre} 
        />

      </div>
    </main>
  );
}