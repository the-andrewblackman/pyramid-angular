import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-pyramid-descent",
	templateUrl: "./pyramid-descent.component.html",
	styleUrls: ["./pyramid-descent.component.css"],
})
export class PyramidDescentComponent implements OnInit {
	pyramidData: number[][] = []; // To hold the pyramid structure (rows of numbers)

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.fetchPyramidData();
	}

	// Fetch the data from the endpoint
	fetchPyramidData(): void {
		const endpoint = "https://localhost:8080/pyramidNumbers";

		this.http.get<number[]>(endpoint).subscribe(
			(data) => {
				this.distributeNumbersInPyramid(data);
			},
			(error) => {
				console.error("Error fetching data:", error);
			}
		);
	}
	// Fetch the directions (L, R) from the directions endpoint
	fetchDirections(): void {
		const directionsEndpoint = "https://localhost:8080/pyramidDirections";

		this.http.get<string[]>(directionsEndpoint).subscribe(
			(data) => {
				this.directions = data; // Store directions
				this.highlightPath(this.directions); // Highlight the path based on directions
			},
			(error) => {
				console.error("Error fetching directions:", error);
			}
		);
	}

	// Function to distribute numbers into pyramid rows
	distributeNumbersInPyramid(numbers: number[]): void {
		let currentIndex = 0;
		let rowIndex = 0;

		while (currentIndex < numbers.length) {
			const numbersInRow = rowIndex + 1;
			const rowNumbers = numbers.slice(currentIndex, currentIndex + numbersInRow);

			this.pyramidData.push(rowNumbers); // Push the row into the pyramidData array

			currentIndex += numbersInRow;
			rowIndex++;
		}
	}
	highlightPath(directions: string[]): void {
		let currentRow = 0;
		let currentCol = 0;

		this.highlightNumber(currentRow, currentCol); // Highlight the top row of the pyramid

		directions.forEach((direction) => {
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
