document.addEventListener('DOMContentLoaded', () => {
    function calculateTotalHousePrice(monthlyPayment, interestRate, loanTerm, downPaymentPercentage) {
        const monthlyInterestRate = interestRate / 12;
        const totalPayments = loanTerm * 12;

        const loanAmount = monthlyPayment * (1 - Math.pow(1 + monthlyInterestRate, -totalPayments)) / monthlyInterestRate;

        // Down payment calculation
        const downPayment = (downPaymentPercentage / 100) * loanAmount;

        return loanAmount + downPayment; // Total house price includes specified down payment
    }

    function calculateLoanDetails(totalHousePrice, interestRate, loanTerm, downPaymentPercentage) {
        const downPayment = (downPaymentPercentage / 100) * totalHousePrice;
        const loanAmount = totalHousePrice - downPayment;
        const monthlyInterestRate = interestRate / 12;
        const totalPayments = loanTerm * 12;

        const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

        const totalInterest = (monthlyPayment * totalPayments) - loanAmount;

        // Monthly breakdown
        const monthlyInterest = loanAmount * monthlyInterestRate;
        const monthlyPrincipal = monthlyPayment - monthlyInterest;

        // PMI Calculation (if down payment is below 20%)
        let pmi = 0;
        if (downPaymentPercentage < 20) {
            const pmiRate = 0.005; // Assume 1% annual PMI rate
            pmi = (pmiRate * loanAmount) / 12; // Monthly PMI amount
        }

        return { loanAmount, downPayment, totalInterest, monthlyPayment, monthlyPrincipal, monthlyInterest, totalPayments, pmi };
    }

    function createLoanCard(index, loanTerms, totalHousePrice, loanAmount, downPayment, totalInterest, monthlyPayment, monthlyPrincipal, monthlyInterest, totalPayments, paymentIncrease, interestSavings, tenureReduction, pmi) {
        const savingsColorClass = interestSavings > 0 ? 'bg-green-200' : 'bg-red-200';
        const monthlyIncreaseColorClass = paymentIncrease > 0 ? 'bg-red-200' : 'bg-green-200';

        let pmiDetails = '';
        if (pmi > 0) {
            pmiDetails = `
            <div class="mt-4">
    <div class="border-l-4 border-red-400 pl-2">
        <div class="flex items-center gap-2">
            <i class="fas fa-shield-alt text-red-500"></i>
            <p class="text-sm font-semibold text-gray-700">PMI:</p>
            <p class="text-lg font-bold text-gray-900">$${pmi.toFixed(2)}</p>
        </div>
    </div>
</div>

        
            `;
        }

        return `
        <div class="w-full md:w-1/2 p-1">
    <div class="bg-white border border-gray-200 rounded-lg shadow-lg mb-2 overflow-hidden">
        <div class="p-4 bg-gradient-to-br from-purple-500 to-purple-400 text-white">
            <!-- Loan Details Header -->
            <h5 class="text-center text-lg font-bold mb-3">${loanTerms[index]} Years Loan</h5>
        </div>
        <div class="p-4">
            <!-- Financial Summary with Simplified Table -->
            <div class="mt-2">
                <table class="w-full text-gray-700 text-sm">
                    <tr>
                        <td class="py-2">
                            <i class="fas fa-home text-blue-500 mr-1"></i>
                            Home Price
                        </td>
                        <td class="text-lg font-bold text-right">$${totalHousePrice.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td class="py-2">
                            <i class="fas fa-sack-dollar text-green-500 mr-1"></i>
                            Loan Amount
                        </td>
                        <td class="text-lg font-bold text-right">$${loanAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td class="py-2">
                            <i class="fas fa-wallet text-orange-500 mr-1"></i>
                            Down Payment
                        </td>
                        <td class="text-lg font-bold text-right">$${downPayment.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td class="py-2">
                            <i class="fas fa-percentage text-red-500 mr-1"></i>
                            Total Interest
                        </td>
                        <td class="text-lg font-bold text-right">$${totalInterest.toFixed(2)}</td>
                    </tr>
                    <tr><td class="text-lg font-bold text-right">${pmiDetails}</td></tr>
                </table>
            </div>

            <div class="mt-3 border-t border-gray-300 pt-3">
                <!-- Financial Highlights -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col items-center text-center">
                        <i class="fas fa-dollar-sign text-green-500 mb-1"></i>
                        <span class="text-sm font-semibold text-gray-700">Interest Savings</span>
                        <span class="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-bold text-black">$${interestSavings.toFixed(2)}</span>
                    </div>

                    <div class="flex flex-col items-center text-center">
                        <i class="fas fa-arrow-up text-red-500 mb-1"></i>
                        <span class="text-sm font-semibold text-gray-700">Monthly Payment Increase</span>
                        <span class="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-black">$${paymentIncrease.toFixed(2)}</span>
                    </div>
                </div>

                <!-- Monthly Payment Breakdown -->
                <div class="mt-3">
                    <p class="text-sm font-semibold text-gray-700">Monthly Payment Breakdown:</p>
                    <div class="bg-white shadow-md rounded-lg p-3">
                        <div class="grid grid-cols-2 gap-3">
                            <div class="border-l-4 border-blue-500 pl-2">
                                <p class="text-sm font-semibold text-gray-700">Principal:</p>
                                <p class="text-lg font-bold text-gray-900">$${monthlyPrincipal.toFixed(2)}</p>
                            </div>

                            <div class="border-l-4 border-red-500 pl-2">
                                <p class="text-sm font-semibold text-gray-700">Interest:</p>
                                <p class="text-lg font-bold text-gray-900">$${monthlyInterest.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loan Tenure Reduction -->
                <div class="flex flex-col items-center text-center mt-3 mb-2">
                    <i class="fas fa-hourglass-half text-blue-500 mb-1"></i>
                    <span class="text-sm font-semibold text-gray-700">Loan Tenure Reduction from 30 years</span>
                    <p class="text-lg font-bold text-gray-900">${tenureReduction} years</p>
                </div>
            </div>
        </div>
    </div>
</div>

    
    

    `;
    }

    function displayLoanDetails(event) {
        event.preventDefault(); // Prevent form submission from reloading the page

        const monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const downPaymentPercentage = parseFloat(document.getElementById('downPayment').value);

        const includeHOA = document.getElementById('includeHOA').checked;
        const includeTaxes = document.getElementById('includeTaxes').checked;
        const hoaFees = includeHOA ? parseFloat(document.getElementById('hoaFees').value) : 0;
        const propertyTaxes = includeTaxes ? parseFloat(document.getElementById('propertyTaxes').value) : 0;

        if (isNaN(monthlyPayment) || isNaN(interestRate) || isNaN(downPaymentPercentage)) {
            alert("Please provide valid numbers for Monthly Payment, Interest Rate, and Down Payment.");
            return;
        }

        const adjustedMonthlyPayment = monthlyPayment - hoaFees - propertyTaxes;

        const totalHousePrice = calculateTotalHousePrice(adjustedMonthlyPayment, interestRate, 30, downPaymentPercentage);

        const loanTerms = [30, 20, 15, 10];
        const loanData = loanTerms.map(term => calculateLoanDetails(totalHousePrice, interestRate, term, downPaymentPercentage, adjustedMonthlyPayment));

        const resultsDiv = document.getElementById('mortgageCards');
        resultsDiv.innerHTML = '';

        loanData.forEach((data, index) => {
            const { loanAmount, downPayment, totalInterest, monthlyPayment, monthlyPrincipal, monthlyInterest, totalPayments, pmi } = data;

            const tenureReduction = 30 - loanTerms[index];
            const interestSavings = loanData[0].totalInterest - totalInterest; // Compare with 30-year
            const paymentIncrease = monthlyPayment - loanData[0].monthlyPayment;

            const cardHtml = createLoanCard(index, loanTerms, totalHousePrice, loanAmount, downPayment, totalInterest, monthlyPayment, monthlyPrincipal, monthlyInterest, totalPayments, paymentIncrease, interestSavings, tenureReduction, pmi);

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
