const PUBLISHABLE = ["公開可能", "一部加工で公開可能"];

async function loadJson(path) {
  const res = await fetch(path);
  return res.json();
}

function workCard(work) {
  const meta = [
    ["目的", work.purpose],
    ["担当範囲", work.role.join(" / ")],
    ["使用ツール", work.tools.join(" / ")],
    ["工夫したポイント", work.highlight],
  ];

  const thumbSrc = (work.embedType === "youtube" && work.embedId)
    ? `https://img.youtube.com/vi/${work.embedId}/hqdefault.jpg`
    : work.thumbnail;

  const thumbInner =
    work.embedType === "youtube" && work.embedId
      ? `<div class="play-badge" aria-hidden="true">▶</div>`
      : "";

  const thumbClass =
    work.category === "feed-image"
      ? "work-thumb work-thumb--square"
      : "work-thumb";

  return `
    <article class="work-card" data-embed-type="${work.embedType}" data-embed-id="${work.embedId}">
      <div class="${thumbClass}">
        <img src="${thumbSrc}" alt="${work.title}" loading="lazy">
        ${thumbInner}
      </div>
      <div class="work-body">
        <p class="work-category">${work.categoryLabel}</p>
        <h3 class="work-title">${work.title}</h3>
        <dl class="work-meta">
          ${meta.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join("")}
        </dl>
      </div>
    </article>
  `;
}

function categorySection(heading, works, categoryKey) {
  return `
    <div class="works-category-section" data-category="${categoryKey}">
      <h3 class="works-category-heading">${heading}</h3>
      <div class="works-row">
        ${works.map(workCard).join("")}
      </div>
    </div>
  `;
}

function testimonialCard(t) {
  return `
    <blockquote class="testimonial-card">
      <p>${t.quote}</p>
      <cite>${t.attribution}</cite>
    </blockquote>
  `;
}

function attachLazyEmbed(grid) {
  grid.querySelectorAll(".work-thumb").forEach((thumb) => {
    const card = thumb.closest(".work-card");
    const type = card.dataset.embedType;
    const id = card.dataset.embedId;
    if (type !== "youtube" || !id) return;

    thumb.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.width = "100%";
      iframe.height = "100%";
      thumb.replaceChildren(iframe);
    }, { once: true });
  });
}

async function renderWorks() {
  const worksGrid = document.getElementById("works-grid");
  const testimonialsGrid = document.getElementById("testimonials-grid");
  if (!worksGrid && !testimonialsGrid) return;

  const [works, testimonials] = await Promise.all([
    loadJson("data/works.json"),
    loadJson("data/testimonials.json"),
  ]);

  if (worksGrid) {
    const visibleWorks = works.filter((w) => PUBLISHABLE.includes(w.publishStatus));
    const videoWorks = visibleWorks.filter((w) => w.category === "short-video");
    const feedWorks = visibleWorks.filter((w) => w.category === "feed-image");

    let html = "";
    if (videoWorks.length) html += categorySection("ショート動画編集", videoWorks, "short-video");
    if (feedWorks.length) html += categorySection("投稿画像（カルーセル）", feedWorks, "feed-image");

    worksGrid.innerHTML = html || `<p class="works-empty">準備中です。近日公開予定の実績がございます。</p>`;
    attachLazyEmbed(worksGrid);

    // タブUI生成
    const tabs = [];
    if (videoWorks.length) tabs.push({ category: "short-video", label: "ショート動画編集" });
    if (feedWorks.length) tabs.push({ category: "feed-image", label: "投稿画像（カルーセル）" });

    if (tabs.length > 1) {
      const tabsHtml = `
        <div class="works-tabs" role="tablist">
          ${tabs.map((t, i) => `<button class="works-tab${i === 0 ? " is-active" : ""}" data-category="${t.category}" role="tab">${t.label}</button>`).join("")}
        </div>
      `;
      worksGrid.insertAdjacentHTML("beforebegin", tabsHtml);

      const sections = worksGrid.querySelectorAll(".works-category-section");
      sections.forEach((s, i) => { if (i !== 0) s.hidden = true; });

      document.querySelectorAll(".works-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          const cat = tab.dataset.category;
          document.querySelectorAll(".works-tab").forEach(t => t.classList.toggle("is-active", t === tab));
          sections.forEach(s => { s.hidden = s.dataset.category !== cat; });
        });
      });
    }
  }

  if (testimonialsGrid) {
    const visibleTestimonials = testimonials.filter((t) => PUBLISHABLE.includes(t.publishStatus));
    testimonialsGrid.innerHTML = visibleTestimonials.length
      ? visibleTestimonials.map(testimonialCard).join("")
      : "";
  }
}

document.addEventListener("DOMContentLoaded", renderWorks);
