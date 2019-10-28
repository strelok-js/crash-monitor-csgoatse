const observer = new MutationObserver(callback);
observer.observe(document.querySelector("#crash"), { attributes: true });

const sumBetNode = document.querySelector(".left-bets thead th:nth-child(2)");
const sumProfitNode = document.querySelector(".left-bets thead th:last-child");
const spanBet = document.createElement("span");
const spanProfit = document.createElement("span");
spanBet.id = "spanBet";
spanProfit.id = "spanProfit";
spanBet.innerText = 0;
spanProfit.innerText = 0;

const betFragment = document.createDocumentFragment();
const profitFragment = document.createDocumentFragment();
betFragment.append(
	spanBet,
	document.createElement("br")
);

profitFragment.append(
	spanProfit,
	document.createElement("br")
);

sumBetNode.insertBefore(betFragment, sumBetNode.firstChild);
sumProfitNode.insertBefore(profitFragment, sumProfitNode.firstChild);

window.losed = false;
window.roundStarted = false;
window.games = [];

function callback(mutationList) {
	mutationList.forEach(mutation => {
		if (mutation.target.classList.contains("lose") && !window.losed) {
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
			console.log(`Crash: ${game.crashX} | Sum bet: ${game.sumBet} | Sum profit: ${game.sumProfit}`);
		}

		if (mutation.target.classList.contains("round") && !window.roundStarted) {
			const betsList = document.querySelector("#bets-list");

			[...betsList.children].forEach(node => {
				spanBet.innerText = +spanBet.innerText + (+node.getAttribute("data-amount"));
			});

			const observer = new MutationObserver(mutationList => {
				mutationList.forEach(mutation => {
					let profit = +mutation.target.querySelector(".profit .symbol")
								.innerText.replace(",", "");

					if (mutation.target.querySelector(".profit .text-nowrap").innerText[0] === "-")
						profit = -profit;

					spanProfit.innerText = +spanProfit.innerText + profit;
				});
			});

			[...betsList.querySelectorAll(".profit")].forEach(elem => {
				observer.observe(elem, {childList: true});
			});
			
			window.roundStarted = true;
		}

		if (!mutation.target.classList.contains("lose"))
			window.losed = false;

		if (!mutation.target.classList.contains("round")) {
			window.roundStarted = false;
			spanBet.innerText = 0;
			spanProfit.innerText = 0;
		}

	});
}