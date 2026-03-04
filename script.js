let contactList = [];
let editingId = null;
let activeLetter = "All";
let sortType = "AZ";

/* Load from storage */
function loadContacts() {
  let data = localStorage.getItem("myContacts");
  contactList = data ? JSON.parse(data) : [];
}

/* Save to storage */
function storeContacts() {
  localStorage.setItem("myContacts", JSON.stringify(contactList));
}

/* opeining popup */
document.getElementById("openFormBtn").onclick = function () {
  editingId = null;
  showPopup();
};

function showPopup() {
  document.getElementById("formPopup").style.display = "flex";
}

function hidePopup() {
  document.getElementById("formPopup").style.display = "none";
  clearForm();
}

/* Clear form */
function clearForm() {
  inputName.value = "";
  inputPhone.value = "";
  inputEmail.value = "";
}

/* Save contact */
saveContact.onclick = function () {
  let name = inputName.value.trim();
  let phone = inputPhone.value.trim();
  let email = inputEmail.value.trim();

  if (name === "" || phone === "") {
    alert("Name and phone required");
    return;
  }

  if (!/^[A-Za-z]+$/.test(name)) {
    alert("Name should contain only alphabets");
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  if (editingId) {
    let person = contactList.find((x) => x.id === editingId);
    person.name = name;
    person.phone = phone;
    person.email = email;
  } else {
    contactList.push({
      id: Date.now(),
      name: name,
      phone: phone,
      email: email,
      favourite: false,
    });
  }

  storeContacts();
  hidePopup();
  updateUI();
};

closePopup.onclick = hidePopup;

/* Delete */
function removeContact(id) {
  contactList = contactList.filter((x) => x.id !== id);
  storeContacts();
  updateUI();
}

/* Edit */
function editContact(id) {
  let person = contactList.find((x) => x.id === id);
  editingId = id;
  inputName.value = person.name;
  inputPhone.value = person.phone;
  inputEmail.value = person.email;
  showPopup();
}

/* Favourite */
function markFavourite(id) {
  let person = contactList.find((x) => x.id === id);
  person.favourite = !person.favourite;
  storeContacts();
  updateUI();
}

/* Filter letter */
document.querySelectorAll(".letter").forEach((btn) => {
  btn.onclick = function () {
    activeLetter = btn.dataset.value;
    updateUI();
  };
});

/* Search */
searchBox.oninput = updateUI;

/* Sort */
btnAZ.onclick = function () {
  sortType = "AZ";
  btnAZ.classList.add("active");
  btnZA.classList.remove("active");
  updateUI();
};

btnZA.onclick = function () {
  sortType = "ZA";
  btnZA.classList.add("active");
  btnAZ.classList.remove("active");
  updateUI();
};

/* Update UI */
function updateUI() {
  let data = [...contactList];

  if (activeLetter !== "All") {
    data = data.filter((c) => c.name.toUpperCase().startsWith(activeLetter));
  }

  let text = searchBox.value.toLowerCase();
  data = data.filter((c) => c.name.toLowerCase().includes(text));

  if (sortType === "AZ") {
    data.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    data.sort((a, b) => b.name.localeCompare(a.name));
  }

  totalCount.innerText = data.length + " Contacts";

  miniList.innerHTML = "";
  favContainer.innerHTML = "";
  allContainer.innerHTML = "";

  let hasFav = false;

  let grouped = {};
  data.forEach((c) => {
    let firstLetter = c.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(c);
  });

  for (let letter in grouped) {
    allContainer.innerHTML += `<h3>${letter}</h3>`;

    grouped[letter].forEach((c) => {
      let html = `
            <div class="card">
                <div>
                    <h4>${c.name}</h4>
                    <p>${c.phone}</p>
                    <p>${c.email}</p>
                </div>
                <div class="card-actions">
                    <a href="tel:${c.phone}">
                        <button>📞</button>
                    </a>
                    <button onclick="markFavourite(${c.id})">⭐</button>
                    <button onclick="editContact(${c.id})">✏️</button>
                    <button onclick="removeContact(${c.id})">🗑️</button>
                    
                </div>
            </div>
            `;

      if (c.favourite) {
        hasFav = true;
        favContainer.innerHTML += html;
      }
      allContainer.innerHTML += html;

      miniList.innerHTML += `
                <div class="small-item">
                    <strong>${c.name}${c.favourite ? " ⭐" : ""}</strong>
                    <div>${c.phone}</div>
                </div>
            `;
    });
    if (!hasFav) {
      favContainer.style.display = "none";
      favHeading.style.display = "none";
    } else {
      favContainer.style.display = "block";
      favHeading.style.display = "block";
    }
  }
}
/* Start */
loadContacts();
updateUI();