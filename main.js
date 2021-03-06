window.onload = function () {
  // Global selector
  let url = "https://api.rootnet.in/covid19-in/stats/latest";
  let url2 = "https://api.rootnet.in/covid19-in/stats/testing/latest";
  let url3 = "https://api.rootnet.in/covid19-in/stats/history";
  let url4 = "https://api.rootnet.in/covid19-in/stats/testing/history";
  let update = document.querySelector(".update");
  let confirmedNo = document.querySelector(".confirmed-no");
  let RecoveredNo = document.querySelector(".Recovered-no");
  let DeceasedNo = document.querySelector(".Deceased-no");
  let TestedNo = document.querySelector(".Tested-no");
  let table1 = document.querySelector(".my-table");
  let btn1 = document.querySelector(".btn-1");
  let btn2 = document.querySelector(".btn-2");
  let div1 = document.querySelector(".div1");
  let div2 = document.querySelector(".div2");
  // tabs selector
  btn2.addEventListener("click", () => {
    div2.style.left = "0%";
    div1.style.left = "-100%";
    btn1.classList.remove("active");
    btn2.classList.add("active");
  });
  btn1.addEventListener("click", () => {
    div2.style.left = "100%";
    div1.style.left = "0%";
    btn1.classList.add("active");
    btn2.classList.remove("active");
  });
  // Function to add chart on site
  function getChartData(
    data,
    total,
    id,
    backgroundColor,
    borderColor,
    para,
    type
  ) {
    var ctx = document.getElementById(id).getContext("2d");
    var myChart = new Chart(ctx, {
      type: type,
      data: {
        labels: data,
        datasets: [
          {
            label: para,
            data: total,
            fill: false,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                callback: function (label, index, labels) {
                  return label / 1000 + "k";
                },
                beginAtZero: true,
              },
            },
          ],
        },
        title: {
          display: true,
          text: para,
          fontSize: 20,
        },
        legend: {
          display: false,
          labels: {
            fontColor: "red",
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          },
        },
        tooltips: {
          enabled: true,
        },
      },
    });
  }
  // asynchronous function to fetch the data from api
  async function getData() {
    // const response = await fetch("corona.json");
    const response = await fetch(url);
    const data1 = await response.json();

    // const response1 = await fetch("test.json");
    const response1 = await fetch(url2);
    const data2 = await response1.json();

    // const response2 = await fetch("daily.json");
    const response2 = await fetch(url3);
    const data3 = await response2.json();

    // const response3 = await fetch("dailytesting.json");
    const response3 = await fetch(url4);
    const data4 = await response3.json();

    let update1 = data1.lastRefreshed;
    // Adding all data on site
    let newUpdate = update1.replace("T", " at ").slice(0, 19);
    update.innerHTML = newUpdate;

    confirmedNo.innerHTML = data1.data.summary.total;
    RecoveredNo.innerHTML = data1.data.summary.discharged;
    DeceasedNo.innerHTML = data1.data.summary.deaths;
    TestedNo.innerHTML = data2.data.totalSamplesTested;

    let regional = data1.data.regional;
    // Adding total confirmed,recovered and deaths data on table
    for (var i = 0; i < regional.length; i++) {
      var row = `
        <tr>
        <td>${regional[i].loc}</td>
        <td>${regional[i].totalConfirmed}</td>
        <td>${regional[i].discharged}</td>
        <td>${regional[i].deaths}</td>
        </tr>
        `;
      table1.innerHTML += row;
    }
    // Adding data on charts according to their types

    // Total confirmed
    let date = [];
    let total = [];
    let dTotal = [];
    let dates = data3.data;
    dates.forEach((item) => {
      date.push(item.day);
    });
    dates.forEach((item) => {
      total.push(item.summary.total);
    });
    var id1 = "myChartTC";
    getChartData(
      date,
      total,
      id1,
      "red",
      "black",
      "Total : " + data1.data.summary.total,
      "line"
    );
    // Total confirmed daily
    for (var i = 1; i < dates.length; i++) {
      let newTotal = dates[i].summary.total - dates[i - 1].summary.total;
      dTotal.push(newTotal);
    }
    var id1 = "myChartTD";
    getChartData(date, dTotal, id1, "red", "black", "Total", "bar");
    // Total deaths
    let death = [];
    let dDeath = [];
    dates.forEach((item) => {
      death.push(item.summary.deaths);
    });
    var id2 = "myChartDC";
    getChartData(
      date,
      death,
      id2,
      "black",
      "black",
      "Deceased : " + data1.data.summary.deaths,
      "line"
    );
    // Total deaths daily
    for (var i = 1; i < dates.length; i++) {
      let newTotal = dates[i].summary.deaths - dates[i - 1].summary.deaths;
      dDeath.push(newTotal);
    }
    var id2 = "myChartDD";
    getChartData(date, dDeath, id2, "black", "black", "Deceased", "bar");

    // Total recovered
    let discharged = [];
    let dDischarged = [];
    dates.forEach((item) => {
      discharged.push(item.summary.discharged);
    });
    var id3 = "myChartRC";
    getChartData(
      date,
      discharged,
      id3,
      "green",
      "black",
      "Recovered : " + data1.data.summary.discharged,
      "line"
    );
    // Total recovered daily
    for (var i = 1; i < dates.length; i++) {
      let newTotal =
        dates[i].summary.discharged - dates[i - 1].summary.discharged;
      dDischarged.push(newTotal);
    }
    var id3 = "myChartRD";
    getChartData(date, dDischarged, id3, "green", "black", "Recovered", "bar");

    // Total confirmed
    let date1 = [];
    let testing = [];
    let dTesting = [];
    let dates1 = data4.data;
    dates1.forEach((item) => {
      date1.push(item.day);
    });
    dates1.forEach((item) => {
      testing.push(item.totalSamplesTested);
    });
    var id1 = "myChartTestC";
    getChartData(
      date1,
      testing,
      id1,
      "blue",
      "black",
      "testing : " + data2.data.totalSamplesTested,
      "line"
    );
    // Total confirmed daily
    // for (var i = 1; i < dates1.length; i++) {
    //   let newTesting =
    //     dates1[i].totalSamplesTested - dates1[i - 1].totalSamplesTested;
    //   dTesting.push(newTesting);
    // }
    // var id1 = "myChartTestD";
    // getChartData(date, dTesting, id1, "red", "black", "Total", "bar");
  }

  getData();
};
