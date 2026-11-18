// Render project cards from projects.json.
(async function () {
  const container = document.getElementById("projects");
  const tpl = document.getElementById("card-tpl");

  function link(label, url, cls) {
    const a = document.createElement("a");
    a.className = "btn " + cls;
    a.href = url;
    a.textContent = label;
    a.rel = "noopener";
    return a;
  }

  function renderCard(p) {
    const card = tpl.content.firstElementChild.cloneNode(true);
    card.querySelector(".card-title").textContent = p.name;
    card.querySelector(".card-desc").textContent = p.description || "";

    const tags = card.querySelector(".tags");
    for (const t of p.tags || []) {
      const li = document.createElement("li");
      li.textContent = t;
      tags.appendChild(li);
    }

    const actions = card.querySelector(".card-actions");
    for (const l of p.links || []) actions.appendChild(link(l.label, l.url, "btn-primary"));
    if (p.repo) {
      const repo = p.repo.replace(/\/+$/, "");
      actions.appendChild(link("Code", repo, "btn-ghost"));
      actions.appendChild(link("Signaler / suggérer", repo + "/issues", "btn-ghost"));
    }
    return card;
  }

  try {
    const res = await fetch("projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const projects = await res.json();
    container.replaceChildren(...projects.map(renderCard));
    if (!projects.length) container.innerHTML = '<p class="muted">Aucun projet pour le moment.</p>';
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p class="muted">Impossible de charger les projets. Voir <a href="https://github.com/The-Ston">github.com/The-Ston</a>.</p>';
  }
})();
