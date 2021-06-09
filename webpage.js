const api_url = "https://api.covid19api.com/summary";
getData();
async function getData() {
  const reponse = await fetch(api_url);
  const data = await reponse.json();
  let countriesName = new Array();
  let totalConfirm = new Array();
  let requiredData = data["Countries"].map(
    ({
      CountryCode,
      Country,
      TotalConfirmed,
      TotalRecovered,
      TotalDeaths,
    }) => ({
      CountryCode,
      Country,
      TotalConfirmed,
      TotalRecovered,
      TotalDeaths,
    })
  );
  // console.log(requiredData);

  for (let i = 0; i < requiredData.length; i++) {
    countriesName.push(data["Countries"][i]["Country"]);
    totalConfirm.push(data["Countries"][i]["TotalConfirmed"]);
  }

  //randomize colors according to countries
  function getColors(length) {
    let pallet = [
      "#20D5D2",
      "#A11950",
      "#2ECC40",
      "#FF851B",
      "#7FDBFF",
      "#B10DC9",
      "#FFDC00",
      "#001f3f",
      "#39CCCC",
      "#01FF70",
      "#85144b",
      "#F012BE",
      "#3D9970",
      "#111111",
      "#AAAAAA",
    ];

    let colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(pallet[i % pallet.length]);
    }

    return colors;
  }

  //generating a pie chart using chart.js
  let myChart = new Chart("myChart", {
    type: "pie",

    data: {
      labels: countriesName,
      datasets: [
        {
          backgroundColor: getColors(requiredData.length),
          data: totalConfirm,
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      legend: {
        display: false,
        position: "bottom",
        align: "end",
      },
      responsive: true,
      // title: {
      //   display: true,
      //   text: "Covid-19 Global Pie Chart",
      //   fontColor: "Black",
      // },
    },
  });
  let array_chart;
  //search input
  $("#search-input").on("keypress", function (e) {
    if (e.key == "Enter") {
      let value = $(this).val();
      let data = searchInput(value, requiredData);
      array_chart = storesChart(data);
      let xlabels = [
        `Total Recovered Cases: ${array_chart[0]}`,
        `Total Confirmed Cases: ${array_chart[1]}`,
      ];
      buildTable(data);
      console.log(array_chart);
      $("#myChart").hide();
      // $("#sChart").style.poi;
      //check data entry
      // console.log(data[0]);

      let sChart = new Chart("sChart", {
        type: "pie",

        data: {
          labels: xlabels,
          datasets: [
            {
              backgroundColor: getColors(array_chart.length),
              data: array_chart,
              borderWidth: 0,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          tooltips: [{ enabled: false }],
          hover: [{ mode: null }],
          // title: {
          //   display: true,
          //   text: "Covid-19 Global Pie Chart",
          //   fontColor: "Black",
          // },
        },
      });
    }
  });
  //pre build table
  buildTable(requiredData);

  //search through table
  function searchInput(value, data) {
    let filterData = [];
    for (let i = 0; i < data.length; i++) {
      value = value.toLowerCase();
      let country_name_search = data[i].Country.toLowerCase();
      if (country_name_search.includes(value)) {
        filterData.push(requiredData[i]);
      }
    }

    return filterData;
  }

  //Contruct Table
  function buildTable(data) {
    var table = document.getElementById("mytable");
    //empty the array first
    // $("table").scrollTableBody();
    table.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
      <td class=code>${data[i].CountryCode}</td>
      <td>${data[i].Country}</td>
      <td>${data[i].TotalConfirmed}</td>
      <td>${data[i].TotalRecovered}</td>
      <td>${data[i].TotalDeaths}</td>
      
      </tr>`;
      table.innerHTML += row;
    }
  }

  function storesChart(data) {
    let filterChart = [];
    for (let i = 0; i < data.length; i++) {
      filterChart.push(data[i]["TotalRecovered"]);
      filterChart.push(data[i]["TotalConfirmed"]);
    }
    return filterChart;
  }
}
