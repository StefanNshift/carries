let firebaseConfig = {
	apiKey: "AIzaSyBM86VHgV1DFkvty7easa9qwZO9AuJvrvY",
	authDomain: "carriers-83992.firebaseapp.com",
	projectId: "carriers-83992",
	databaseURL: "https://carriers-83992-default-rtdb.firebaseio.com/",
	storageBucket: "carriers-83992.appspot.com",
	messagingSenderId: "799916691615",
	appId: "1:799916691615:web:58510a6ad18bb4bc60d2aa",
};
firebase.initializeApp(firebaseConfig);
document.getElementById("loginBtn").addEventListener("click", function() {
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
		// Inloggning lyckades
		document.getElementById("loginForm").style.display = "none";
		document.getElementById("mainContent").style.display = "block";
	}).catch((error) => {
		$("#wrongPass").show();
		$("#wrongPass").text("Access Denied");
	});
});
// Lyssna på användarstatus
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// Användare är inloggad
		document.getElementById("loginForm").style.display = "none";
		document.getElementById("mainContent").style.display = "block";
	} else {
		// Användare är inte inloggad
		document.getElementById("mainContent").style.display = "none";
		document.getElementById("loginForm").style.display = "block";
	}
});
// Logga ut funktion
function logout() {
	firebase.auth().signOut().then(() => {
		document.getElementById("mainContent").style.display = "none";
		document.getElementById("loginForm").style.display = "block";
	}).catch((error) => {});
}
let messagesRef = firebase.database().ref("Collected Data");
document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
	e.preventDefault();
	let carrier = getInputVal("carrier");
	let carrierConceptID = getInputVal("carrierConceptID");
	let cis = getInputVal("cis");
	if (cis === undefined || cis === null || cis.trim() === "") {
		cis = "All";
	}
	if (carrierConceptID === undefined || carrierConceptID === null || carrierConceptID.trim() === "") {
		carrierConceptID = "";
	}
	let cistransmart = getInputVal("cistransmart");
	let cisdelivery = getInputVal("cisdelivery");
	let cistms = getInputVal("cistms");
	let cpm = getInputVal("cpm");
	let tam = getInputVal("tam");
	let group = getInputVal("group");
	let team = getInputVal("team");
	let tier = parseFloat(getInputVal("tier"));
	saveMessage(carrier, carrierConceptID, cis, cistransmart, cisdelivery, cistms, cpm, tam, team, tier, group);
	document.getElementById("contactForm").reset();
}

function getInputVal(id) {
	return document.getElementById(id).value;
}

