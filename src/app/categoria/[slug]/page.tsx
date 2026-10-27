'use client';

import { useState, useEffect, use } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria?: string;
  precio: number | string;
  imagen: string;
  descripcion?: string;
}

// 1. FUNCIÓN HELPER: Elimina tildes/acentos y convierte a minúsculas
const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Lista de subcategorías simuladas según la categoría principal
const subcategoriasPorDefecto: Record<string, string[]> = {
  salas: [
    'Sofás',
    'Salas en L',
    'Sofá Camas',
    'Reclinables',
    'Sillones y Poltronas',
    'Puff',
    'Mesas de Centro',
    'Mesas Auxiliares',
    'Aparadores',
    'Consolas',
    'Módulos Flotantes'
  ],
  comedores: ['Mesas de Comedor', 'Sillas de Comedor', 'Bifes y Vitrinas'],
  dormitorios: ['Camas', 'Nocheros', 'Clósets', 'Tocadores'],
  sillas: ['Poltronas', 'Sillas de Oficina', 'Bancos y Bar']
};

export default function CategoriaPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setCargando(true);
        const productosRef = collection(db, 'productos');
        const q = query(productosRef, where('categoria', '==', slug));
        const querySnapshot = await getDocs(q);

        const lista: Producto[] = [];
        querySnapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            ...doc.data(),
          } as Producto);
        });

        setProductos(lista);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, [slug]);

  // 2. FILTRO ACTUALIZADO: Compara ignorando tildes y mayúsculas
  const productosFiltrados = subcategoriaSeleccionada
    ? productos.filter(p => p.subcategoria && normalizeText(p.subcategoria) === normalizeText(subcategoriaSeleccionada))
    : productos;

  const subcategoriasDisponibles = subcategoriasPorDefecto[slug] || [];

  return (
    <main className="w-full bg-[#FDFBF7] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado Principal */}
        <header className="mb-12 border-b border-gray-200 pb-8">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-gray-500 block mb-2">
            COLECCIÓN EXCLUSIVA
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] capitalize font-normal">
            {slug}
          </h1>
        </header>

        {/* Layout de 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR DE SUBCATEGORÍAS */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-serif text-sm tracking-widest uppercase text-[#1A1A1A] font-medium">
                Categorías del Producto
              </h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSubcategoriaSeleccionada(null)}
                className={`w-full text-left text-sm font-sans tracking-wide block transition-colors py-1 ${
                  subcategoriaSeleccionada === null 
                    ? 'text-[#1A1A1A] font-semibold border-l-2 border-[#1A1A1A] pl-3' 
                    : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                Ver Todo ({productos.length})
              </button>

              {subcategoriasDisponibles.map((subcat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSubcategoriaSeleccionada(subcat)}
                  className={`w-full text-left text-sm font-sans tracking-wide block transition-colors py-1 ${
                    subcategoriaSeleccionada === subcat 
                      ? 'text-[#1A1A1A] font-semibold border-l-2 border-[#1A1A1A] pl-3' 
                      : 'text-gray-500 hover:text-[#1A1A1A]'
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </aside>

          {/* GRILLA DE PRODUCTOS */}
          <div className="lg:col-span-3">
            {cargando ? (
              <div className="text-center py-20">
                <p className="text-gray-400 font-light text-sm tracking-widest uppercase">Cargando colección...</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 p-8">
                <p className="text-gray-500 font-light text-base">
                  No hay productos disponibles en esta selección por el momento.
                </p>
              </div>
            ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {productosFiltrados.map((producto) => (
    <Link 
      key={producto.id} 
      href={`/producto/${producto.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md flex flex-col justify-between block cursor-pointer"
    >
      <div>
        {/* Imagen del producto */}
        <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
          <Image 
            src={producto.imagen} 
            alt={producto.nombre} 
            fill 
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Información Básica */}
        <div className="p-6">
          <h3 className="font-serif text-lg text-[#1A1A1A] mb-2 font-medium">
            {producto.nombre}
          </h3>
          {producto.descripcion && (
            <p className="text-xs text-gray-500 mb-4 line-clamp-2 font-light">
              {producto.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Precio y Acción */}
      <div className="p-6 pt-0">
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="font-sans text-sm font-medium text-[#1A1A1A]">
            ${typeof producto.precio === 'number' ? producto.precio.toLocaleString() : producto.precio}
          </span>
          <span className="text-xs uppercase font-medium tracking-wider text-[#8C6D53] group-hover:underline flex items-center gap-1">
            Ver detalle →
          </span>
        </div>
      </div>
    </Link>
  ))}
</div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}