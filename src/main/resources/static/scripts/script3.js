function isTokenValid() {
  const token = localStorage.getItem('token');
  if (token){
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(atob(base64));
    const iat = decodedPayload.iat;
    const exp = decodedPayload.exp;

    if ((exp-iat) < 0)
    {
      window.location.href = 'http://127.0.0.1:5500/src/main/resources/static/index.html';
    }
  }
  else{
    window.location.href = 'http://127.0.0.1:5500/src/main/resources/static/index.html';
  }
}
isTokenValid();

function redirectTo(url){
  window.location.href = url;
}

let idCount=1;
async function readDataFromTable (){
  const token = localStorage.getItem('token');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = JSON.parse(atob(base64));
  const email = decodedPayload.sub;

  try {
    const response = await fetch(`http://localhost:8080/usertable/${email}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        data.forEach(aliment => {
          if (aliment.onList)
            addDataToTable(aliment);
        });
    } else {
        console.error('Eroare la obținerea datelor:', response.statusText);
        window.location.href = 'http://127.0.0.1:5500/src/main/resources/static/index.html';
    }
} 
  catch (error) {
    console.error('Eroare în timpul GET request:', error);
    window.location.href = 'http://127.0.0.1:5500/src/main/resources/static/index.html';
}

}
readDataFromTable().then(()=>colorForExpiration());

var lastIdFromApi = 1;
const alimentsArray = [];
function addDataToTable(aliment){
  
  const tableBody = document.getElementById('tableBody');
  const row = document.createElement('tr');

  if (aliment.id)
  {
    lastIdFromApi = aliment.id;
  }
  else{
    aliment.id = lastIdFromApi;
  }
  row.id = `row-${idCount}`;

  row.setAttribute('data-aliment-id', aliment.id);
  alimentsArray.push(aliment);

  const idCell = document.createElement('td');
  // idCell.textContent = idCount;
  // idCell.setAttribute('data-title', 'Nr. :')

  const listCheckBoxCell = document.createElement('a');
  listCheckBoxCell.classList.add('listCheckBox');
  listCheckBoxCell.innerHTML = '<i class="fa-regular fa-square-check"></i>';
  listCheckBoxCell.setAttribute('data-checked', 'false');
  listCheckBoxCell.addEventListener('click', ()=> checkedAlimentOnList(row.id));
  idCell.appendChild(listCheckBoxCell);
  row.appendChild(idCell);

  const numeCell = document.createElement('td');
  numeCell.textContent = aliment.nume;
  numeCell.setAttribute('data-title', 'Nume:');
  row.appendChild(numeCell);

  const expirationDateCell = document.createElement('td');
  const newExpirationDateFormat = aliment.expirationDate.split('-')[2] + '/' +
  aliment.expirationDate.split('-')[1] + '/' +
  aliment.expirationDate.split('-')[0];
  expirationDateCell.textContent = newExpirationDateFormat;
  expirationDateCell.setAttribute('data-title', 'Expira la:');
  row.appendChild(expirationDateCell);

  const unitateDeMasuraCell = document.createElement('td');
  unitateDeMasuraCell.textContent = aliment.unitateMasura;
  unitateDeMasuraCell.setAttribute('data-title', 'U.M. : ');
  row.appendChild(unitateDeMasuraCell);

  const cantitateCell = document.createElement('td');
  cantitateCell.textContent = aliment.cantitate;
  cantitateCell.setAttribute('data-title', 'Cantitate:')
  row.appendChild(cantitateCell);

  const actionsCell = document.createElement('td');
  actionsCell.classList.add('select');

  const deleteButton = document.createElement('a');
  deleteButton.classList.add('button');
  deleteButton.innerHTML = '<i class="fa-regular fa-trash-can" style="color: #ffffff;"></i>';
  deleteButton.addEventListener('click', () => deleteRow(aliment, row.id));
  actionsCell.appendChild(deleteButton);

  actionsCell.appendChild(document.createTextNode(' '));

  const editButton = document.createElement('a');
  editButton.classList.add('button');
  editButton.innerHTML = '<i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i>';
  editButton.addEventListener('click', (event) => openEditModal(event, aliment, idCell.textContent));
  actionsCell.appendChild(editButton);

  row.appendChild(actionsCell);

  console.log(idCount);
  console.log(lastIdFromApi);
  idCount++;
  tableBody.appendChild(row);
}

window.addEventListener("load", function() {

  function addYearsToDropdown(years) {
    var currentYear = new Date().getFullYear();

    if (years && years.options.length === 1 && years.options[0].value === "pickyear") {
      years.options.length = 0;

      for (var i = 0; i < 10; i++) {
        var option = document.createElement("option");
        option.text = currentYear + i;
        option.value = currentYear + i;
        years.add(option);
      }
    }
  }

  function addMothsToDropDown(months){
    if (months && months.options.length === 1 && months.options[0].value === "pickmonth"){
      months.options.length = 0;
      for (var i = 0; i < 12; i++)
      {
        //var monthDate = new Date(2000, i, 1);
        //var monthName = monthDate.toLocaleString("default", {month: 'long'});
        var monthName = (i + 1).toString().padStart(2, '0');
        var option = document.createElement("option");
        option.text = monthName;
        option.value = monthName;
        months.add(option);
      }
    }
  }

  function addDaysToDropDown(year, month, days) {
    days.innerHTML = "";

    var daysInMonth = new Date(year, months.selectedIndex + 1, 0).getDate();
    
    for (var i = 1; i <= daysInMonth; i++) {
      var option = document.createElement("option");
      option.text = i.toString().padStart(2, '0');;
      option.value = i.toString().padStart(2, '0');;
      days.add(option);
    }
  }
  
  var years = document.getElementById("year");
  var months = document.getElementById("month");
  var days = document.getElementById("day");

  document.getElementById("year").addEventListener("click", function() {
    addYearsToDropdown(years);
    addDaysToDropDown(years.value, months.value, days);
  });
  
  document.getElementById("month").addEventListener("click", function() {
    addMothsToDropDown(months);
    addDaysToDropDown(years.value, months.value, days);
  });

  var edityears = document.getElementById("edit-year");
  var editmonths = document.getElementById("edit-month");
  var editdays = document.getElementById("edit-day");

  addYearsToDropdown(edityears);
  addMothsToDropDown(editmonths);
  addDaysToDropDown(edityears.value, editmonths.value, editdays);
});

function colorForExpiration(){
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody.getElementsByTagName('tr');
  const notifiedItems = JSON.parse(localStorage.getItem('notifiedItems')) || [];
  let delay = 100;
  for (let i = 0; i < rows.length; i++) {
    const expCell = rows[i].getElementsByTagName('td')[2];
    const [day, month, year] = expCell.textContent.split('/');
    const dateString = `${month}/${day}/${year}`;
    const dateFromExpCell = new Date(Date.parse(dateString));
    const currentDate = new Date();
    console.log(rows[i].id);
    if ((dateFromExpCell.getTime() - currentDate.getTime()) < 0)
    {
      rows[i].classList.remove('about_to_expire');
      rows[i].classList.add('expired');

      if (!notifiedItems.includes(rows[i].id)) {
        setTimeout(() => {
          createNotification(`Alimentul : ${rows[i].querySelector('td:nth-child(2)').textContent}`, 'a expirat :(');
          notifiedItems.push(rows[i].id);
          localStorage.setItem('notifiedItems', JSON.stringify(notifiedItems));
        }, delay);
      }
    }
    else if((dateFromExpCell.getTime() - currentDate.getTime()) < 86400000)
    {
      rows[i].classList.remove('expired');
      rows[i].classList.add('about_to_expire');

      if (!notifiedItems.includes(rows[i].id)) {
        setTimeout(() => {
          createNotification(`Alimentul : ${rows[i].querySelector('td:nth-child(2)').textContent}`, 'va expira intr-o zi !');
          notifiedItems.push(rows[i].id);
          localStorage.setItem('notifiedItems', JSON.stringify(notifiedItems));
        }, delay);
      }
    }
    else
    {
      rows[i].classList.remove('expired');
      rows[i].classList.remove('about_to_expire');
    }
  }
}


function validateInput() {
  var cantitateInput = document.getElementById('cantitateInput');
  var cantitateValue = cantitateInput.value;

  if (cantitateValue !=='' && !/^[1-9]\d*$/.test(cantitateValue)) {
    alert('Please enter a positive integer for Cantitate.');
    cantitateInput.value = '';
  }
}

function submitForm(clickedElement) {
  var nume = document.getElementById('nume').value;
  var year = document.getElementById('year').value;
  var month = document.getElementById('month').value;
  var day = document.getElementById('day').value;
  var unitateMasura = document.getElementById('unitateMasura').value;
  var cantitate = document.getElementById('cantitateInput').value;

  const token = localStorage.getItem('token');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = JSON.parse(atob(base64));
  const email = decodedPayload.sub;

  if (!nume || !year || !month || !day || !unitateMasura || !cantitate) {
    alert('Please fill in all fields.');
    return;
  }

  var formData = {
    email : email,
    id : 0,
    nume: nume,
    expirationDate: year + '-' + month + '-' + day,
    unitateMasura: unitateMasura,
    cantitate: cantitate,
    onList: 1
  };

  console.log(formData);
  fetch('http://localhost:8080/usertable/${email}/adauga', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  }).then(data =>{
    lastIdFromApi = parseInt(data);
    addDataToTable(formData);
    colorForExpiration();
    closeModalAfterWork(clickedElement);
  })
}

function closeModal(clickedElement) {
  const parentDiv = clickedElement.parentNode.parentNode;
  parentDiv.style.visibility = 'hidden';
  parentDiv.style.opacity = '0';
  document.getElementById('filter').disabled = false;
}

function closeModalAfterWork(clickedElement) {
  const parentDiv = clickedElement.parentNode.parentNode.parentNode;
  parentDiv.style.visibility = 'hidden';
  parentDiv.style.opacity = '0';
  document.getElementById('filter').disabled = false;
}

function openAdaugaModal(){
  document.getElementById('demo-modal').style.visibility = 'visible';
  document.getElementById('demo-modal').style.opacity = '1';
  document.getElementById('filter').disabled = true;
}


var alimentToEdit;
var idToEdit;
function openEditModal(event, aliment, idWhereToEdit) {
  event.preventDefault();
  alimentToEdit = aliment;
  console.log(idWhereToEdit);
  idToEdit = idWhereToEdit;

  console.log(idToEdit);
  document.getElementById('edit-nume').value = aliment.nume;
  
  const expirationDate = new Date(aliment.expirationDate);
  document.getElementById('edit-year').value = expirationDate.getFullYear().toString();
  document.getElementById('edit-month').value = (expirationDate.getMonth() + 1).toString().padStart(2, '0');
  document.getElementById('edit-day').value = expirationDate.getDate().toString().padStart(2, '0');

  document.getElementById('edit-unitateMasura').value = aliment.unitateMasura;
  document.getElementById('edit-cantitateInput').value = aliment.cantitate;

  document.getElementById('edit-modal').style.visibility = 'visible';
  document.getElementById('edit-modal').style.opacity = '1';
}

function submitEditForm(clickedElement){
  var nume = document.getElementById('edit-nume').value;
  var year = document.getElementById('edit-year').value;
  var month = document.getElementById('edit-month').value;
  var day = document.getElementById('edit-day').value;
  var unitateMasura = document.getElementById('edit-unitateMasura').value;
  var cantitate = document.getElementById('edit-cantitateInput').value;

  const token = localStorage.getItem('token');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = JSON.parse(atob(base64));
  const email = decodedPayload.sub;

  if (!nume || !year || !month || !day || !unitateMasura || !cantitate) {
    alert('Please fill in all fields.');
    return;
  }

  var formData = {
    email : email,
    id : alimentToEdit.id,
    nume: nume,
    expirationDate: year + '-' + month + '-' + day,
    unitateMasura: unitateMasura,
    cantitate: cantitate,
    onList : true
  };

  fetch('http://localhost:8080/usertable/${email}/update', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('works');
    alimentToEdit.nume = formData.nume;
    alimentToEdit.expirationDate = formData.expirationDate;
    alimentToEdit.unitateMasura = formData.unitateMasura;
    alimentToEdit.cantitate = formData.cantitate;
    updateTableRow(formData);
    colorForExpiration();
    closeModalAfterWork(clickedElement);
  })
}

function updateTableRow(newData) {
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const idCell = rows[i].getElementsByTagName('td')[0];
    const rowAlimentId = idCell.textContent;
    if (rowAlimentId === idToEdit) {
      let notifiedItems = JSON.parse(localStorage.getItem('notifiedItems')) || [];
      notifiedItems = notifiedItems.filter(item => item !== `row-${idToEdit}`);
      localStorage.setItem('notifiedItems', JSON.stringify(notifiedItems));

      const numeCell = rows[i].getElementsByTagName('td')[1];
      numeCell.textContent = newData.nume;
      const expirationDateCell = rows[i].getElementsByTagName('td')[2];
      const newExpirationDateFormat = newData.expirationDate.split('-')[2] + '/' +
      newData.expirationDate.split('-')[1] + '/' +
      newData.expirationDate.split('-')[0];
      expirationDateCell.textContent = newExpirationDateFormat;
      const unitateDeMasuraCell = rows[i].getElementsByTagName('td')[3];
      unitateDeMasuraCell.textContent = newData.unitateMasura;
      const cantitateCell = rows[i].getElementsByTagName('td')[4];
      cantitateCell.textContent = newData.cantitate;
      break;
    }
  }
}

function deleteRow(aliment, idRow){
  const token = localStorage.getItem('token');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = JSON.parse(atob(base64));
  const email = decodedPayload.sub;
  const id = aliment.id;

  console.log(aliment, id);
  console.log(tableBody.innerHTML);

  try {
    fetch(`http://localhost:8080/usertable/${email}/sterge/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response =>{
      if (response.ok) {
        const row = document.getElementById(idRow);
        row.remove();
        idCount--;

        let notifiedItems = JSON.parse(localStorage.getItem('notifiedItems')) || [];
        notifiedItems = notifiedItems.filter(item => item !== idRow);
        localStorage.setItem('notifiedItems', JSON.stringify(notifiedItems));

      } else {
        console.error('Error deleting row:', response.statusText);
      }
    })
  } catch (error) {
    console.error('Error during DELETE request:', error);
  }
}


