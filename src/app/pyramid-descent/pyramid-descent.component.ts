import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

interface NumbersResponse {
	pyramidNums: number[];
	target: number;
	calculatedDirections: string;
}
interface Memoization {
	numbs: number[][];
	targ: number[];
	direct: string[];
}

const memoizationData: Memoization = {
	numbs: [],
	targ: [],
	direct: [],
};

@Component({
	selector: "app-pyramid-descent",
	templateUrl: "./pyramid-descent.component.html",
	styleUrls: ["./pyramid-descent.component.css"],
})
export class PyramidDescentComponent implements OnInit {
	pyramidData: number[][] = [];
	directions: string = "";
	targetNumber: number = 0;
	index: number = 1;
	totalFetched: number = 0; // Keep track of how many times data has been fetched
	maxFetches: number = 1;
	switcher: boolean = true;

	constructor(private http: HttpClient) {}

	ngOnInit(): void {}

	fetchMax(): void {
		const endpoint = "http://localhost:8080/max";
		this.http.get<number>(endpoint).subscribe(
			(data) => {
				this.maxFetches = data;
			},
			(error) => {
				console.error("Error fetching max number of files.", error);
			}
		);
	}

	fetchPyramidData(): void {
		const endpoint = "http://localhost:8080/data";

		if (this.totalFetched < this.maxFetches) {
			this.http.get<NumbersResponse>(endpoint).subscribe(
				(data) => {
					this.distributeNumbersInPyramid(data.pyramidNums);
					this.directions = data.calculatedDirections;
					this.targetNumber = data.target;

					// Cache
					memoizationData.numbs.push(data.pyramidNums);
					memoizationData.targ.push(data.target);
					memoizationData.direct.push(data.calculatedDirections);

					this.totalFetched++;

					if (this.switcher) {
						this.fetchMax();
						this.switcher = false;
					}
				},
				(error) => {
					console.error("Error fetching data:", error);
				}
			);
		} else {
			// Use cached data
			this.distributeNumbersInPyramid(memoizationData.numbs[this.index]);
			this.targetNumber = memoizationData.targ[this.index]; // Assuming targ stores arrays of numbers
			this.directions = memoizationData.direct[this.index]; // Assuming direct stores arrays of strings
			this.index = (this.index + 1) % memoizationData.numbs.length; // Update index for next cycle
		}
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
