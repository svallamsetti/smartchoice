document.addEventListener('DOMContentLoaded', () => {
    function calculateTotalHousePrice(monthlyPayment, interestRate, loanTerm) {
        const monthlyInterestRate = interestRate / 12;
        const totalPayments = loanTerm * 12;

        const loanAmount = monthlyPayment * (1 - Math.pow(1 + monthlyInterestRate, -totalPayments)) / monthlyInterestRate;
        return loanAmount / 0.8; // Total house price includes 20% down payment
    }

    function calculateLoanDetails(totalHousePrice, interestRate, loanTerm) {
        const downPayment = 0.2 * totalHousePrice;
        const loanAmount = totalHousePrice - downPayment;
        const monthlyInterestRate = interestRate / 12;
        const totalPayments = loanTerm * 12;

        const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

        const totalInterest = (monthlyPayment * totalPayments) - loanAmount;

        const monthlyPrincipal = loanAmount / totalPayments;
        const monthlyInterest = totalInterest / totalPayments;

        return { totalHousePrice, loanAmount, downPayment, totalInterest, monthlyPrincipal, monthlyInterest };
    }

    function displayLoanDetails(event) {
        event.preventDefault();

        const monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const includeHOA = document.getElementById('includeHOA').checked;
        const includeTaxes = document.getElementById('includeTaxes').checked;
        const hoaFees = includeHOA ? parseFloat(document.getElementById('hoaFees').value) : 0;
        const propertyTaxes = includeTaxes ? parseFloat(document.getElementById('propertyTaxes').value) : 0;

        if (isNaN(monthlyPayment) || isNaN(interestRate)) {
            alert("Please provide valid numbers for Monthly Payment and Interest Rate.");
            return;
        }

        const adjustedMonthlyPayment = monthlyPayment - hoaFees - propertyTaxes;

        const totalHousePrice = calculateTotalHousePrice(adjustedMonthlyPayment, interestRate, 30); // Based on a 30-year tenure

        const loanTerms = [30, 20, 15, 10];
        const loanData = loanTerms.map(term => calculateLoanDetails(totalHousePrice, interestRate, term));

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        loanData.forEach((data, index) => {
            const { loanAmount, downPayment, totalInterest, monthlyPrincipal, monthlyInterest } = data;

            const cardHtml = `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${loanTerms[index]} Years Loan</h5>
                        <p class="card-text">Total House Price: $${totalHousePrice.toFixed(2)}</p>
                        <p class="card-text">Loan Amount: $${loanAmount.toFixed(2)}</p>
                        <p class="card-text">Down Payment: $${downPayment.toFixed(2)}</p>
                        <p class="card-text">Total Interest: $${totalInterest.toFixed(2)}</p>
                        <p class="card-text">Monthly Payment Breakdown:</p>
                        <ul class="list-unstyled">
                            <li>Principal: $${monthlyPrincipal.toFixed(2)}</li>
                            <li>Interest: $${monthlyInterest.toFixed(2)}</li>
                        </ul>
                    </div>
                </div>
            </div>
            `;

            resultsDiv.innerHTML += cardHtml;
        });
    }

    function toggleInputFields() {
        document.getElementById('includeHOA').addEventListener('change', function() {
            const hoaFeesGroup = document.getElementById('hoaFeesGroup');
            hoaFeesGroup.style.display = this.checked ? 'block' : 'none';
        });

        document.getElementById('includeTaxes').addEventListener('change', function() {
            const propertyTaxesGroup = document.getElementById('propertyTaxesGroup');
            propertyTaxesGroup.style.display = this.checked ? 'block' : 'none';
        });
    }

    toggleInputFields();

    document.getElementById('mortgageForm').addEventListener('submit', displayLoanDetails);
});