function createNotification(title, message) {
  var notificationContainer = document.getElementById('notification-container');

  var notificationPopup = document.createElement('div');
  notificationPopup.className = 'notification-popup';
  
  var notificationMessage = document.createElement('span');
  notificationMessage.innerHTML = `<strong>${title}</strong><br>${message}`;
  
  var closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.addEventListener('click', () => notificationContainer.removeChild(notificationPopup));
  closeButton.className = 'close-notification';

  notificationPopup.appendChild(notificationMessage);
  notificationPopup.appendChild(closeButton);
  notificationContainer.appendChild(notificationPopup);

  notificationPopup.style.display = 'block';

}

function searchForName(){
  let filter = document.getElementById('filter').value.toUpperCase();
  let tableRecord = document.getElementById('tableRecord');
  let tr = tableRecord.getElementsByTagName('tr');

  for (var i = 1; i < tr.length; i++){
    let td = tr[i].getElementsByTagName('td')[1];

    if (td){
      let textvalue = td.textContent || td.innerHTML;

      if (textvalue.toUpperCase().indexOf(filter) > -1){
        tr[i].style.display = "";
      }else{
        tr[i].style.display = "none";
      }
    }
  }
}

function searchForSpoiled(checkbox){
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody.getElementsByTagName('tr');
  const spioledCheckBox = document.getElementById('showSpoiled');
  const aboutToSpoilCheckBox = document.getElementById('showAboutToSpoil');
  for (var i = 0; i < rows.length; i++){
    const expCell = rows[i].getElementsByTagName('td')[2];
    const [day, month, year] = expCell.textContent.split('/');
    const dateString = `${month}/${day}/${year}`;
    const dateFromExpCell = new Date(Date.parse(dateString));
    const currentDate = new Date();
    const timeDifference = dateFromExpCell.getTime() - currentDate.getTime();
    if (spioledCheckBox.checked && aboutToSpoilCheckBox.checked){
      if (timeDifference > 86400000){
        rows[i].style.display = "none";
      } else {
        rows[i].style.display = "";
      }
    } else if (spioledCheckBox.checked) {
      if (timeDifference > 0){
        rows[i].style.display = "none";
      } else {
        rows[i].style.display = "";
      }
    } else if (aboutToSpoilCheckBox.checked){
      if (timeDifference > 86400000 || timeDifference < 0){
        rows[i].style.display = "none";
      } else {
        rows[i].style.display = "";
      }
    } else {
      rows[i].style.display="";
    }
  }
}

