let scores = {
  Cartago: 0,
  Hipona: 0,
  Milan: 0,
  Tagaste: 0
};

const scoreCartago = document.getElementById("scoreCartago");
const scoreHipona = document.getElementById("scoreHipona");
const scoreMilan = document.getElementById("scoreMilan");
const scoreTagaste = document.getElementById("scoreTagaste");

function lanzarConfeti() {
  confetti({
    particleCount: 80,
    startVelocity: 40,
    spread: 360,
    origin: { y: 0.6 }
  });
}

document.getElementById("btnCartago").addEventListener("click", () => {
  scores.Cartago++;
  scoreCartago.textContent = scores.Cartago;
  updateChart();
  lanzarConfeti();
});

document.getElementById("btnHipona").addEventListener("click", () => {
  scores.Hipona++;
  scoreHipona.textContent = scores.Hipona;
  updateChart();
  lanzarConfeti();
});

document.getElementById("btnMilan").addEventListener("click", () => {
  scores.Milan++;
  scoreMilan.textContent = scores.Milan;
  updateChart();
  lanzarConfeti();
});

document.getElementById("btnTagaste").addEventListener("click", () => {
  scores.Tagaste++;
  scoreTagaste.textContent = scores.Tagaste;
  updateChart();
  lanzarConfeti();
});

const ctx = document.getElementById("barChart").getContext("2d");
const barChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Cartago", "Hipona", "Milán", "Tagaste"],
    datasets: [{
      label: "Puntos",
      data: [scores.Cartago, scores.Hipona, scores.Milan, scores.Tagaste],
      backgroundColor: ["green", "blue", "red", "yellow"]
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }
});

function updateChart() {
  barChart.data.datasets[0].data = [
    scores.Cartago,
    scores.Hipona,
    scores.Milan,
    scores.Tagaste
  ];
  barChart.update();
}