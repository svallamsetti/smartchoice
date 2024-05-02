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

        return { loanAmount, downPayment, totalInterest, monthlyPayment, monthlyPrincipal, monthlyInterest };
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

        const baseData = loanData[0]; // 30-year data for comparison

        loanData.forEach((data, index) => {
            const { loanAmount, downPayment, totalInterest, monthlyPayment, monthlyPrincipal, monthlyInterest } = data;
            const tenureReduction = 30 - loanTerms[index];
            const interestSavings = baseData.totalInterest - totalInterest;
            const paymentIncrease = monthlyPayment - baseData.monthlyPayment;

            const cardHtml = `
            <div class="col-md-12">
                <div class="card border-light shadow-sm mb-4">
                    <div class="card-body">
                        <h5 class="card-title text-center">${loanTerms[index]} Years Loan</h5>
                        <div class="bg-light p-2 mb-3">
                            <div class="row">
                                <div class="col-sm-6">
                                    <p class="card-text">
                                        <strong>Total House Price:</strong> $${totalHousePrice.toFixed(2)}
                                    </p>
                                    <p class="card-text">
                                        <strong>Loan Amount:</strong> $${loanAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="card-text">
                                        <strong>Down Payment:</strong> $${downPayment.toFixed(2)}
                                    </p>
                                    <p class="card-text">
                                        <strong>Total Interest:</strong> $${totalInterest.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="highlights">
                            <div class="row">
                                <div class="col-sm-6">
                                    <p class="text-success">
                                        <i class="fas fa-arrow-up"></i> Monthly Payment Increase: $${paymentIncrease.toFixed(2)}
                                    </p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="text-primary">
                                        <strong>Savings:</strong> $${interestSavings.toFixed(2)}
                                    </p>
                                    <p class="text-primary">
                                        <strong>Tenure Reduction:</strong> ${tenureReduction} years
                                    </p>
                                </div>
                            </div>
                        </div>
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