function checkedAlimentOnList(rowId){
  const row = document.getElementById(rowId);
  const checkCell = row.querySelector('.listCheckBox');
  const currentState = checkCell.getAttribute('data-checked');
  if (currentState == 'false') {
    checkCell.setAttribute('data-checked', 'true'); 
    checkCell.innerHTML = '<i class="fa-solid fa-square-check"></i>';
    verifyIfAbleToAdd();
  } else {
    checkCell.setAttribute('data-checked', 'false');
    checkCell.innerHTML= '<i class="fa-regular fa-square-check"></i>';
    verifyIfAbleToAdd();
  }
}

function verifyIfAbleToAdd(){
  const tableBody = document.getElementById('tableBody');
  const rows = tableBody.getElementsByTagName('tr');
  var canTransfer = false;
  for (var i = 0; i< rows.length; i++){
    var checkedState = rows[i].querySelector('.listCheckBox').getAttribute('data-checked');
    if (checkedState == 'true'){
      canTransfer = true;
      document.getElementById('addToFridgeButton').setAttribute('canTransfer', 'true');
      document.getElementById('addToFridgeButton').classList.add('active');
    }
  }
  if (canTransfer == false){
    document.getElementById('addToFridgeButton').setAttribute('canTransfer', 'false');
    document.getElementById('addToFridgeButton').classList.remove('active');
  }
}

