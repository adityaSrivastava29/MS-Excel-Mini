let rowNumberSection = document.querySelector(".row-number-section");

let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");

let cellSection = document.querySelector(".cell-section");
let columnTagsSection = document.querySelector(".column-tag-section");

let lastCell;
let dataObj = {};


cellSection.addEventListener("scroll", function (e) {
  rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;

  columnTagsSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`; 
  //console.log("Scrolling");
});


//inside this nested for loop we are creating individual cells UI + cell obj

for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.innerText = i;
  div.classList.add("row-number");
  rowNumberSection.append(div);
}

for (let i = 0; i < 26; i++) {
  let asciiCode = 65 + i;

  let reqAlphabet = String.fromCharCode(asciiCode);

  let div = document.createElement("div");
  div.innerText = reqAlphabet;
  div.classList.add("column-tag");
  columnTagsSection.append(div);
}

for (let i = 1; i <= 100; i++) {
  let rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  //i = 1 [A1,B1..........Z1]
  //i = 2 []
  //.
  //.
  //i = 100 [A100.........z100]

  for (let j = 0; j < 26; j++) {
    //i = 100   j = 25  asciiCode = 65+25=90  alpha = z  cellAdd = Z100
    // A to Z
    let asciiCode = 65 + j;

    let reqAlphabet = String.fromCharCode(asciiCode);

    let cellAddress = reqAlphabet + i;

    let cellDiv = document.createElement("div");


    dataObj[cellAddress] = {
      value: undefined,
      formula: undefined,
      upstream: [],
      downstream: [],
    };

   
     cellDiv.addEventListener("input", function (e) {
      // jis cell pr type kra uske attribute se maine uska cell address fetch kra
      let currCellAddress = e.currentTarget.getAttribute("data-address");
      //kuki sare cell objects dataObj me store ho rakhe h using their cell address as key
      //maine jis cell pr click krke type kra uska hi address fetch and uska hi object chahiye
      //to wo address as key use krke dataObj se fetch krlia req cellObj ko
      let currCellObj = dataObj[currCellAddress];

      currCellObj.value = e.currentTarget.innerText;
      console.log(currCellObj);
    });
   // cellDiv.contentEditable = true
    cellDiv.setAttribute("contentEditable", true);

    cellDiv.classList.add("cell");

    cellDiv.setAttribute("data-address", cellAddress);

    cellDiv.addEventListener("click", function (e) {
      if (lastCell) {
        lastCell.classList.remove("cell-selected");
      }

      e.currentTarget.classList.add("cell-selected");

      lastCell = e.currentTarget;

      let currCellAddress = e.currentTarget.getAttribute("data-address");

      formulaBarSelectedCellArea.innerText = currCellAddress;
    });

    rowDiv.append(cellDiv);
  }

  cellSection.append(rowDiv);
}

// Export to CSV functionality
const exportCsvBtn = document.getElementById('export-csv-btn');
exportCsvBtn.addEventListener('click', function () {
    // Get all rows and columns
    const numRows = 100;
    const numCols = 26;
    let csvRows = [];
    // First row: column headers (A,B,C,...)
    let header = [];
    for (let j = 0; j < numCols; j++) {
        header.push(String.fromCharCode(65 + j));
    }
    csvRows.push(header.join(","));
    // Data rows
    for (let i = 1; i <= numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            let cellAddress = String.fromCharCode(65 + j) + i;
            let cellValue = dataObj[cellAddress]?.value || "";
            // Escape quotes and commas
            cellValue = String(cellValue).replace(/"/g, '""');
            if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
                cellValue = '"' + cellValue + '"';
            }
            row.push(cellValue);
        }
        csvRows.push(row.join(","));
    }
    let csvContent = '\uFEFF' + csvRows.join("\r\n"); // Add BOM and use CRLF for compatibility
    // Download
    let blob = new Blob([csvContent], { type: 'text/csv' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sheet.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});