// public/js/meuFlow.js
const statusOrder = ["todo", "doing", "review", "approved", "done"];
const statusLabel = {
  todo: "A Fazer",
  doing: "Em Andamento",
  review: "Em Revisão",
  approved: "Aprovado",
  done: "Concluído"
};

const priorityLabel = { high: "Alta", medium: "Média", low: "Baixa" };

// dados fake (depois vc liga no banco)
let tasks = [
  { id:"T-1001", title:"Gravar takes do day use", project:"Bellatrix", status:"todo", priority:"high", due:"2025-12-18", tags:["gravação","reels"] },
  { id:"T-1002", title:"Edição do Reels (corte + música)", project:"Bellatrix", status:"doing", priority:"high", due:"2025-12-17", tags:["edição"] },
  { id:"T-1003", title:"Revisar copy do carrossel Réveillon", project:"Bellatrix", status:"review", priority:"medium", due:"2025-12-16", tags:["revisão","copy"] },
  { id:"T-1004", title:"Aprovar artes da semana", project:"FlowUp", status:"approved", priority:"medium", due:"2025-12-20", tags:["aprovação"] },
  { id:"T-1005", title:"Checklist de entregas final", project:"FlowUp", status:"done", priority:"low", due:"2025-12-14", tags:["processo"] }
];

const els = {
  area: document.getElementById("listsArea"),
  empty: document.getElementById("emptyState"),
  search: document.getElementById("taskSearch"),
  priority: document.getElementById("priorityFilter"),
  sortBy: document.getElementById("sortBy"),
  clear: document.getElementById("clearFiltersBtn")
};

let filters = { q:"", priority:"all", sortBy:"due_asc" };

function escapeHtml(str=""){
  return str
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function fmtDue(due){
  if(!due) return "Sem prazo";
  const [y,m,d] = due.split("-");
  return `${d}/${m}/${y}`;
}

function isOverdue(due){
  if(!due) return false;
  const today = new Date();
  const d = new Date(due + "T00:00:00");
  return d.getTime() < new Date(today.toDateString()).getTime();
}

function priorityRank(p){
  if(p === "high") return 3;
  if(p === "medium") return 2;
  return 1;
}

function getFiltered(){
  const q = (filters.q || "").trim().toLowerCase();
  let list = tasks.slice();

  if(filters.priority !== "all"){
    list = list.filter(t => t.priority === filters.priority);
  }

  if(q){
    list = list.filter(t => {
      const hay = [t.title, t.project, (t.tags||[]).join(" "), t.id].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  if(filters.sortBy === "due_asc"){
    list.sort((a,b) => (a.due || "9999-12-31").localeCompare(b.due || "9999-12-31"));
  } else if(filters.sortBy === "due_desc"){
    list.sort((a,b) => (b.due || "0000-01-01").localeCompare(a.due || "0000-01-01"));
  } else if(filters.sortBy === "priority_desc"){
    list.sort((a,b) => priorityRank(b.priority) - priorityRank(a.priority));
  }

  return list;
}

function pillPriority(priority){
  const cls =
    priority === "high" ? "pri-high" :
    priority === "medium" ? "pri-medium" : "pri-low";
  return `<span class="pill ${cls}">${priorityLabel[priority] || "—"}</span>`;
}

function tagsHTML(tags){
  const safe = (tags || []).slice(0, 2).map(t => `<span class="pill soft">${escapeHtml(t)}</span>`).join("");
  const more = (tags || []).length > 2 ? `<span class="pill soft">+${(tags||[]).length - 2}</span>` : "";
  return safe + more;
}

function taskCardHTML(t){
  const overdue = isOverdue(t.due) && t.status !== "done";
  const dueLabel = t.due ? fmtDue(t.due) : "Sem prazo";

  return `
    <div class="task-card" data-id="${escapeHtml(t.id)}">
      <div class="task-card-title">${escapeHtml(t.title)}</div>

      <div class="task-card-pills">
        <span class="pill soft">${escapeHtml(t.project || "Projeto")}</span>
        ${pillPriority(t.priority)}
        <span class="pill due ${overdue ? "bad" : ""}">${escapeHtml(dueLabel)}</span>
        ${tagsHTML(t.tags)}
      </div>
    </div>
  `;
}

function sectionHTML(status, list){
  return `
    <div class="list-section" data-section="${status}">
      <div class="section-topbar"></div>

      <div class="section-head" data-toggle="${status}">
        <div class="section-head-left">
          <button class="collapse-btn" type="button" aria-label="Minimizar/Expandir">
            <span class="caret"></span>
          </button>

          <div class="section-title">${statusLabel[status]}</div>
        </div>

        <div class="section-count">${list.length}</div>
      </div>

      <div class="section-body">
        ${list.length ? list.map(taskCardHTML).join("") : `
          <div class="task-card" style="cursor:default;opacity:.85;">
            <div class="task-card-title" style="color:#64748b;">Sem tarefas aqui por enquanto</div>
            <div class="task-card-pills">
              <span class="pill">Tudo certo</span>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}

function render(){
  const filtered = getFiltered();

  const buckets = { todo:[], doing:[], review:[], approved:[], done:[] };
  filtered.forEach(t => buckets[t.status]?.push(t));

  const total = filtered.length;
  els.empty.style.display = total ? "none" : "block";
  els.area.style.display = total ? "flex" : "none";

  els.area.innerHTML = statusOrder.map(s => sectionHTML(s, buckets[s])).join("");

  // toggle collapse/expand
  document.querySelectorAll(".section-head[data-toggle]").forEach(head => {
    head.addEventListener("click", () => {
      const status = head.dataset.toggle;
      const section = document.querySelector(`.list-section[data-section="${status}"]`);
      if(!section) return;
      section.classList.toggle("collapsed");
    });
  });

  // click no card
  document.querySelectorAll(".task-card[data-id]").forEach(card => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("clicou tarefa:", card.dataset.id);
      // depois a gente abre modal aqui
    });
  });
}

function wire(){
  els.search.addEventListener("input", () => {
    filters.q = els.search.value;
    render();
  });

  els.priority.addEventListener("change", () => {
    filters.priority = els.priority.value;
    render();
  });

  els.sortBy.addEventListener("change", () => {
    filters.sortBy = els.sortBy.value;
    render();
  });

  els.clear.addEventListener("click", () => {
    filters = { q:"", priority:"all", sortBy:"due_asc" };
    els.search.value = "";
    els.priority.value = "all";
    els.sortBy.value = "due_asc";
    render();
  });
}

wire();
render();
