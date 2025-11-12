(async () => {
  // Chờ trang video load hoàn toàn
  function waitForVideo() {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (document.querySelector("ytd-watch-flexy")) {
          clearInterval(check);
          resolve();
        }
      }, 1000);
    });
  }

  await waitForVideo();

  const videoUrl = window.location.href;
  console.log("🎥 Đang xử lý video:", videoUrl);

  const containerId = "ai-translator-box";
  if (document.getElementById(containerId)) return; // tránh trùng
  const box = document.createElement("div");
  box.id = containerId;
  box.innerHTML = `<p>🧠 Đang phân tích video...</p>`;
  box.style.cssText = `
    background: #fff;
    color: #111;
    padding: 15px;
    margin: 20px 0;
    border-radius: 12px;
    font-family: sans-serif;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  `;
  const target = document.querySelector("#above-the-fold") || document.body;
  target.appendChild(box);

  try {
    const res = await fetch("http://localhost:3000/getTranscriptAndExplain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtube_url: videoUrl })
    });
    const data = await res.json();

    if (data.error) {
      box.innerHTML = `<p>⚠️ ${data.error}</p>`;
    } else {
      box.innerHTML = `
        <h3>📘 Tóm tắt & Dịch</h3>
        <p><strong>Tóm tắt:</strong> ${data.explanation}</p>
        <p><strong>Bản dịch:</strong> ${data.translation}</p>
      `;
    }
  } catch (err) {
    box.innerHTML = `<p>❌ Lỗi tải transcript: ${err.message}</p>`;
    console.error(err);
  }
})();
