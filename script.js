document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cidade-form");
    const input = document.getElementById("cidade");
    const tabelaContainer = document.getElementById("tabela-horarios");

    // Função para buscar os horários com base no nome da cidade
    async function buscarHorarios(cidade) {
        if (!cidade) return;

        try {
            // Obter a latitude e longitude da cidade
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cidade}`);
            const geoData = await geoResponse.json();
            if (geoData.length === 0) {
                tabelaContainer.innerHTML = "Cidade não encontrada.";
                return;
            }

            const lat = geoData[0].lat;
            const lon = geoData[0].lon;

            // Obter os horários de oração com base na latitude e longitude, usando o método 3 (Umm al-Qura)
            const prayerResponse = await fetch(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=6`);
            const prayerData = await prayerResponse.json();

            if (!prayerData.data) {
                tabelaContainer.innerHTML = "Não foi possível obter os horários de oração.";
                return;
            }

            // Gerar a tabela de horários
            gerarTabela(prayerData.data);
        } catch (error) {
            tabelaContainer.innerHTML = "Erro ao buscar os dados.";
        }
    }

    // Quando o formulário é submetido, buscar os horários
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const cidade = input.value.trim();
        buscarHorarios(cidade);
    });

    // Função para gerar a tabela de horários
    function gerarTabela(horarios) {
        let tabelaHTML = "<h2>Horários de Oração</h2>";
        tabelaHTML += "<table border='1'>";
        tabelaHTML += "<tr><th>Data</th><th>Fajr</th><th>Dhuhr</th><th>Asr</th><th>Maghrib</th><th>Isha</th></tr>";

        horarios.forEach(dia => {
            const oracoes = dia.timings;
            tabelaHTML += ` 
                <tr>
                    <td>${dia.date.gregorian.date}</td>
                    <td>${oracoes.Fajr}</td>
                    <td>${oracoes.Dhuhr}</td>
                    <td>${oracoes.Asr}</td>
                    <td>${oracoes.Maghrib}</td>
                    <td>${oracoes.Isha}</td>
                </tr>
            `;
        });

        tabelaHTML += "</table>";
        tabelaContainer.innerHTML = tabelaHTML;
    }

    // Chamar a função de buscarHorarios automaticamente para a cidade de São Paulo
    buscarHorarios("São Paulo");
});
