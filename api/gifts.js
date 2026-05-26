import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

function send(res, status, data) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(status).json(data);
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

async function addGift(res, gift) {
  if (!gift?.id || !gift?.title) {
    send(res, 400, { ok: false, error: "Presente invalido" });
    return;
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

  send(res, 200, await readData());
}

async function reserveGift(res, giftId, guest) {
  if (!giftId || !guest) {
    send(res, 400, { ok: false, error: "Reserva invalida" });
    return;
  }

  await sql`
    insert into reservations (gift_id, guest)
    values (${giftId}, ${guest})
    on conflict (gift_id) do update set
      guest = excluded.guest,
      created_at = now()
  `;

  send(res, 200, await readData());
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    send(res, 200, { ok: true });
    return;
  }

  try {
    if (!process.env.DATABASE_URL) {
      send(res, 500, { ok: false, error: "DATABASE_URL nao configurada" });
      return;
    }

    if (req.method === "GET") {
      send(res, 200, await readData());
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

      if (body.action === "addGift") {
        await addGift(res, body.gift);
        return;
      }

      if (body.action === "reserve") {
        await reserveGift(res, body.giftId, body.guest);
        return;
      }

      if (body.action === "list") {
        send(res, 200, await readData());
        return;
      }
    }

    send(res, 405, { ok: false, error: "Metodo nao permitido" });
  } catch (error) {
    send(res, 500, { ok: false, error: error.message });
  }
}
