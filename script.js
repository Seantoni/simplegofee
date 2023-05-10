document.getElementById("inputForm").addEventListener("submit", function (event) {
    event.preventDefault();
    calculateResults();
});

function calculateResults() {
    const usuarioMes1 = parseInt(document.getElementById("usuarioMes1").value);
    const crecimiento = parseFloat(document.getElementById("crecimiento").value) / 100;
    const feeSimpleGo = parseFloat(document.getElementById("feeSimpleGo").value) / 100;
    const ticketPromedio = parseFloat(document.getElementById("ticketPromedio").value);

    let results = [];

    for (let i = 1; i <= 12; i++) {
        let usuarios = Math.floor(usuarioMes1 * Math.pow(1 + crecimiento, i - 1));
        let ingresoBruto = Math.floor(usuarios * ticketPromedio);
        let simpleGoFee = Math.floor(ingresoBruto * feeSimpleGo);

        results.push({
            mes: i,
            usuarios: usuarios,
            ingresoBruto: ingresoBruto,
            simpleGoFee: simpleGoFee
        });
    }

    displayResults(results);
    displayInvestmentAndGrossIncome(results);
    enableDownloadCSV(results);
}

function displayResults(results) {
    const resultsBody = document.getElementById("resultsBody");

    while (resultsBody.firstChild) {
        resultsBody.removeChild(resultsBody.firstChild);
    }

    results.forEach(result => {
        let row = document.createElement("tr");

        Object.values(result).forEach((value, index) => {
            let cell = document.createElement("td");

            if (index === 2 || index === 3) {
                cell.textContent = `$${value}`;
            } else {
                cell.textContent = value;
            }

            row.appendChild(cell);
        });

        resultsBody.appendChild(row);
    });

    document.getElementById("resultsTable").hidden = false;
}

function displayInvestmentAndGrossIncome(results) {
    let investment6Months = results.slice(0, 6).reduce((acc, result) => acc + result.simpleGoFee, 0);
    let investment12Months = results.reduce((acc, result) => acc + result.simpleGoFee, 0);

    let grossIncome6Months = results.slice(0, 6).reduce((acc, result) => acc + result.ingresoBruto, 0);
    let grossIncome12Months = results.reduce((acc, result) => acc + result.ingresoBruto, 0);

    const investmentBody = document.getElementById("investmentBody");

    while (investmentBody.firstChild) {
        investmentBody.removeChild(investmentBody.firstChild);
    }

    const periodData = [
        {
            period: "Primeros 6 meses",
            grossIncome: grossIncome6Months,
            investment: investment6Months
        },
        {
            period: "Primeros 12 meses",
            grossIncome: grossIncome12Months,
            investment: investment12Months,
        }
    ];

    periodData.forEach(data => {
        let row = document.createElement("tr");
        Object.values(data).forEach(value => {
            let cell = document.createElement("td");
            cell.textContent = typeof value === "number" ? `$${value}` : value;
            row.appendChild(cell);
        });
        investmentBody.appendChild(row);
    });

    document.getElementById("investmentResults").hidden = false;
}

function enableDownloadCSV(results) {
    const downloadCSVButton = document.getElementById("downloadCSV");
    downloadCSVButton.hidden = false;
    downloadCSVButton.onclick = () => downloadCSV(results);
}

function downloadCSV(results) {
    let csvContent = "Mes,Usuarios,Ingreso Bruto,SimpleGo Fee\n";

    results.forEach(result => {
        csvContent += `${result.mes},${result.usuarios},$${result.ingresoBruto},$${result.simpleGoFee}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "SimpleGo_Fee_Calculator.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
