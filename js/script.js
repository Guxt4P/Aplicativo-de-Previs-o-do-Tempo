// js/script.js
const key = "192a3719e501b73534ed6aa2f8d0c380";

function colocardadosnaTela(dados) {
  // Se a API retornar erro (ex.: cidade não existe)
  if (dados.cod && String(dados.cod) !== "200") {
    document.querySelector(".cidade").innerHTML = "Cidade não encontrada 😢";
    document.querySelector(".temp").innerHTML = "";
    document.querySelector(".texto-previsao").innerHTML = "";
    document.querySelector(".umidade").innerHTML = "";
    document.querySelector(".img-previsao").src = "img/nuvem.png"; // fallback local
    document.querySelector(".img-previsao").alt = "sem dados";
    return;
  }

  const { name, sys, main, weather } = dados;

  document.querySelector(".cidade").innerHTML = `${name}, ${sys.country}`;
  document.querySelector(".temp").innerHTML = `${Math.round(main.temp)}°C`;
  document.querySelector(".texto-previsao").innerHTML = weather[0].description;
  document.querySelector(".umidade").innerHTML = `Umidade ${main.humidity}%`;

  // Ícone oficial da OpenWeather (opção A)
  const icon = weather[0].icon;          // ex.: "04d"
  const desc = weather[0].description;   // ex.: "nublado"
  const img = document.querySelector(".img-previsao");
  img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  // Se quiser evitar cache duro do navegador, use a linha abaixo:
  // img.src = `https://openweathermap.org/img/wn/${icon}@2x.png?cb=${Date.now()}`
  img.alt = desc;
}

async function buscarCidade(cidade) {
  const termo = (cidade || "").trim();
  if (!termo) {
    document.querySelector(".cidade").innerHTML = "Digite uma cidade para buscar.";
    return;
  }

  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(termo)}&appid=${key}&lang=pt_br&units=metric`
    );
    const dados = await resp.json();
    colocardadosnaTela(dados);
  } catch (err) {
    console.error("Erro na busca:", err);
    document.querySelector(".cidade").innerHTML = "Erro ao buscar dados 😕";
  }
}

// Mantém compatibilidade com seu botão com onclick no HTML
function cliqueiNoBotao() {
  const cidade = document.querySelector(".input-cidade").value;
  buscarCidade(cidade);
}

// Também liga eventos quando a página carrega (botão e Enter no input)
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".input-cidade");
  const botao = document.querySelector("#buscarBtn") || document.querySelector(".botao-buscar");

  if (botao) botao.addEventListener("click", () => buscarCidade(input.value));
  if (input) input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarCidade(input.value);
  });
});
