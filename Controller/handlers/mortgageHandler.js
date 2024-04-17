const { connectToMySQL } = require('../dbConnection');

async function countMortgageSimulation(req, res){

    const {
        price,
        downPayment,
        loanTerm,
        interest
    } = req.body;

    try {
        // check input
        if (!price || !downPayment || !loanTerm || !interest) {
            throw new Error("Missing required input parameters");
        }

        // count the mortgage
        const loanAmount = price - downPayment;
        const monthlyInterestRate = (interest / 100) / 12;
        const numberOfPayments = loanTerm * 12;
        var mortgagePayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
        mortgagePayment = mortgagePayment.toLocaleString('en-US', { maximumFractionDigits: 0 });
        res.status(200).json({ status: 200, mortgagePayment });
        // add mortgage log
        addMortgageLog(req, price, downPayment, loanAmount, loanTerm, interest, mortgagePayment);
    } catch (error) {
        // Handle errors
        res.status(400).json({ error: error.message });
    }
}

async function addMortgageLog(req, price, downPayment, loanAmount, loanTerm, interest, mortgagePayment){
    const pool = await connectToMySQL();
    try {
        const ipAddress = req.ip;
        await pool.query('INSERT INTO kpr (ip_address, price, down_payment, loan, loan_time, interest, monthly_installment) VALUES (?,?,?,?,?,?,?);', [ipAddress, price, downPayment, loanAmount, loanTerm, interest, mortgagePayment]);
    } catch (error) {
        console.error('Error during add log :', error);
    }
}

module.exports = countMortgageSimulation;