function product(name, amount, isBought) {
    let obj = new Object();
    obj.name = name;
    obj.amount = amount;
    obj.isBought = isBought;
    return obj;
}

let productsArray = JSON.parse(localStorage.getItem("sukailoProducts"));
if(!productsArray) {
    productsArray = [];
    productsArray.push(product("Помідори", 2, true));
    productsArray.push(product("Печиво", 2, false));
    productsArray.push(product("Сир", 1, false));
}

document.getElementById("addButton").onclick = function () {
    addProduct();
}

document.getElementById("inputAddProduct").addEventListener("keypress", function(e) {
    if(e.key === "Enter")
        addProduct();
});

function find(name) {
    for (let product of productsArray)
        if (product.name == name)
            return product;
    return null;
}

function remove(name) {
    for (let i = 0; i != productsArray.length; ++i)
        if (productsArray[i].name === name) {
            productsArray.splice(i, 1);
            return;
        }
}

function nameChanged(prevName, paragraph) {
    if (paragraph.innerText.length > 1 && find(paragraph.innerText) == null) {
        find(prevName).name = paragraph.innerText;
    }
    generate();
}

function increment(pname) {
    if (find(pname)) {
        ++find(pname).amount;
    }
    generate();
}

function decrement(pname) {
    if (find(pname)) {
        --find(pname).amount;
    }
    generate();
}

function byuDontBuy(pname) {
    if (find(pname)) {
        find(pname).isBought = !find(pname).isBought;
    }
    generate();
}

function addProduct() {
    let name = document.getElementById("inputAddProduct").value;
    if (find(name) || name.length === 0)
        return;
    productsArray.push(product(name, 1, false));
    document.getElementById("inputAddProduct").value = "";
    document.getElementById("inputAddProduct").focus();
    generate();
}

function xbuttonFunction(name) {
    remove(name);
    generate();
}

generate();


function makeProductForLeftPanel(product) {
    let div = document.createElement("div");
    div.classList.add("list-element");

    let name = document.createElement("p");
    if (!product.isBought) {
        name.setAttribute("contenteditable", "true");
        name.innerText = product.name;
    } else {
        let s = document.createElement("s");
        s.innerText = product.name;
        name.appendChild(s);
    }
    name.addEventListener("focusout", function () {
        return nameChanged(product.name, name);
    })
    div.appendChild(name);

    let divAmount = document.createElement("div");
    divAmount.classList.add("amount-buttons");
    let mb = document.createElement("button");
    mb.classList.add("minusbutton");
    mb.setAttribute("data-tooltip", "-1 до кількості");
    mb.innerText = "-";
    if (product.amount > 1)
        mb.onclick = function () {
            return decrement(product.name);
        };
    else
        mb.classList.add("disabled");
    let pb = document.createElement("button");
    pb.classList.add("plusbutton");
    pb.setAttribute("data-tooltip", "+1 до кількості");
    pb.innerText = "+";
    pb.onclick = function () {
        return increment(product.name);
    };
    let amountSpan = document.createElement("span");
    amountSpan.innerText = product.amount;
    if (product.isBought) {
        mb.classList.add("nodisplay");
        pb.classList.add("nodisplay");
    }
    divAmount.appendChild(mb);
    divAmount.appendChild(amountSpan);
    divAmount.appendChild(pb);
    div.appendChild(divAmount);

    let divBuy = document.createElement("div");
    divBuy.classList.add("buybuttons");
    if (product.isBought) {
        let bought = document.createElement("button");
        bought.classList.add("buybutton");
        bought.setAttribute("data-tooltip", "Не купувати");
        bought.innerText = "Не куплено";
        bought.onclick = function () {
            return byuDontBuy(product.name);
        }
        divBuy.appendChild(bought);
    } else {
        let buyButton = document.createElement("button");
        buyButton.classList.add("buybutton");
        buyButton.setAttribute("data-tooltip", "Купити");
        buyButton.innerText = "Куплено";
        buyButton.onclick = function () {
            return byuDontBuy(product.name);
        }
        divBuy.appendChild(buyButton);
        let xbutton = document.createElement("button");
        xbutton.classList.add("xbutton");
        xbutton.setAttribute("data-tooltip", "Видалити");
        xbutton.innerText = "X";
        xbutton.onclick = function () {
            return xbuttonFunction(product.name);
        }
        divBuy.appendChild(xbutton);
    }
    div.appendChild(divBuy);
    return div;
}

function makeProductForRightPanel(product) {
    let div = document.createElement("div");
    div.classList.add("product");
    let name = document.createElement("span");
    name.classList.add("pname");
    name.innerText = product.name;
    div.appendChild(name);
    let kilkist = document.createElement("span");
    kilkist.classList.add("pamount");
    kilkist.innerText = product.amount;
    div.appendChild(kilkist);
    return div;
}

function generate() {
    document.getElementById("left-list").innerHTML = "";
    document.getElementById("pleft").innerHTML = "";
    document.getElementById("pbought").innerHTML = "";

    for (let p of productsArray) {
        document.getElementById("left-list").appendChild(document.createElement("hr"));
        document.getElementById("left-list").appendChild(makeProductForLeftPanel(p));
        if(p.isBought)
            document.getElementById("pbought").appendChild(makeProductForRightPanel(p));
        else
            document.getElementById("pleft").appendChild(makeProductForRightPanel(p));

    }
    localStorage.setItem("sukailoProducts", JSON.stringify(productsArray));

}
