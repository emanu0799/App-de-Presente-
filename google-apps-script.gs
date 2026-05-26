const SHEET_GIFTS = "presentes";
const SHEET_RESERVATIONS = "reservas";

function doPost(event) {
  const body = JSON.parse(event.postData.contents || event.parameter.payload || "{}");
  const spreadsheet = SpreadsheetApp.getActive();
  setupSheets(spreadsheet);

  if (body.action === "list") {
    return jsonResponse(readData(spreadsheet));
  }

  if (body.action === "addGift") {
    upsertGift(spreadsheet, body.gift);
    return jsonResponse({ ok: true, ...readData(spreadsheet) });
  }

  if (body.action === "reserve") {
    reserveGift(spreadsheet, body.giftId, body.guest);
    return jsonResponse({ ok: true, ...readData(spreadsheet) });
  }

  return jsonResponse({ ok: false, error: "Acao desconhecida" });
}

function doGet() {
  const spreadsheet = SpreadsheetApp.getActive();
  setupSheets(spreadsheet);
  return jsonResponse(readData(spreadsheet));
}

function setupSheets(spreadsheet) {
  const gifts = spreadsheet.getSheetByName(SHEET_GIFTS) || spreadsheet.insertSheet(SHEET_GIFTS);
  const reservations =
    spreadsheet.getSheetByName(SHEET_RESERVATIONS) || spreadsheet.insertSheet(SHEET_RESERVATIONS);

  if (gifts.getLastRow() === 0) {
    gifts.appendRow(["id", "title", "category", "price", "description", "image", "url"]);
  }

  if (reservations.getLastRow() === 0) {
    reservations.appendRow(["giftId", "guest", "createdAt"]);
  }
}

function readData(spreadsheet) {
  const giftsSheet = spreadsheet.getSheetByName(SHEET_GIFTS);
  const reservationsSheet = spreadsheet.getSheetByName(SHEET_RESERVATIONS);
  const giftsValues = giftsSheet.getDataRange().getValues();
  const reservationValues = reservationsSheet.getDataRange().getValues();

  const gifts = giftsValues.slice(1).filter(row => row[0]).map(row => ({
    id: String(row[0]),
    title: String(row[1]),
    category: String(row[2]),
    price: String(row[3]),
    description: String(row[4]),
    image: String(row[5]),
    url: String(row[6]),
  }));

  const reservations = {};
  reservationValues.slice(1).forEach(row => {
    if (row[0] && row[1]) reservations[String(row[0])] = String(row[1]);
  });

  return { ok: true, gifts, reservations };
}

function upsertGift(spreadsheet, gift) {
  if (!gift || !gift.id || !gift.title) return;

  const sheet = spreadsheet.getSheetByName(SHEET_GIFTS);
  const values = sheet.getDataRange().getValues();
  const row = [
    gift.id,
    gift.title,
    gift.category || "Casa",
    gift.price || "",
    gift.description || "",
    gift.image || "",
    gift.url || "",
  ];

  for (let index = 1; index < values.length; index += 1) {
    if (values[index][0] === gift.id) {
      sheet.getRange(index + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }

  sheet.appendRow(row);
}

function reserveGift(spreadsheet, giftId, guest) {
  if (!giftId || !guest) return;

  const sheet = spreadsheet.getSheetByName(SHEET_RESERVATIONS);
  const values = sheet.getDataRange().getValues();

  for (let index = 1; index < values.length; index += 1) {
    if (values[index][0] === giftId) {
      sheet.getRange(index + 1, 2, 1, 2).setValues([[guest, new Date()]]);
      return;
    }
  }

  sheet.appendRow([giftId, guest, new Date()]);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
