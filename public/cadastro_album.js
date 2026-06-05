const API_URL = "http://localhost:3000";
const COLLECTION = "albums";

function readTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function showFeedback(message, type = "success") {
  const feedback = document.getElementById("formFeedback");

  if (!feedback) {
    return;
  }

  feedback.className = `alert alert-${type}`;
  feedback.textContent = message;
  feedback.hidden = false;
}

function buildAlbumPayload(form) {
  const data = new FormData(form);
  const coverImage = data.get("coverImage").trim();

  return {
    title: data.get("title").trim(),
    singer: data.get("singer").trim(),
    year: Number(data.get("year")),
    genre: data.get("genre").trim(),
    country: data.get("country").trim(),
    inspiration: data.get("inspiration").trim(),
    tracks: Number(data.get("tracks")),
    price: data.get("price").trim(),
    shortDescription: data.get("shortDescription").trim(),
    description: data.get("description").trim(),
    coverImage,
    featured: data.get("featured") === "on",
    tags: readTags(data.get("tags")),
    photos: [
      {
        id: 1,
        title: "Imagem principal",
        image: coverImage
      }
    ]
  };
}

async function createAlbum(album) {
  const response = await fetch(`${API_URL}/${COLLECTION}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(album)
  });

  if (!response.ok) {
    throw new Error("Não foi possível cadastrar o álbum.");
  }

  return response.json();
}

function initAlbumForm() {
  const form = document.getElementById("albumForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const album = await createAlbum(buildAlbumPayload(form));
      showFeedback("Álbum cadastrado com sucesso.");
      form.reset();
      setTimeout(() => {
        window.location.href = `details.html?id=${album.id}`;
      }, 700);
    } catch (error) {
      showFeedback(error.message, "danger");
    }
  });
}

document.addEventListener("DOMContentLoaded", initAlbumForm);
