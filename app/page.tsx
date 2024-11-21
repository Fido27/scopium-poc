"use client";
import { Button, CalendarDate, DateInput, DatePicker, Input, Select, SelectItem, Slider } from "@nextui-org/react";
import { useState } from "react";

let days: string[] = [];
const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
];
let years: string[] = [];

for (let i = 1; i < 32; i++) {
		days.push(i.toString());
}

for (let i = 1996; i < 2025; i++) {
		years.push(i.toString());
}

export default function Home() {
	const [amount, setAmount] = useState<number>(0);
	const [sliderValue, setSliderValue] = useState<number>(0);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-semibold text-center mb-6 text-teal-800">POC for Scopium AI</h2>

				<label className="block mb-4">
					<span className="text-gray-700">Amount</span>
					<input
						type="number"
						className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
						placeholder="Enter amount"
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value))}
					/>
				</label>
				<label className="block mb-6">
					<div className="flex w-full text-center">
						<div className="text-gray-700 flex-1">Stocks</div>
						<div className="text-gray-600 flex-1">{sliderValue}%</div>
						<div className="text-gray-600 flex-1">{100 - sliderValue}%</div>
						<div className="text-gray-700 flex-1">Gold</div>

					</div>
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						className="w-full mt-2"
						value={sliderValue}
						onChange={(e) => setSliderValue(Number(e.target.value))}
					/>
				</label>

				<button
					className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
					onClick={() => sendPacket(amount, sliderValue)}
				>
					Submit
				</button>

				<br />
				<br />

				<div id="result" className="text-black hidden">
					
				</div>
			</div>
		</div>
	);
}

async function sendPacket(amount: number, sliderval:number) {

		const params = new URLSearchParams();
		params.append("amount", amount!.toString());
		params.append("sliderval", sliderval!.toString());

		console.log("Amount: " + amount)

		const req = await fetch("http://localhost:8000/pai/?" + params);
		const res = JSON.parse(await req.json());
		console.log(res);

		const html_output = `If you had invested ${amount} on ${res.date} with a split of ${sliderval}% in A and ${100 - sliderval}% in B, then the split would've been: \n\nA: ${res.cpA} \nB: ${res.cpB} \n\nAfter 1 year, the value of the stocks would've been: \nA: ${res.spA} \nB: ${res.spB} \n\nWhich would've yielded a profit of ${res.gains} (${res.gains_percent}%)`

		document.getElementById("result")!.innerText = html_output;
		document.getElementById("result")!.classList.remove("hidden");
		return false;
}
