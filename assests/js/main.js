document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  /* // Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
//api key ZVNFbIm2Om6jiCZZDb53g1NQtfcXmHFHWnnhBI9G
//nasa https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY


// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}*/
});
class Day {
  constructor(date, temp, humidity, icon) {
    this.date = date;
    this.temp = temp;
    this.humidity = humidity;
    this.icon = icon;
  }
}

Vue.component("week-day", {
  props: ["day"],
  template: `  <div class="col s12 m5  ">
            <div class="white-text blue darken-3 tn-card-2 ">
              <div class="row">
                <h6 class="day top-padding">{{day.date}}</h6>
              </div>
              <div class="row">
                <img class="day" :src="day.icon" alt="weather icon" />
              </div>
              <div class="row">
                <p class="day">temperature: {{day.temp}} &#176;F</p>
              </div>
              <div class="row">
                <p class="day">humidity: {{day.humidity}}</p>
              </div>
            </div>
          </div>`
});

var app = new Vue({
  el: "#app",
  data: {
    found: false,
    error: false,
    src: null,
    pastcities: null,
    city: "",
    strcity: "",
    temp: "",
    wind: "",
    humidity: "",
    uv: "",
    uvcolor: "",
    todayDate: "",
    fiveDay: []
  },
  mounted() {
    //  let temp = "01d";
    // this.src = `http://openweathermap.org/img/wn/${temp}@2x.png`;
    if (localStorage.getItem("pastcities")) {
      this.pastcities = JSON.parse(localStorage.getItem("pastcities"));
    }
    this.todayDate = moment().format("L"); // 02/08/2020
  },
  methods: {
    search: function() {
      this.strcity = this.city;
      this.city = "";
      if (!localStorage.getItem("pastcities") && this.pastcities == null) {
        this.pastcities = [];
        this.pastcities.push(this.strcity);
        localStorage.setItem("pastcities", JSON.stringify(this.pastcities));
      } else if (
        this.pastcities.length > 0 &&
        !this.checkPast(this.pastcities, this.strcity)
      ) {
        this.pastcities.push(this.strcity.toLowerCase());
        localStorage.setItem("pastcities", JSON.stringify(this.pastcities));
      }
      if (this.fiveDay.length > 0) {
        this.fiveDay = [];
      }

      if (this.error == true) {
        this.error == false;
      }

      this.getData(this.strcity);
      console.log(this.strcity);
    },
    checkPast: function(ar, val) {
      if (ar.find(element => element === val)) {
        return true;
      } else {
        return false;
      }
    },
    pastSearch: function(val) {
      if (this.fiveDay.length > 0) {
        this.fiveDay = [];
        this.uv = "";
        this.temp = "";
        this.humidity = "";
        this.src = "";
      }
      this.strcity = val;

      this.getData(val);
      console.log(val);
    },
    getFiveday: function() {
      let d1 = moment().add(1, "days");
      let d2 = moment().add(2, "days");
      let d3 = moment().add(3, "days");
      let d4 = moment().add(4, "days");
      let d5 = moment().add(5, "days");
      let day1 = d1.format("L");
      let day2 = d2.format("L");
      let day3 = d3.format("L");
      let day4 = d4.format("L");
      let day5 = d5.format("L");
      let encode = encodeURI(this.strcity);
      let url = `http://api.openweathermap.org/data/2.5/forecast?q=${encode}&appid=b51c5cf48dfe074805925189e16717b6`;
      //icons this.src = `http://openweathermap.org/img/wn/${object.weather[0].icon}@2x.png`;
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(object => {
          console.log("uv data below");
          console.log(object);
          let list = object.list;
          for (let i = 0; i < list.length; i++) {
            if (i == 3) {
              let day = new Day(
                day1,
                this.convertTemp(list[i].main.temp),
                list[i].main.humidity,
                `http://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`
              );
              this.fiveDay.push(day);
            } else if (i == 11) {
              let dy2 = new Day(
                day2,
                this.convertTemp(list[i].main.temp),
                list[i].main.humidity,
                `http://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`
              );
              this.fiveDay.push(dy2);
            } else if (i == 19) {
              let dy3 = new Day(
                day3,
                this.convertTemp(list[i].main.temp),
                list[i].main.humidity,
                `http://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`
              );
              this.fiveDay.push(dy3);
            } else if (i == 27) {
              let dy4 = new Day(
                day4,
                this.convertTemp(list[i].main.temp),
                list[i].main.humidity,
                `http://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`
              );
              this.fiveDay.push(dy4);
            } else if (i == 35) {
              let dy5 = new Day(
                day5,
                this.convertTemp(list[i].main.temp),
                list[i].main.humidity,
                `http://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`
              );
              this.fiveDay.push(dy5);
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.error = true;
        });
    },

    getUv: function(lat, lon) {
      let url = `http://api.openweathermap.org/data/2.5/uvi?appid=b51c5cf48dfe074805925189e16717b6&lat=${lat}&lon=${lon}`;
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(object => {
          /*
          uv needs lat long give in  city search so call one before the other
          1-2 green #388e3c green darken-2
          3-5 yellow #ffeb3b yellow
          6-7 orange #fb8c00 orange darken-1
          9-10 red #c62828 red darken-3
          11+ purple #6a1b9a purple darken-3
          5day takes city name too contains all of the stuff y oun eed
          (Kvalue − 273.15) × 9/5 + 32 = F
          */
          let val = object.value;
          if (val < 3) {
            this.uvcolor = "#388e3c";
          } else if (val >= 3 && val < 6) {
            this.uvcolor = "#ffeb3b";
          } else if (val >= 6 && val < 8) {
            this.uvcolor = "#fb8c00";
          } else if (val >= 8 && val < 11) {
            this.uvcolor = "#c62828";
          } else {
            this.uvcolor = "#6a1b9a";
          }
          this.uv = val;
          console.log(object);
        })
        .catch(error => {
          console.log(error);
          this.uv = "problem getting data";
        });
    },
    convertTemp: function(kal) {
      let f = ((kal - 273.15) * (9 / 5) + 32).toFixed(2);
      console.log(f);
      return f;
    },
    getData: function(str) {
      let encode = encodeURI(str);
      console.log(str);
      console.log(encode);

      let url = `http://api.openweathermap.org/data/2.5/weather?q=${encode}&appid=b51c5cf48dfe074805925189e16717b6`;
      console.log(url);

      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(object => {
          console.log(object);

          this.temp = this.convertTemp(object.main.temp);
          this.wind = object.wind.speed;
          this.humidity = object.main.humidity;
          this.src = `http://openweathermap.org/img/wn/${object.weather[0].icon}@2x.png`;
          this.getUv(object.coord.lat, object.coord.lon);
          this.getFiveday();
          this.found = true;
        })
        .catch(error => {
          console.log(error);
          this.error = true;
          this.found = false;
        });
    }
  }
});
