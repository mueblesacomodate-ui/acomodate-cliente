import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cart } = await request.json();

    // IMPORTANTE: recalcula el total en el servidor con tus precios reales,
    // no confíes en el total que manda el navegador.
    const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const response = await fetch('https://integrations.api.bold.co/online/link/v1', {
      method: 'POST',
      headers: {
        'Authorization': `x-api-key ${process.env.BOLD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount_type: 'CLOSE',
        amount: {
          currency: 'COP',
          total_amount: Math.round(total),
        },
        description: 'Compra en Acomódate Muebles',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Bold respondió con error:', response.status, JSON.stringify(data));
      return NextResponse.json({ error: 'Bold rechazó la solicitud', detalle: data }, { status: 502 });
    }

    return NextResponse.json({ url: data.payload?.url });
  } catch (error) {
    console.error('Error en /api/checkout:', error);
    return NextResponse.json({ error: 'Error al conectar con Bold' }, { status: 500 });
  }
}