function saveMessage(carrier, carrierConceptID, cis, cistransmart, cisdelivery, cistms, cpm, tam, team, tier, group) {
	console.log(tier);
	let newMessageRef = messagesRef.push();
	newMessageRef.set({
		carrier: carrier,
		carrierConceptID: carrierConceptID,
		cis: cis,
		cistransmart: cistransmart,
		cisdelivery: cisdelivery,
		cistms: cistms,
		cpm: cpm,
		tam: tam,
		team: team,
		tier: tier,
		group: group,
	});
}
messagesRef.on("value", function(snapshot) {
	let carrierList = document.getElementById("carrierList1");
	let carrierList1 = document.getElementById("carrierList");
	let html = ""; // Accumulate HTML content for grouped carriers
	let html1 = ""; // Accumulate HTML content for all carriers
	let data = [];
	snapshot.forEach(function(childSnapshot) {
		let carrierData = childSnapshot.val();
		data.push({
			id: childSnapshot.key,
			tier: parseInt(carrierData.tier),
			...carrierData,
		});
	});
	data.sort((a, b) => a.tier - b.tier);
	let groups = {}; // Object to store rows grouped by group
	data.forEach((carrierData) => {
		if (carrierData.group !== null && carrierData.group !== undefined && carrierData.group !== "undefined" && carrierData.group !== "") {
			if (!groups[carrierData.group]) {
				groups[carrierData.group] = [];
			}
			groups[carrierData.group].push(carrierData);
		}
	});
	data.forEach((carrierData) => {
		// For carriers without a group, add them to html1 directly
		html1 += `<tr data-carrier-id="${carrierData.id}" class="${carrierData.team === "Mafia" ? "team-Mafia" : "team-Jelly-bear"
            }">
                <td><span>${carrierData.carrier
            }</span><input type="text" class="form-control edit-carrier" style="display:none;" value="${carrierData.carrier
            }"></td>
                <td><span>${carrierData.carrierConceptID || ""
            }</span><input type="number" class="form-control edit-carrierConceptID" style="display:none;" value="${carrierData.carrierConceptID || ""
            }"></td>
                <td><span>${carrierData.cis || ""
            }</span><input type="text" class="form-control edit-cis" style="display:none;" value="${carrierData.cis || ""
            }"></td>
                <td><span>${carrierData.cistransmart || ""
            }</span><input type="text" class="form-control edit-cistransmart" style="display:none;" value="${carrierData.cistransmart || ""
            }"></td>
                <td><span>${carrierData.cisdelivery || ""
            }</span><input type="text" class="form-control edit-cisdelivery" style="display:none;" value="${carrierData.cisdelivery || ""
            }"></td>
                <td><span>${carrierData.cistms || ""
            }</span><input type="text" class="form-control edit-cistms" style="display:none;" value="${carrierData.cistms || ""
            }"></td>
                <td><span>${carrierData.cpm || ""
            }</span><input type="text" class="form-control edit-cpm" style="display:none;" value="${carrierData.cpm || ""
            }"></td>
                <td><span>${carrierData.tam || ""
            }</span><input type="text" class="form-control edit-tam" style="display:none;" value="${carrierData.tam || ""
            }"></td>
                <td>
                    <span>${carrierData.team}</span>
                    <select class="form-control team-select" style="display:none; width:100px">
                        <option value="Mafia" ${carrierData.team === "Mafia" ? "selected" : ""
            }>Mafia</option>
                        <option value="Jelly Bears" ${carrierData.team === "Jelly Bears" ? "selected" : ""
            }>Jelly Bears</option>
                    </select>
                </td>
                <td>
                    <span>${carrierData.tier}</span>
                    <select class="form-control tier-select" style="display:none; width:100px">
                        <option value="1" ${typeof carrierData.tier === "number" &&
                carrierData.tier === 1
                ? "selected"
                : ""
            }>1</option>
                        <option value="2" ${typeof carrierData.tier === "number" &&
                carrierData.tier === 2
                ? "selected"
                : ""
            }>2</option>
                        <option value="3" ${typeof carrierData.tier === "number" &&
                carrierData.tier === 3
                ? "selected"
                : ""
            }>3</option>
                    </select>
                </td>
                <td><span>${carrierData.group || ""
            }</span><input type="text" class="form-control group-select" style="display:none;" value="${carrierData.group || ""
            }"></td>

                <td style="width:30px"><button class="button-warning pure-button  edit-btn ">Edit</button></td>
                <td><button class="button-error pure-button  delete-btn" >Delete</button></td>
                <td><button class="button-success pure-button save-btn" style="display: none;">Save</button></td>
            </tr>`;
	});
	// Construct HTML for grouped carriers
	Object.keys(groups).forEach((group) => {
		let groupRows = groups[group];
		let groupHtml = "";
		groupRows.forEach((carrierData) => {
			groupHtml += `<tr data-carrier-id="${carrierData.id}" class="${carrierData.team === "Mafia" ? "team-Mafia" : "team-Jelly-bear"
                }">
                    <td><span>${carrierData.carrier
                }</span><input type="text" class="form-control edit-carrier" style="display:none;" value="${carrierData.carrier
                }"></td>
                    <td><span> ${carrierData.carrierConceptID || "Not Specified"
                }</span><input type="number" class="form-control edit-carrierConceptID" style="display:none;" value="${carrierData.carrierConceptID || ""
                }"></td>
                    <td><span>${carrierData.cis || "Not Specified"
                }</span><input type="text" class="form-control edit-cis" style="display:none;" value="${carrierData.cis || ""
                }"></td>
                <td><span>${carrierData.cistransmart || "Not Specified"
                }</span><input type="text" class="form-control edit-cistransmart" style="display:none;" value="${carrierData.cistransmart || ""
                }"></td>
                <td><span>${carrierData.cisdelivery || "Not Specified"
                }</span><input type="text" class="form-control edit-cisdelivery" style="display:none;" value="${carrierData.cisdelivery || ""
                }"></td>
                <td><span>${carrierData.cistms || "Not Specified"
                }</span><input type="text" class="form-control edit-cistms" style="display:none;" value="${carrierData.cistms || ""
                }"></td>
                <td><span>${carrierData.cpm || "Not Specified"
                }</span><input type="text" class="form-control edit-cpm" style="display:none;" value="${carrierData.cpm || ""
                }"></td>
                <td><span>${carrierData.tam || "Not Specified"
                }</span><input type="text" class="form-control edit-tam" style="display:none;" value="${carrierData.tam || ""
                }"></td>
                    <td>
                        <span>${carrierData.team}</span>
                        <select class="form-control team-select" style="display:none; width:100px">
                            <option value="Mafia" ${carrierData.team === "Mafia" ? "selected" : ""
                }>Mafia</option>
                            <option value="Jelly Bears" ${carrierData.team === "Jelly Bears"
                    ? "selected"
                    : ""
                }>Jelly Bears</option>
                        </select>
                    </td>
                    <td>
                        <span>${carrierData.tier}</span>
                        <select class="form-control tier-select" style="display:none; width:100px">
                            <option value="1" ${typeof carrierData.tier === "number" &&
                    carrierData.tier === 1
                    ? "selected"
                    : ""
                }>1</option>
                            <option value="2" ${typeof carrierData.tier === "number" &&
                    carrierData.tier === 2
                    ? "selected"
                    : ""
                }>2</option>
                            <option value="3" ${typeof carrierData.tier === "number" &&
                    carrierData.tier === 3
                    ? "selected"
                    : ""
                }>3</option>
                        </select>
                    </td>

                  
                </tr>`;
		});
		html += `<tr class="group-row" data-group="${group}">
            <td colspan="12">
                <button style="margin-bottom:10px; width:100%" class="toggle-btn"> ${group}</button>
                <table class="group-table" style="display: none;">
                    <thead>
                        <tr>
                            <th>Carrier</th>
                            <th>Concept ID</th>
                            <th>CIS - Ship</th>
                            <th>CIS - Transmart</th>
                            <th>CIS - Delivery</th>
                            <th>CIS - TMS</th>
                            <th>​Carrier Partner Manager</th>
                            <th>​Technical Account Lead </th>
                            <th>Team</th>
                            <th>Tier</th>
                        </tr>
                    </thead>
                    ${groupHtml}
                </table>
            </td>
        </tr>`;
	});
	// Set HTML content for grouped carriers in carrierList
	carrierList.innerHTML = html;
	// Add event listener to toggle group rows for carrierList
	carrierList.querySelectorAll(".toggle-btn").forEach((button) => {
		button.addEventListener("click", function() {
			let groupRow = this.closest(".group-row");
			let groupTable = groupRow.querySelector(".group-table");
			groupTable.style.display = groupTable.style.display === "none" ? "table" : "none";
		});
	});
	// Set HTML content for all carriers in carrierList1
	carrierList1.innerHTML = html1;
});
document.getElementById("tableFilter").addEventListener("keyup", function() {
	var filterValue = this.value.toLowerCase();
	var rows = document.getElementById("carrierList").getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var carrierCell = row.getElementsByTagName("td")[0]; // Antag att 'carrier' är i första kolumnen
		var conceptIDCell = row.getElementsByTagName("td")[1]; // Antag att 'carrierConceptID' är i andra kolumnen
		if (carrierCell && conceptIDCell) {
			var carrierText = carrierCell.textContent || carrierCell.innerText;
			var conceptIDText = conceptIDCell.textContent || conceptIDCell.innerText;
			if (carrierText.toLowerCase().indexOf(filterValue) > -1 || conceptIDText.toLowerCase().indexOf(filterValue) > -1) {
				row.style.display = ""; // Visa raden
			} else {
				row.style.display = "none"; // Dölj raden
			}
		}
	}
});
document.addEventListener("click", function(e) {
	if (e.target && e.target.matches(".edit-btn")) {
		if (document.querySelector("tr.editing")) {
			return;
		}
		let row = e.target.closest("tr");
		row.classList.add("editing");
		row.querySelector(".edit-btn").style.display = "none";
		row.querySelector(".save-btn").style.display = "block";
		let spans = row.querySelectorAll("span");
		let inputs = row.querySelectorAll("input, select");
		spans.forEach((span) => (span.style.display = "none"));
		inputs.forEach((input) => (input.style.display = "block"));
		row.querySelector(".delete-btn").style.display = "block"; // Visa delete-knappen
	}
	if (e.target && e.target.matches(".save-btn")) {
		let row = e.target.closest("tr");
		let carrierId = row.getAttribute("data-carrier-id");
		let carrier = row.querySelector(".edit-carrier").value;
		let carrierConceptID = row.querySelector(".edit-carrierConceptID").value;
		let cis = row.querySelector(".edit-cis").value;
		let cistransmart = row.querySelector(".edit-cistransmart").value;
		let cisdelivery = row.querySelector(".edit-cisdelivery").value;
		let cistms = row.querySelector(".edit-cistms").value;
		let cpm = row.querySelector(".edit-cpm").value;
		let tam = row.querySelector(".edit-tam").value;
		let team = row.querySelector(".team-select").value;
		let tier = row.querySelector(".tier-select").value;
		let group = row.querySelector(".group-select").value;
		updateMessage(carrierId, {
			carrier,
			carrierConceptID,
			cis,
			cistransmart,
			cisdelivery,
			cistms,
			cpm,
			tam,
			team,
			tier,
			group,
		});
		row.classList.remove("editing");
		row.querySelector(".edit-btn").style.display = "block";
		row.querySelector(".save-btn").style.display = "none";
		let spans = row.querySelectorAll("span");
		let inputs = row.querySelectorAll("input, select");
		spans.forEach((span) => (span.style.display = "inline"));
		inputs.forEach((input) => (input.style.display = "none"));
		row.querySelector(".delete-btn").style.display = "none";
	}
	if (e.target && e.target.matches(".delete-btn")) {
		let row = e.target.closest("tr");
		let carrierId = row.getAttribute("data-carrier-id");
		deleteMessage(carrierId);
		row.remove();
	}
});

function deleteMessage(id) {
	messagesRef.child(id).remove();
	toastr.success("Carrier Deleted", {
		timeOut: 1000
	});
}

function updateMessage(id, data) {
	data.tier = parseFloat(data.tier);
	messagesRef.child(id).update(data);
	toastr.success(data.carrier + " " + "Updated", {
		timeOut: 1000
	});
}