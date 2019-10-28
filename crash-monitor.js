const target = document.querySelector("#crash");

const config = {
	attributes: true
}

const observer = new MutationObserver(callback);
observer.observe(target, config);

window.lose = false;

function callback(mutationList, observer) {
	mutationList.forEach(mutation => {
		if (mutation.target.classList.contains("lose") && !window.lose) {
			console.log(mutation);
			window.lose = true;
		}

		if (!mutation.target.classList.contains("lose"))
			window.lose = false
	});
}