import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
	selector: "app-pyramid-descent",
	templateUrl: "./pyramid-descent.component.html",
	styleUrls: ["./pyramid-descent.component.css"],
})
export class PyramidDescentComponent implements OnInit {
	pyramidData: number[][] = [];
	directions: string = "";
	targetNumber: number = 0;

	constructor(private http: HttpClient) {}

	ngOnInit(): void {}

	fetchPyramidData(): void {
		const endpoint = "http://localhost:8080/data";

		this.http.get<number[]>(endpoint).subscribe(
			(data) => {
				this.distributeNumbersInPyramid(data);
			},
			(error) => {
				console.error("Error fetching data:", error);
			}
		);
		this.fetchTarget();
	}
	// Fetch target
	fetchTarget(): void {
		const targetEndpoint = "http://localhost:8080/directions";

		this.http.get<string[]>(targetEndpoint).subscribe(
			(data: string[]) => {
				this.targetNumber = parseInt(data[0], 10);
				console.log(this.targetNumber);
				this.directions = data[1];
			},
			(error) => {
				console.error("Error fetching target:", error);
			}
		);
	}
	// Fetch the directions (L, R) from the directions endpoint
	fetchDirections(): void {
		this.highlightPath(this.directions); // Highlight the path based on directions
	}

	// Function to distribute numbers into pyramid rows
	distributeNumbersInPyramid(numbers: number[]): void {
		let currentIndex = 0;
		let rowIndex = 0;
		// clear previous data if any
		this.pyramidData = [];

		while (currentIndex < numbers.length) {
			const numbersInRow = rowIndex + 1;
			const rowNumbers = numbers.slice(currentIndex, currentIndex + numbersInRow);

			this.pyramidData.push(rowNumbers); // Push the row into the pyramidData array

			currentIndex += numbersInRow;
			rowIndex++;
		}
	}
	highlightPath(directionsString: string): void {
		let currentRow = 0;
		let currentCol = 0;

		// Assuming directionsString is a sequence like "RRLL"
		this.highlightNumber(currentRow, currentCol); // Highlight the top row of the pyramid

		// Split the string into an array of characters for iteration
		const directionsArray = directionsString.split("");

		directionsArray.forEach((direction) => {
			currentRow++;
			if (direction === "L") {
				// Stay in the same column
			} else if (direction === "R") {
				currentCol++; // Move right
			}
			this.highlightNumber(currentRow, currentCol); // Highlight each step in the pyramid
		});
	}

	// Function to add a highlight to a number in the pyramid
	highlightNumber(row: number, col: number): void {
		const numberDiv = document.querySelector(
			`.pyramid-number[data-row='${row}'][data-col='${col}']`
		);
		if (numberDiv) {
			numberDiv.classList.add("highlight");
		}
	}
}
