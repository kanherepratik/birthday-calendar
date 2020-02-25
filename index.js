document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    let data = [];
    const updateBtn = document.getElementById("update-btn");
    updateBtn.addEventListener("click", () => {
      data = JSON.parse(document.querySelector("#json-data").value);
      const yearInputValue = parseInt(
        document.getElementById("year-input").value
      );
      const result = filterDataByDay(data, yearInputValue);
      fillBirthdays(result);
    });

    const fillBirthdays = birthdayData => {
      Object.keys(birthdayData).forEach(day => {
        const dayDiv = document.getElementById(day);
        if (dayDiv.hasChildNodes()) {
          dayDiv.innerHTML = "";
          return false;
        }
        birthdayData[day].forEach(({ name }) => {
          const boxDiv = document.createElement("div");
          boxDiv.setAttribute("class", "box");
          boxDiv.setAttribute(
            "style",
            `width:${getNumberOfBox(
              birthdayData[day].length
            )}%;height: ${getNumberOfBox(
              birthdayData[day].length
            )}%;background-color:${getRandomColor()}`
          );
          boxDiv.innerHTML = name;
          dayDiv.appendChild(boxDiv);
        });
      });
    };

    // filter and prepare data by day
    const filterDataByDay = (data, inputYear) => {
      if (!data.length) {
        return false;
      }
      const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const requiredData = data
        .filter(
          ({ birthday }) => new Date(birthday).getFullYear() === inputYear
        )
        .reduce((acc, cur) => {
          const date = new Date(cur.birthday).getDate();
          const month = new Date(cur.birthday).getMonth() + 1;
          const year = new Date(cur.birthday).getFullYear();
          const dateObj = new Date(year, month - 1, date);
          const day = daysOfWeek[dateObj.getDay()];
          acc[day] = (acc[day] || []).concat({
            name: cur.name
              .split(" ")
              .map(x => x[0].toUpperCase())
              .join(""),
            birthday: dateObj
          });
          return acc;
        }, {});
      return sortByAge(requiredData);
    };

    // sort the data in each day by age (youngest first)
    const sortByAge = data => {
      let resultData = {};
      Object.keys(data).map(weekDay => {
        resultData[weekDay] = data[weekDay].sort(
          ({ birthday: ba }, { birthday: bb }) =>
            new Date(bb).getTime() - new Date(ba).getTime()
        );
      });
      return resultData;
    };

    const getNumberOfBox = n =>
      100 / Math.sqrt(Math.pow(Math.ceil(Math.sqrt(n)), 2));
    const getRandomColor = () => {
      var lum = -0.25;
      var hex = String(
        "#" +
          Math.random()
            .toString(16)
            .slice(2, 8)
            .toUpperCase()
      ).replace(/[^0-9a-f]/gi, "");
      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      var rgb = "#",
        c,
        i;
      for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
      }
      return rgb;
    };
    // "#" + (((1 << 24) * Math.random()) | 0).toString(16);
  }
};
