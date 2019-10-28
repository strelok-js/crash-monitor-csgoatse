const target = document.querySelector("#crash");

const config = {
	attributes: true
}

const observer = new MutationObserver(callback);
observer.observe(target, config);

function callback(mutationList, observer) {
	mutationList.forEach(mutation => {
		console.log(mutation);
	});
}