function addToMyFridge(){
  const checkIfCanTransfer = document.getElementById('addToFridgeButton').getAttribute('canTransfer');
  if (checkIfCanTransfer == "true"){
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++){
      var checkedState = rows[i].querySelector('.listCheckBox').getAttribute('data-checked');
      if (checkedState == 'true'){
        var alimentId = rows[i].getAttribute('data-aliment-id');
        const selectedAliment = alimentsArray.find(aliment => aliment.id === parseInt(alimentId));
        console.log(selectedAliment);
        addAlimentToMyFridge(selectedAliment);
        rows[i].remove();
      }
    }
  }
}

async function addAlimentToMyFridge(alimentToAddToFridge){
  alimentToAddToFridge.onList = false;
  const token = localStorage.getItem('token');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = JSON.parse(atob(base64));
  const email = decodedPayload.sub;

  fetch('http://localhost:8080/usertable/${email}/update', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alimentToAddToFridge)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    verifyIfAbleToAdd()
  })

}

// function createNotification(title, message) {
//   if (Notification.permission === 'granted') {
//     new Notification(title, { body: message });
//   } else if (Notification.permission !== 'denied') {
//     Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         new Notification(title, { body: message });
//       }
//     });
//   }
// }
// function requestNotificationPermission() {
//   if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
//     Notification.requestPermission();
//   }
// }
// requestNotificationPermission();
