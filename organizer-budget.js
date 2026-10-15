"use strict";
// No tracking or network requests. All calculations stay in the visitor's browser.
function calculateOrganizerBudget(v) {
  const fields = ["attendees", "coursePrice", "dayFee", "optionFee", "fixedFee", "serviceRate", "discount", "sponsor", "budget", "rounding"];
  for (const key of fields) {
    if (!Number.isFinite(v[key]) || v[key] < 0) throw new Error("入力欄には0以上の数値を入力してください。");
  }
  if (!Number.isInteger(v.attendees) || v.attendees < 1 || v.attendees > 300) throw new Error("参加人数は1〜300人の整数で入力してください。");
  if (v.serviceRate > 100 || ![1, 100, 500].includes(v.rounding)) throw new Error("サービス料率または集金単位を確認してください。");
  const base = v.attendees * (v.coursePrice + v.dayFee + v.optionFee) + v.fixedFee;
  const total = Math.max(0, Math.round(base * (1 + v.serviceRate / 100)) - v.discount);
  const collection = Math.max(0, total - v.sponsor);
  const each = Math.ceil(collection / v.attendees / v.rounding) * v.rounding;
  const collected = each * v.attendees;
  return { total, collection, each, collected, difference: collected - collection,
    underBudget: each <= v.budget, remaining: v.budget - each };
}
function initOrganizerBudget() {
  const form = document.getElementById("organizer-calc");
  const result = document.getElementById("organizer-result");
  const error = document.getElementById("organizer-error");
  if (!form || !result || !error) return;
  const ids = ["attendees", "course-price", "day-fee", "option-fee", "fixed-fee", "service-rate", "discount", "sponsor", "budget", "rounding"];
  const names = ["attendees", "coursePrice", "dayFee", "optionFee", "fixedFee", "serviceRate", "discount", "sponsor", "budget", "rounding"];
  const yen = n => n.toLocaleString("ja-JP") + "円";
  function update() {
    try {
      const v = {};
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el || el.value.trim() === "" || !el.checkValidity()) throw new Error("入力欄の数値と範囲を確認してください。");
        v[names[i]] = Number(el.value);
      });
      const r = calculateOrganizerBudget(v);
      result.innerHTML = "";
      const entries = [
        ["宴会の概算総額", yen(r.total)],
        ["主催者負担を除いた集金対象額", yen(r.collection)],
        ["1人あたりの集金目安", yen(r.each)],
        ["集金合計", yen(r.collected)],
        ["集金額の端数による余剰", yen(r.difference)]
      ];
      const dl = document.createElement("dl");
      dl.className = "organizer-result-grid";
      entries.forEach(([label, value], index) => {
        const wrap = document.createElement("div");
        if (index === 2) wrap.className = "result-highlight";
        const dt = document.createElement("dt"); dt.textContent = label;
        const dd = document.createElement("dd"); dd.textContent = value;
        wrap.append(dt, dd); dl.appendChild(wrap);
      });
      const status = document.createElement("p");
      status.className = r.underBudget ? "budget-ok" : "budget-over";
      status.textContent = r.underBudget ? "設定した1人予算以内です（差額：" + yen(r.remaining) + "）。" : "設定した1人予算を" + yen(-r.remaining) + "超えています。";
      result.append(dl, status);
      error.hidden = true; error.textContent = "";
    } catch (e) {
      result.replaceChildren();
      error.hidden = false; error.textContent = e.message;
    }
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("reset", () => setTimeout(update, 0));
  update();
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initOrganizerBudget);
  else initOrganizerBudget();
}
if (typeof module !== "undefined" && module.exports) module.exports = { calculateOrganizerBudget };
