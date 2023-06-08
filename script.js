class App {
  static APP_KEY = "d4fbf6f0b3mshfa55019bda09ffcp121ea0jsn1afd7456582d";
  static SEARCH_URL = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";
  static DEFAULT_HEADERS = {
    "X-RapidAPI-Key": "d4fbf6f0b3mshfa55019bda09ffcp121ea0jsn1afd7456582d",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
  };

  static searchBtn = document.querySelector("#searh-btn");
  static input = document.querySelector("#input");
  static sortByRatingBtn = document.querySelector("#sort-by-rating");
  static sectionMain = document.querySelector("#section_main");
  static defaultImg = "./image.png";
  static arrLikeTracks = [];
  static arrAllMusicGetFromServer = [];

  onInputChange() {} //можливо варто зробити динамічний пошук

  //start search
  onButtonClick() {
    console.log(App.input.value);
    this.getDataBySearch(App.input.value).then(() => {
      App.input.value = "";
      console.log("Data", this.data);
      this.renderData(this.data, App.sectionMain);
      App.arrAllMusicGetFromServer = [...this.data]; //скопіював масив усіх отриманих пісень
    });
  }

  sort() {
    App.arrAllMusicGetFromServer.sort((a,b) => a.rank - b.rank);
    this.renderData(App.arrAllMusicGetFromServer);
  }

  constructor(data = [], watchList = []) {
    this.data = data;
    this.watchList = watchList;

    App.searchBtn.onclick = this.onButtonClick.bind(this);
    App.sortByRatingBtn.onclick = this.sort.bind(this);
  }

  //get data from server
  async getDataBySearch(musicName = "") {
    try {
      const response = await fetch(App.SEARCH_URL + musicName, {
        headers: App.DEFAULT_HEADERS,
      });
      const data = await response.json();
      this.data = data.data ? data.data : [];
    } catch (err) {
      console.log(err, "Invalid quest");
      alert("Query is invalid");
    }
  }

  //render all movies
  renderData(dataToRender, outputElement = App.sectionMain){
    outputElement.innerHTML = "";
    [...dataToRender].forEach(track => {
      const {id, title, rank, preview, artist} = track;
      const {picture_small} = artist;

      outputElement.innerHTML += `<div class="music-elements">
      
        <img src="${picture_small ? picture_small : App.defaultImg}" height="100" width="100" alt="img">
        <h3>title: ${title}"</h3>
        <p>rank: ${rank}</p>
        <audio controls> <source src="${preview}"></audio>
        <button class="like-btn">Like</button>
      </div>`

      //у цьому блоці добавляю/видаляю в масиві та у local storage улюблені треки
      const allLikeBtn = document.querySelectorAll(".like-btn");
      allLikeBtn.forEach((btn, i) => {
        btn.onclick = () => {
          if(btn.textContent === "Like") {
            App.arrLikeTracks.push(dataToRender[i]);
            App.arrLikeTracks = App.arrLikeTracks.filter((el, i) => App.arrLikeTracks.indexOf(el) === i);
            this.saveInLocalStorageLikeTracks.bind(this)(App.arrLikeTracks);
            btn.textContent = "Dislike";
            console.log("like list", App.arrLikeTracks);
          }
          else{
            App.arrLikeTracks = App.arrLikeTracks.filter((el, i) => App.arrLikeTracks[i] !== el);
            console.log("dellEll", App.arrLikeTracks);
            this.saveInLocalStorageLikeTracks(App.arrLikeTracks);
            btn.textContent = "Like";
          }
        }
      })
    })
  }

  //local storage
  saveInLocalStorageLikeTracks(arr) {
    localStorage.setItem("like_music", JSON.stringify(arr));
    console.log("Successfully saved to storage");
  }
  renderWatchList() {}
}

new App();
