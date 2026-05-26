import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

function response(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  });
}

async function readData() {
  const gifts = await sql`
    select id, title, category, price, description, image, url
    from gifts
    order by created_at desc
  `;
  const rows = await sql`select gift_id, guest from reservations`;
  const reservations = Object.fromEntries(rows.map((row) => [row.gift_id, row.guest]));

  return { ok: true, gifts, reservations };
}

async function addGift(gift) {
  if (!gift?.id || !gift?.title) {
    return response(400, { ok: false, error: "Presente invalido" });
  }

  await sql`
    insert into gifts (id, title, category, price, description, image, url)
    values (
      ${gift.id},
      ${gift.title},
      ${gift.category || "Casa"},
      ${gift.price || ""},
      ${gift.description || ""},
      ${gift.image || ""},
      ${gift.url || ""}
    )
    on conflict (id) do update set
      title = excluded.title,
      category = excluded.category,
      price = excluded.price,
      description = excluded.description,
      image = excluded.image,
      url = excluded.url
  `;

  return response(200, await readData());
}

async function reserveGift(giftId, guest) {
  if (!giftId || !guest) {
    return response(400, { ok: false, error: "Reserva invalida" });
  }

  await sql`
    insert into reservations (gift_id, guest)
    values (${giftId}, ${guest})
    on conflict (gift_id) do update set
      guest = excluded.guest,
      created_at = now()
  `;

  return response(200, await readData());
}

export default async function handler(request) {
  if (request.method === "OPTIONS") {
    return response(200, { ok: true });
  }

  try {
    if (request.method === "GET") {
      return response(200, await readData());
    }

    if (request.method === "POST") {
      const body = await request.json();

      if (body.action === "addGift") {
        return addGift(body.gift);
      }

      if (body.action === "reserve") {
        return reserveGift(body.giftId, body.guest);
      }

      if (body.action === "list") {
        return response(200, await readData());
      }
    }

    return response(405, { ok: false, error: "Metodo nao permitido" });
  } catch (error) {
    return response(500, { ok: false, error: error.message });
  }
}
