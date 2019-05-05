var purchases = []

$(document).ready(function () {

    while (true) {

        switch (prompt("Enter number Example: 1 - Purchase, 2 - All, 3 - Clear, 4 - Year Report & Exit, 5 - Exit")) {
            case "1":
                addPurchase()
                break;
            case "2":
                sortByDate()
                break
            case "3":
                clearByDate()
                break
            case "4":
                report()
                return
            case "5":
                return
            default:
                alert("Incorrectly typed command")
                break
        }
    }
});

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();

    return dd + '-' + mm + '-' + yy;
}


function addPurchase() {
    var purchaseStr = prompt("Enter command Example: purchase 2019-04-25 12 USD “Tshort” ", "")
    var purchaseArr = purchaseStr.split(" ")

    var purchase = { date: new Date(purchaseArr[1].replace(/-/g, ",")), price: purchaseArr[2], currency: purchaseArr[3].toUpperCase(), name: purchaseArr[4] }
    purchases.push(purchase)

    for (i = 0; i < purchases.length; i++) {
        console.log(formatDate(purchases[i].date) + " " + purchases[i].name + " " + purchases[i].price + " " + purchases[i].currency)
    }
    console.log(" ")
}


function sortByDate() {
    purchases.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    for (i = 0; i < purchases.length; i++) {
        console.log(formatDate(purchases[i].date) + " " + purchases[i].name + " " + purchases[i].price + " " + purchases[i].currency)
    }
    console.log(" ")
}


function clearByDate() {
    var clearStr = prompt("Enter command Example: clear 2019-04-25", "")
    var clearArr = new Date(clearStr.split(" ")[1].replace(/-/g, ",")).toString()

    for (i = 0; i < purchases.length; i++) {

        if (clearArr == purchases[i].date.toString()) {
            purchases.splice(i, 1)
        }
    }
    console.log(" ")
}


function report() {
    endpoint = 'latest'
    access_key = '08d9c4770cd08492fcb6ef4dcc3a5b95';

    var report = prompt("Enter command Example: report 2019 UAH", "")
    var reportYear = report.split(" ")[1]
    var reportCurrency = report.split(" ")[2].toUpperCase()
    var purchasesByYear = 0

    $.ajax({
        url: 'http://data.fixer.io/api/' + endpoint + '?access_key=' + access_key,
        dataType: 'jsonp',
        success: function (json) {

            for (i = 0; i < purchases.length; i++) {
                if (purchases[i].date.getFullYear().toString() == reportYear) {
                    $.each(json.rates, function (key, rate) {
                        if (purchases[i].currency == key) {
                            purchasesByYear = (purchases[i].price / rate) + purchasesByYear
                        }
                    })
                }
            }

            $.each(json.rates, function (key, rate) {
                if (key == reportCurrency) {
                    purchasesByYear = purchasesByYear * rate
                }
            })
            console.log(purchasesByYear + " " + reportCurrency)
        }
    });
}

