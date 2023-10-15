// Establish a WebSocket connection with the server
const socket = io();

// Get references to HTML elements
const domainInput = document.getElementById('domainInput');
const dnsTypeSelect = document.getElementById('dnsTypeSelect');
const checkBtn = document.getElementById('checkBtn');
const resultsDiv = document.getElementById('results');

// List of DNS servers to check against
const servers = [
    "Google",
    "Cloudflare",
    "OpenDNS",
    "Quad9",
    "Verisign",
    "Comodo Secure DNS",
    "SafeDNS",
    "Yandex.DNS",
];

// Add an event listener for the Enter key press
domainInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the form submission
        checkDNS(); // Call the checkDNS function when Enter is pressed
    }
});

checkBtn.addEventListener('click', function() {
    checkDNS();
});

// Add an event listener for mouse wheel scrolling on the dnsTypeSelect dropdown
dnsTypeSelect.addEventListener('wheel', function(event) {
    event.preventDefault();
    const currentIndex = dnsTypeSelect.selectedIndex;
    if (event.deltaY > 0) {
        // Scroll down, select the next option
        dnsTypeSelect.selectedIndex = Math.min(currentIndex + 1, dnsTypeSelect.options.length - 1);
    } else if (event.deltaY < 0) {
        // Scroll up, select the previous option
        dnsTypeSelect.selectedIndex = Math.max(currentIndex - 1, 0);
    }
});


function checkDNS() {
    resultsDiv.innerHTML = ''; // Clear any previous results

    servers.forEach(server => {
        resultsDiv.innerHTML += `<div>${server}: <span id="${server.replace(/\s|\./g, '_')}">Checking...</span></div>`;
    });

    socket.emit('checkDNS', { domain: domainInput.value, type: dnsTypeSelect.value });
}

// Sample client-side logic:
socket.on('dnsResult', function(data) {
    const resultsContainer = document.getElementById(data.server);
    const results = data.result.split('\n'); // Split the result into lines
    let resultHTML = '';
    if (results.length > 1) {
        resultHTML = `<span style="color: red;">(${results.length} DNS)</span><br>`;
        results.forEach((line, index) => {
            resultHTML += `${index + 1}- ${line}<br>`; // Add line numbers
        });
    } else {
        resultHTML = data.result; // Display single-line result without line breaks
    }
    resultsContainer.innerHTML = resultHTML;
});

