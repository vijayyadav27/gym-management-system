// -------------------------
// 🔹 Firebase Configuration
// -------------------------
const firebaseConfig = {
   apiKey: "AIzaSyCGiZsbYfb-Oio2Frzaiokzy6WmfGfsXfU",
  authDomain: "gym-management-system-39ab9.firebaseapp.com",
  projectId: "gym-management-system-39ab9",
  storageBucket: "gym-management-system-39ab9.firebasestorage.app",
  messagingSenderId: "549267095595",
  appId: "1:549267095595:web:2ea8fede182df43571aa6e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// -------------------------
// 🔹 Elements
// -------------------------
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginStatus = document.getElementById("loginStatus");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const adminSection = document.getElementById("admin-section");
const memberName = document.getElementById("memberName");
const memberEmail = document.getElementById("memberEmail");
const addMemberBtn = document.getElementById("addMemberBtn");
const memberList = document.getElementById("memberList");

// -------------------------
// 🔑 Login Function
// -------------------------
loginBtn.addEventListener("click", () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(user => {
      loginStatus.innerText = "✅ Logged in as " + user.user.email;
      adminSection.classList.remove("hidden"); // Show admin panel
      loadMembers();
    })
    .catch(err => loginStatus.innerText = err.message);
});

// -------------------------
// 🆕 Register Function
// -------------------------
registerBtn.addEventListener("click", () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(user => {
      loginStatus.innerText = "✅ Registered as " + user.user.email;
      adminSection.classList.remove("hidden"); // Show admin panel
    })
    .catch(err => loginStatus.innerText = err.message);
});

// -------------------------
// ➕ Add Member Function
// -------------------------
addMemberBtn.addEventListener("click", () => {
  const name = memberName.value;
  const email = memberEmail.value;

  if(name === "" || email === "") {
    alert("Please fill all fields");
    return;
  }

  db.collection("members").add({
    name: name,
    email: email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("✅ Member Added");
    memberName.value = "";
    memberEmail.value = "";
    loadMembers();
  }).catch(err => alert(err.message));
});

// -------------------------
// 📋 Load Members Function
// -------------------------
function loadMembers() {
  memberList.innerHTML = "<h3>Members:</h3>";
  db.collection("members").orderBy("createdAt", "desc").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "member-card";
        div.innerHTML = <strong>${data.name}</strong> - ${data.email};
        memberList.appendChild(div);
      });
    })
    .catch(err => console.log(err));
}

// -------------------------
// 🔄 Auto-load if logged in
// -------------------------
auth.onAuthStateChanged(user => {
  if(user){
    adminSection.classList.remove("hidden");
    loadMembers();
    loginStatus.innerText = "✅ Logged in as " + user.email;
  }
});
