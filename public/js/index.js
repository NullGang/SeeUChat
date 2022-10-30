const container = document.getElementById("container");

function generate(n) {
    var add = 1, max = 12 - add;
    
    if ( n > max ) {
            return generate(max) + generate(n - max);
    }
    
    max        = Math.pow(10, n+add);
    var min    = max/10; 
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;

    return ("" + number).substring(add);
}


function joinOld() {
    const room = localStorage.getItem("room-generated")
    window.location.href = "/" + room;
}

function joinroom() {
  const room = generate(16);
  window.location.href = "/" + room;
  localStorage.setItem("room-generated", room)
}


  if(localStorage.getItem("room-generated")) {
  container.innerHTML += `
  <div class="roomanterior">
  <h1 class="roomant">There is an old room saved in the storage. Want to join again to that room?</span>
      <a onclick="joinOld()" class="JoinOld">Join that room</a>
</div>
  `
  }
