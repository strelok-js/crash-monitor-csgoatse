const target = document.querySelector("#crash");

const observerConfig = {
	attributes: true
}

const observer = new MutationObserver(callback);
observer.observe(target, observerConfig);

window.lose = false;
window.games = [];

function callback(mutationList, observer) {
	mutationList.forEach(mutation => {
		if (mutation.target.classList.contains("lose") && !window.lose) {
			const betsList = [...document.querySelector("#bets-list").childNodes];
			const game = {
					sumBet: 0,
					sumProfit: 0,
					crashX: +document.querySelector(".chart .message .value").innerText,
					players: []
				}

			betsList.forEach(node => {
				let profit = +node.querySelector(".profit .symbol")
								.innerText.replace(",", "");
				const bet = +node.getAttribute("data-amount");
				const crashX = (node.querySelector(".multiplier").innerText !== "-")
								? +node.querySelector(".multiplier").innerText
								: -1
				if (node.querySelector(".profit .text-nowrap").innerText[0] === "-")
					profit = -profit;

				const player = {
					name: node.querySelector(".username").innerText,
					bet,
					profit,
					crashX,
				}

				game.sumBet += bet;
				game.sumProfit += profit;
				game.players.push(player);
			});

			window.games.push(game);
			window.losed = true;
			window.lose = true;
			console.log(`Crash: ${game.crashX} | Sum bet: ${game.sumBet} | Sum profit: ${game.sumProfit}`);
		}

		if (!mutation.target.classList.contains("lose"))
			window.lose = false
	});
}