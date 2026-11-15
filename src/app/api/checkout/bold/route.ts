import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { totalCarrito, orderId, customerEmail } = await request.json();

    const total = Math.round(Number(totalCarrito));
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: 'El monto no es válido' }, { status: 400 });
    }

    const apiKey = process.env.BOLD_API_KEY;
    if (!apiKey) {
      console.error('Falta BOLD_API_KEY en las variables de entorno');
      return NextResponse.json({ error: 'Pagos no configurados' }, { status: 500 });
    }

    const reference = orderId || `ORD-${Date.now()}`;

    const response = await fetch('https://integrations.api.bold.co/online/link/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `x-api-key ${apiKey}`,
      },
      body: JSON.stringify({
        amount_type: 'CLOSE',
        amount: { currency: 'COP', total_amount: total, tip_amount: 0 },
        description: `Pedido ${reference}`,
        callback_url: 'https://acomodate-cliente--acomodate-muebles.us-east4.hosted.app/checkout/respuesta',
        payer_email: customerEmail || 'cliente@acomodatemuebles.com',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Bold API:', response.status, JSON.stringify(data));
      return NextResponse.json(
        { error: data.errors?.[0]?.message || data.message || 'Error al conectar con Bold' },
        { status: 502 },
      );
    }

    const paymentUrl = data.payload?.url;
    if (!paymentUrl) {
      console.error('Bold no devolvió URL:', data);
      return NextResponse.json({ error: 'No se pudo generar el enlace de pago' }, { status: 500 });
    }

    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error('Error interno en checkout de Bold:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud de pago' }, { status: 500 });
  }
}