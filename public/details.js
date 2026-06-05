const API_URL = "http://localhost:3000";
const COLLECTION = "albums";

async function fetchItemById(id) {
  const response = await fetch(`${API_URL}/${COLLECTION}/${id}`);

  if (!response.ok) {
    throw new Error("Item não encontrado.");
  }

  return response.json();
}

function renderError(message) {
  const detailsContainer = document.getElementById("albumDetails");
  const photosContainer = document.getElementById("photosGallery");

  if (detailsContainer) {
    detailsContainer.innerHTML = `
      <div class="alert alert-warning">
        ${message} Volte para a <a href="index.html" class="alert-link">página inicial</a>.
      </div>
    `;
  }

  if (photosContainer) {
    photosContainer.innerHTML = "";
  }
}

function renderTags(tags = []) {
  if (!tags.length) {
    return '<span class="text-secondary">Nenhuma tag cadastrada.</span>';
  }

  return tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("");
}

function renderAlbumDetails(album) {
  const detailsContainer = document.getElementById("albumDetails");
  const photosContainer = document.getElementById("photosGallery");

  if (!detailsContainer || !photosContainer) {
    return;
  }

  detailsContainer.innerHTML = `
    <article class="info-box">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <img class="rounded detail-cover" src="${album.coverImage}" alt="Capa do álbum ${album.title}">
        </div>
        <div class="col-12 col-md-8">
          <h2 class="h3 mb-3">${album.title}</h2>
          <p class="mb-2"><span class="meta-label">Cantor(a):</span> ${album.singer}</p>
          <p class="mb-2"><span class="meta-label">Ano de lançamento:</span> ${album.year}</p>
          <p class="mb-2"><span class="meta-label">Categoria:</span> ${album.genre}</p>
          <p class="mb-2"><span class="meta-label">Valor:</span> ${album.price}</p>
          <p class="mb-2"><span class="meta-label">País:</span> ${album.country}</p>
          <p class="mb-2"><span class="meta-label">Quantidade de faixas:</span> ${album.tracks}</p>
          <p class="mb-2"><span class="meta-label">Inspiração:</span> ${album.inspiration}</p>
          <p class="mb-3"><span class="meta-label">Descrição:</span> ${album.description}</p>
          <div class="tags-list">${renderTags(album.tags)}</div>
        </div>
      </div>
    </article>
  `;

  photosContainer.innerHTML = (album.photos || [])
    .map((photo) => `
      <div class="col-6 col-md-4 col-lg-3">
        <article class="info-box h-100">
          <img class="rounded gallery-image" src="${photo.image}" alt="${photo.title}">
          <h3 class="h6 mb-0">${photo.title}</h3>
        </article>
      </div>
    `)
    .join("");
}

async function initDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    renderError("Nenhum id foi informado na URL.");
    return;
  }

  try {
    const album = await fetchItemById(id);
    renderAlbumDetails(album);
  } catch (error) {
    renderError(error.message);
  }
}

document.addEventListener("DOMContentLoaded", initDetails);
