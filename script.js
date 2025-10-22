document.addEventListener("DOMContentLoaded", () => {
  const rechargeBtn = document.getElementById("rechargeBtn");
  const paymentModal = document.getElementById("paymentModal");
  const cancelPayment = document.getElementById("cancelPayment");
  const transferBankLabel = document.getElementById("transferBankLabel");
  const bankOptions = document.getElementById("bankOptions");
  const coinCards = document.querySelectorAll(".coin-card");
  const displayPrice = document.getElementById("displayPrice");
  const payNowBtn = document.getElementById("payNowBtn");
  const balanceEl = document.getElementById("globalBalance");
  const recipientInput = document.getElementById("recipientName");
  const openCustom = document.getElementById("openCustom");

  let selectedPrice = 0;
  let balance = parseInt((balanceEl.textContent || "0").replace(/,/g, "")) || 0;
  let customCoinValue = 0;

  const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // === Tampilkan modal pembayaran ===
  rechargeBtn.addEventListener("click", () => {
    paymentModal.classList.remove("hidden");
    paymentModal.style.display = "flex";
    requestAnimationFrame(() => paymentModal.classList.add("show"));
  });

  // === Tutup modal ===
  cancelPayment.addEventListener("click", () => {
    paymentModal.classList.remove("show");
    setTimeout(() => {
      paymentModal.classList.add("hidden");
      paymentModal.style.display = "none";
    }, 360);
  });

  // === Animasi buka/tutup transfer bank ===
  if (transferBankLabel && bankOptions) {
    transferBankLabel.addEventListener("click", (e) => {
      e.preventDefault();
      const radio = transferBankLabel.querySelector("input[type='radio']");
      if (radio) radio.checked = true;

      const visible = bankOptions.classList.contains("show");
      if (visible) {
        bankOptions.classList.remove("show");
        setTimeout(() => (bankOptions.style.display = "none"), 300);
      } else {
        bankOptions.style.display = "block";
        setTimeout(() => bankOptions.classList.add("show"), 10);
      }
    });
  }

  // === Klik opsi bank ===
  document.querySelectorAll(".bank-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".bank-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const bankRadio = document.querySelector("input[value='bank']");
      if (bankRadio) bankRadio.checked = true;
    });
  });

  // === Pilihan koin paket ===
  coinCards.forEach(card => {
    card.addEventListener("click", () => {
      coinCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const price = parseFloat(card.dataset.price) || 0;
      selectedPrice = price;
      displayPrice.textContent = `$${price.toFixed(2)}`;
      customCoinValue = 0;
    });
  });

  // === Custom coin ===
  if (openCustom) {
    openCustom.addEventListener("click", () => {
      const val = prompt("Masukkan jumlah coin:");
      const coins = parseInt(val, 10);
      if (isNaN(coins) || coins <= 0) {
        alert("Masukkan jumlah coin yang valid!");
        return;
      }
      const price = (coins * 0.0106).toFixed(2);
      customCoinValue = coins;
      selectedPrice = parseFloat(price);
      displayPrice.textContent = `$${price}`;
      coinCards.forEach(c => c.classList.remove("selected"));
      openCustom.classList.add("selected");
    });
  }

  // === Klik tombol Pay ===
  payNowBtn.addEventListener("click", () => {
    const recipient = recipientInput.value.trim();
    if (!recipient) return alert("Masukkan nama penerima terlebih dahulu.");
    if (!selectedPrice) return alert("Pilih jumlah coin terlebih dahulu.");
    if (!document.querySelector("input[name='pm']:checked"))
      return alert("Pilih metode pembayaran terlebih dahulu.");
    openPasscodeModal();
  });

  // === Modal input PIN (berbentuk titik) ===
  function openPasscodeModal() {
    const wrap = document.createElement("div");
    wrap.id = "__passcode_wrapper";
    wrap.style = `
      position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.5);z-index:120;
    `;
    wrap.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:20px;width:320px;text-align:center;">
        <h3>Masukkan kode sandi</h3>
        <p style="margin-bottom:15px;">Masukkan 4 digit PIN Anda untuk konfirmasi</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-bottom:12px;">
          ${Array(4).fill('<input type="password" inputmode="numeric" maxlength="1" style="width:48px;height:56px;text-align:center;font-size:22px;border-radius:10px;border:1px solid #e6e6e6;" />').join('')}
        </div>
        <div style="display:flex;gap:8px;justify-content:center;">
          <button id="pwCancel" style="padding:8px 12px;border-radius:10px;border:1px solid #ddd;background:#fff;">Batal</button>
          <button id="pwOk" style="padding:8px 12px;border-radius:10px;border:0;background:#fe2c55;color:#fff;">OK</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const inputs = wrap.querySelectorAll("input");
    const pwCancel = wrap.querySelector("#pwCancel");
    const pwOk = wrap.querySelector("#pwOk");
    inputs[0].focus();

    inputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        if (inp.value && i < inputs.length - 1) inputs[i + 1].focus();
      });
    });

    pwCancel.onclick = () => wrap.remove();

    pwOk.onclick = () => {
      const code = Array.from(inputs).map(i => i.value).join("");
      if (!/^[0-9]{4}$/.test(code)) return alert("Kode sandi harus 4 digit angka!");
      wrap.remove();
      const cost = Math.round(selectedPrice * 10000);
      balance = Math.max(0, balance - cost);
      balanceEl.textContent = fmt(balance);
      window.location.href = "process.html";
      setTimeout(() => (window.location.href = "success.html"), 2000);
    };
  }
});
