const API_URL = "http://localhost:3000";
const COLLECTION = "albums";

async function fetchItems() {
  const response = await fetch(`${API_URL}/${COLLECTION}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os álbuns.");
  }

  return response.json();
}

async function fetchStudent() {
  const response = await fetch(`${API_URL}/student`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar as informações do aluno.");
  }

  return response.json();
}

function createCard(item) {
  const cardWrapper = document.createElement("div");
  cardWrapper.className = "col-12 col-sm-6 col-lg-4";

  cardWrapper.innerHTML = `
    <article class="card h-100 album-card border-0 shadow-sm">
      <div class="card-body d-flex flex-column">
        <img class="rounded album-card-image" src="${item.coverImage}" alt="Capa do álbum ${item.title}">
        <h3 class="h5">${item.title}</h3>
        <p class="mb-1"><strong>${item.singer}</strong></p>
        <p class="text-secondary mb-2">${item.genre} · ${item.year}</p>
        <p class="mb-2"><strong>Categoria:</strong> ${item.genre}</p>
        <p class="mb-2"><strong>Valor:</strong> ${item.price}</p>
        <p class="mb-3">${item.shortDescription || item.description}</p>
        <a class="btn btn-ga mt-auto" href="details.html?id=${item.id}">Ver detalhes</a>
      </div>
    </article>
  `;

  return cardWrapper;
}

function renderCards(items) {
  const grid = document.getElementById("albumsGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";
  items.forEach((item) => grid.appendChild(createCard(item)));
}

function renderStudentInfo(student) {
  const container = document.getElementById("studentInfo");

  if (!container || !student) {
    return;
  }

  container.innerHTML = `
    <h3 class="h5 mb-3">Autor</h3>
    <p class="mb-1"><strong>Nome:</strong> ${student.name}</p>
    <p class="mb-1"><strong>Matrícula:</strong> ${student.registration}</p>
    <p class="mb-1"><strong>Disciplina:</strong> ${student.course}</p>
    <p class="mb-0">${student.bio}</p>
  `;
}

function renderFeaturedCarousel(items) {
  const inner = document.getElementById("featuredCarouselInner");
  const indicators = document.getElementById("featuredCarouselIndicators");

  if (!inner || !indicators) {
    return;
  }

  const featuredAlbums = items.filter((album) => album.featured);

  inner.innerHTML = featuredAlbums
    .map((album, index) => `
      <article class="carousel-item ${index === 0 ? "active" : ""}">
        <div class="carousel-background" style="background-image: url(${album.coverImage})"></div>
        <div class="carousel-content">
          <div class="carousel-info">
            <h3>${album.title}</h3>
            <p class="carousel-artist">${album.singer}</p>
            <p><strong>Inspiração:</strong> ${album.inspiration}</p>
            <p>${album.shortDescription || album.description}</p>
            <a href="details.html?id=${album.id}" class="carousel-link">Ver detalhes</a>
          </div>
        </div>
      </article>
    `)
    .join("");

  indicators.innerHTML = featuredAlbums
    .map((_, index) => `
      <button
        type="button"
        data-bs-target="#featuredCarousel"
        data-bs-slide-to="${index}"
        class="${index === 0 ? "active" : ""}"
        aria-label="Slide ${index + 1}"
        aria-current="${index === 0 ? "true" : "false"}"
      ></button>
    `)
    .join("");
}

async function init() {
  const grid = document.getElementById("albumsGrid");

  try {
    const [items, student] = await Promise.all([fetchItems(), fetchStudent()]);
    renderFeaturedCarousel(items);
    renderCards(items);
    renderStudentInfo(student);
  } catch (error) {
    if (grid) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger mb-0">${error.message}</div>
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", init);
