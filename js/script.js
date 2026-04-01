const machines = {

tractor: [
{name:"Mahindra Tractor", price:"₹800/hour", location:"Village A"},
{name:"Sonalika Tractor", price:"₹750/hour", location:"Village B"}
],

harvester: [
{name:"Wheat Harvester", price:"₹1500/hour", location:"Village C"},
{name:"Rice Harvester", price:"₹1400/hour", location:"Village D"}
],

sugarcane: [
{name:"Sugarcane Cutter 1", price:"₹2000/hour", location:"Village E"},
{name:"Sugarcane Cutter 2", price:"₹2100/hour", location:"Village F"}
],

jcb: [
{name:"JCB Loader", price:"₹1800/hour", location:"Village G"},
{name:"JCB Excavator", price:"₹1700/hour", location:"Village H"}
],
drone: [
{name:"Agricopter AG 365", price:"₹2500/hour", location:"Nearby Village", img:"images/drone.png"}
],

sprayer: [
{name:"STIHL SR430", price:"₹500/hour", location:"Village Equipment Center", img:"images/sprayer.png"}
],

};

const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const list = document.getElementById("machineList");

if(machines[type]){

machines[type].forEach(machine=>{

const div = document.createElement("div");
div.className="card";

div.innerHTML = `
<div>
<h3>${machine.name}</h3>
<p>${machine.price}</p>
<p>${machine.location}</p>
</div>

<button onclick="bookMachine('${machine.name}')">Book</button>
`;

list.appendChild(div);

});

}
function bookMachine(machine){

let name = localStorage.getItem("tempName") || "Not Provided";
let mobile = localStorage.getItem("tempMobile") || "Not Provided";
let date = localStorage.getItem("tempDate");
let acres = localStorage.getItem("tempAcres");

if(!date){
alert("Please search properly before booking");
return;
}

let priceList = {
"Mahindra Tractor": 800,
"Sonalika Tractor": 750
};

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

let newBooking = {
machine: machine,
name: name,
mobile: mobile,
date: date,
acres: acres,
rate: priceList[machine] || 0,
status: "Confirmed"
};

bookings.push(newBooking);

localStorage.setItem("bookings", JSON.stringify(bookings));

alert("Booking Successful!");

window.location.href="bookings.html";

}

// LOGOUT FUNCTION
function logout(){
localStorage.clear();
alert("Logged out successfully");
window.location.href="index.html";
}

function searchTractor(){

let name = document.getElementById("name").value;
let mobile = document.getElementById("mobile").value;
let acres = document.getElementById("acres").value;
let date = document.getElementById("date").value;

if(!date){
alert("Please select date");
return;
}

// Save data temporarily
localStorage.setItem("tempName", name);
localStorage.setItem("tempMobile", mobile);
localStorage.setItem("tempAcres", acres);
localStorage.setItem("tempDate", date);

// Go to results
window.location.href="results.html?type=tractor";

}