document.addEventListener('DOMContentLoaded', () => {
    function calculateTotalHousePrice(monthlyPayment, interestRate, loanTerm) {
        const monthlyInterestRate = interestRate / 12;
        const totalPayments = loanTerm * 12;

        const loanAmount = monthlyPayment * (1 - (1 + monthlyInterestRate)**-totalPayments) / monthlyInterestRate;
        return loanAmount / 0.8; // Total house price includes 20% down payment
    }

    function calculateLoanDetails(totalHousePrice, interestRate, loanTerm) {
        const downPayment = 0.2 * totalHousePrice;
        const loanAmount = totalHousePrice - downPayment;
        const monthlyInterestRate = interestRate / 12;
        const totalPayments = loanTerm * 12;

        const monthlyPayment = loanAmount * (monthlyInterestRate * (1 + monthlyInterestRate)**totalPayments) / ((1 + monthlyInterestRate)**totalPayments - 1);

        const totalInterest = (monthlyPayment * totalPayments) - loanAmount;

        return { loanAmount, downPayment, totalInterest, monthlyPayment };
    }

    function createLoanCard(index, loanTerms, totalHousePrice, loanAmount, downPayment, totalInterest, paymentIncrease, interestSavings, tenureReduction) {
        let monthlyIncreaseColorClass = '';
        let savingsColorClass = '';
    
        // Determine color classes based on loan term
        switch (loanTerms[index]) {
            case 30:
                monthlyIncreaseColorClass = 'bg-gray-300';
                savingsColorClass = 'bg-gray-300';
                break;
            case 20:
                monthlyIncreaseColorClass = 'bg-green-200';
                savingsColorClass = 'bg-green-100';
                break;
            case 15:
                monthlyIncreaseColorClass = 'bg-yellow-200';
                savingsColorClass = 'bg-green-200';
                break;
            case 10:
                monthlyIncreaseColorClass = 'bg-red-200';
                savingsColorClass = 'bg-green-300';
                break;
            default:
                monthlyIncreaseColorClass = 'bg-gray-300';
                savingsColorClass = 'bg-gray-300';
        }
    
        return `
        <div class="w-full md:w-1/2 p-4">
        <div class="bg-white border border-gray-300 rounded-lg shadow-sm mb-2">
        <div class="p-6">
            <h5 class="text-center text-lg font-semibold">${loanTerms[index]} Years Loan</h5>
            <div class="bg-gray-100 p-4 rounded-lg mt-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm font-semibold text-gray-700">Total House Price:</p>
                        <p class="text-lg font-bold text-gray-900">$${totalHousePrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-700">Loan Amount:</p>
                        <p class="text-lg font-bold text-gray-900">$${loanAmount.toFixed(2)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-700">Down Payment:</p>
                        <p class="text-lg font-bold text-gray-900">$${downPayment.toFixed(2)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-700">Total Interest:</p>
                        <p class="text-lg font-bold text-gray-900">$${totalInterest.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div class="mt-4 border-t-2 border-gray-300 pt-4">
    <div class="grid grid-cols-2 gap-4">
        <!-- Interest Savings -->
        <div class="flex items-center text-primary">
            <i class="fas fa-hand-holding-usd mr-2"></i>
            <span class="inline-flex items-center rounded-md ${savingsColorClass} px-2 py-1 text-xs font-bold text-black">$${interestSavings.toFixed(2)}</span> 
        </div>
        
        
        <!-- Increased Payment -->
        <div>
            <p class="text-primary">
                <i class="fas fa-long-arrow-alt-up ml-2 text-red-500"></i>
                <span class="inline-flex items-center rounded-md ${monthlyIncreaseColorClass} px-2 py-1 text-xs font-bold text-black">$${paymentIncrease.toFixed(2)}</span> 
            </p>
        </div>
        
        <!-- Tenure Reduction -->
        <div class="col-span-2">
            <p class="text-primary mt-2"><strong>Tenure Reduction:</strong> ${tenureReduction} years</p>
        </div>
    </div>
</div>

        </div>
        </div>
        </div>`;
}
    

    function displayLoanDetails(event) {
        event.preventDefault(); // Prevent form submission from reloading the page

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

        const resultsDiv = document.getElementById('mortgageCards');
        resultsDiv.innerHTML = '';

        loanData.forEach((data, index) => {
            const { loanAmount, downPayment, totalInterest, monthlyPayment } = data;

            const tenureReduction = 30 - loanTerms[index];
            const interestSavings = loanData[0].totalInterest - totalInterest; // Compare with 30-year
            const paymentIncrease = monthlyPayment - loanData[0].monthlyPayment;

            const cardHtml = createLoanCard(index, loanTerms, totalHousePrice, loanAmount, downPayment, totalInterest, paymentIncrease, interestSavings, tenureReduction);

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
