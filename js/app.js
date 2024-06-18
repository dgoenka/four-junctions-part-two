const form = document.getElementById("numarraycollectionform");

function handleFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const { numarray } = Object.fromEntries(data.entries());
  const tank_schema_profile = numarray
    .split(",")
    .map((item) => ({ wall_height: Number(item), waterHeight: 0 }));
  //console.log("Before: " + JSON.stringify(tank_schema_profile, null, 2));
  let firstHighIndex = tank_schema_profile.findIndex(
    (item) => item.wall_height > 0,
  );
  let lastHighIndex = tank_schema_profile.findLastIndex(
    (item) => item.wall_height > 0,
  );
  for (let i = firstHighIndex; i <= lastHighIndex; i++) {
    let hasGoneDown = false;
    let hasGoneBackUp = false;
    let containerStart = i;
    let containerStartWallHeight = tank_schema_profile[i].wall_height;
    let containerEnd = null;
    let containerMaxLevel = 0;
    for (let j = i + 1; j <= lastHighIndex; j++) {
      console.log("\nj is: " + j);
      let item = tank_schema_profile[j];
      console.log("item is:\n" + JSON.stringify(item, null, 2));
      let previousItem = tank_schema_profile[j - 1];
      console.log("previousItem is:\n" + JSON.stringify(previousItem, null, 2));
      let current_item_wall_height = item.wall_height;
      console.log("current_item_wall_height: " + current_item_wall_height);
      let previous_item_wall_height = previousItem.wall_height;
      console.log("previous_item_wall_height: " + previous_item_wall_height);
      console.log("hasGoneDown before is: " + hasGoneDown);
      console.log("hasGoneBackUp before is: " + hasGoneBackUp);
      if (current_item_wall_height < previous_item_wall_height) {
        if (hasGoneDown && hasGoneBackUp) break;
        else if (!hasGoneDown) {
          console.log("region start detected");
          containerStart = j;
          containerStartWallHeight = previous_item_wall_height;
          hasGoneDown = true;
        }
      } else if (
        current_item_wall_height > previous_item_wall_height &&
        hasGoneDown
      ) {
        console.log("region end detected");
        hasGoneBackUp = true;
        containerEnd = j;
        containerMaxLevel = Math.min(
          containerStartWallHeight,
          current_item_wall_height,
        );
        console.log("containerMaxLevel : " + containerMaxLevel);
      }
      console.log("hasGoneDown after is: " + hasGoneDown);
      console.log("hasGoneBackUp after is: " + hasGoneBackUp);
    }
    if (hasGoneDown && hasGoneBackUp) {
      console.log("setting water levels ");
      for (let j = containerStart; j < containerEnd; j++) {
        let item = tank_schema_profile[j];
        item.waterHeight = containerMaxLevel - item.wall_height;
        console.log("set item.waterHeight as : " + item.waterHeight);
        console.log("item is :\n" + JSON.stringify(item, null, 2));
      }
      i = containerEnd - 1;
      console.log(`Set i as ${i}\n\n\n`);
    }
  }
  console.log("After: " + JSON.stringify(tank_schema_profile, null, 2));
  createWaterTankTableGrid(tank_schema_profile);
}

function createWaterTankTableGrid(data) {
  let maxHeight = 0;
  data.forEach((column) => {
    if (column.wall_height > maxHeight) {
      maxHeight = column.wall_height;
    }
  });
  maxHeight += 2;

  const table = document.getElementById("explainer_table");
  table.innerHTML = "";
  const colors = {
    air: "transparent",
    wall: "#C19A6B",
    water: "#DEF4FC",
  };

  let totalWater = 0;
  data.forEach((column) => {
    totalWater += column.waterHeight;
  });

  // Iterate through each data object
  for (let i = maxHeight; i > 0; i--) {
    const row = document.createElement("tr"); // Create a table row
    for (let j = 0; j < data.length; j++) {
      // Create cells for wall and water (combined)
      const columnData = data[j];
      const cell = document.createElement("td");
      cell.innerHTML = " ";
      cell.style.height = "20px";
      cell.style.width = "80px";
      let part = "air";
      if (i > columnData.wall_height + columnData.waterHeight) {
        part = "air";
      } else if (
        i <= columnData.wall_height + columnData.waterHeight &&
        i > columnData.wall_height
      ) {
        part = "water";
      } else if (i <= columnData.wall_height) {
        part = "wall";
      }
      cell.style.backgroundColor = colors[part];
      row.appendChild(cell);
    }
    // Append the row to the table
    table.appendChild(row);
  }

  const text = document.getElementById("count_text");
  text.innerHTML = `The total water stored will be ${totalWater} units`;
}

form.addEventListener("submit", handleFormSubmit);
