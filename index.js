let data = [];
const updateBtn = document.getElementById("update-btn");
const inputYearField = document.getElementById("year-input");
let isUpdateClicked = false;

updateBtn.addEventListener("click", () => {
  // check if user is clicking the button for second time
  if (isUpdateClicked) {
    clearBirthdayCards();
    isUpdateClicked = false;
    return false;
  }
  // extract data from textarea field
  data = JSON.parse(document.querySelector("#json-data").value);
  const yearInputValue = parseInt(inputYearField.value);
  const result = filterDataByDay(data, yearInputValue);
  if (result) {
    isUpdateClicked = true;
    fillBirthdays(result);
  }
});

// reset on clicking the button for second time
const clearBirthdayCards = () => {
  const boxContainerList = document.querySelectorAll(".inner");
  for (let i = 0; i < boxContainerList.length; i++) {
    boxContainerList[i].innerHTML = "";
  }
  inputYearField.value = "";
};

// create dynamic boxes and fill in day cards
const fillBirthdays = birthdayData => {
  Object.keys(birthdayData).forEach(day => {
    const dayDiv = document.getElementById(day);
    const fragment = document.createDocumentFragment();
    // calculate number of boxes for perticular day
    if (birthdayData[day].length) {
      const requiredBoxes = getNumberOfBox(birthdayData[day].length);
      // fill box with name and set width and height
      for (let i = 0; i < requiredBoxes; i++) {
        const boxDiv = document.createElement("div");
        const boxSize = `${100 / Math.sqrt(requiredBoxes)}%`;
        const boxBackground = `${getRandomColor()}`;
        boxDiv.setAttribute("class", "box");
        if (birthdayData[day][i]) {
          boxDiv.setAttribute(
            "style",
            `background-color:${boxBackground}; width:${boxSize};height:${boxSize}`
          );
          boxDiv.innerHTML = birthdayData[day][i].name;
        } else {
          boxDiv.setAttribute("style", `width:${boxSize};height:${boxSize}`);
        }
        fragment.appendChild(boxDiv);
      }
    } else {
      const noBirthdayDiv = document.createElement("div");
      noBirthdayDiv.setAttribute("class", "no-birthday");
      noBirthdayDiv.innerHTML = "No Birthdays Today (YOLO !!)";
      fragment.appendChild(noBirthdayDiv);
    }

    dayDiv.appendChild(fragment);
  });
};

// filter and prepare data by day
const filterDataByDay = (data, inputYear) => {
  if (data.length && inputYear) {
    const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const requiredData = data
      .filter(({ birthday }) => new Date(birthday).getFullYear() === inputYear)
      .reduce((acc, cur) => {
        const date = new Date(cur.birthday).getDate();
        const month = new Date(cur.birthday).getMonth();
        const year = new Date(cur.birthday).getFullYear();
        const dateObj = new Date(year, month, date);

        // get day of birthday
        const day = daysOfWeek[dateObj.getDay()];
        acc[day] = acc[day].concat({
          name: cur.name
            .split(" ")
            .map(x => x[0].toUpperCase())
            .join(""),
          birthday: dateObj
        });
        return acc;
      }, Object.fromEntries(daysOfWeek.map(x => [x, []])));
    return sortByAge(requiredData);
  }
};

// sort the data in each day by age (youngest first)
const sortByAge = data => {
  let resultData = {};
  Object.keys(data).map(weekDay => {
    resultData[weekDay] = data[weekDay].sort(
      ({ birthday: firstBirthday }, { birthday: secondBirthday }) =>
        new Date(secondBirthday).getTime() - new Date(firstBirthday).getTime()
    );
  });
  return resultData;
};

// get number of box to be rendered for each day
const getNumberOfBox = n => Math.pow(Math.ceil(Math.sqrt(n)), 2);

// generate a random color code
const getRandomColor = () => {
  const h = Math.floor(Math.random() * 360),
    s = Math.floor(Math.random() * 100) + "%",
    l = Math.floor(Math.random() * 60) + "%";
  return `hsl(${h},${s},${l})`;
};
