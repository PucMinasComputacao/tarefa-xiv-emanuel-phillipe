const API_URL = "http://localhost:3000";
const COLLECTION = "albums";
const CHART_JS_URL = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";

async function fetchAlbums() {
  const response = await fetch(`${API_URL}/${COLLECTION}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os álbuns.");
  }

  return response.json();
}

function getMainGenre(album) {
  return (album.genre || "Sem gênero").split("/")[0].trim();
}

function countAlbumsByGenre(albums) {
  return albums.reduce((accumulator, album) => {
    const genre = getMainGenre(album);
    accumulator[genre] = (accumulator[genre] || 0) + 1;
    return accumulator;
  }, {});
}

function formatAlbumCount(count) {
  return `${count} ${count === 1 ? "álbum" : "álbuns"}`;
}

function loadChartJs() {
  if (window.Chart) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHART_JS_URL;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Não foi possível carregar o ChartJS."));
    document.head.appendChild(script);
  });
}

function renderSummary(genreCounts) {
  const summary = document.getElementById("genreSummary");

  if (!summary) {
    return;
  }

  const rows = Object.entries(genreCounts)
    .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
    .map(([genre, count]) => `
      <div class="genre-row">
        <span class="genre-name">${genre}</span>
        <span class="genre-count">${formatAlbumCount(count)}</span>
      </div>
    `)
    .join("");

  summary.innerHTML = rows || '<div class="alert alert-warning mb-0">Nenhum álbum encontrado.</div>';
}

function renderChart(genreCounts) {
  const canvas = document.getElementById("genreChart");

  if (!canvas) {
    return;
  }

  const labels = Object.keys(genreCounts);
  const values = Object.values(genreCounts);

  new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#6f42c1", "#20a39e", "#f26d5b", "#f5b841", "#3d5a80", "#7ac74f", "#d81159"],
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.raw;
              return `${context.label}: ${formatAlbumCount(value)}`;
            }
          }
        }
      }
    }
  });
}

async function initOverview() {
  const summary = document.getElementById("genreSummary");

  try {
    const albums = await fetchAlbums();
    const genreCounts = countAlbumsByGenre(albums);
    await loadChartJs();
    renderChart(genreCounts);
    renderSummary(genreCounts);
  } catch (error) {
    if (summary) {
      summary.innerHTML = `<div class="alert alert-danger mb-0">${error.message}</div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", initOverview);
