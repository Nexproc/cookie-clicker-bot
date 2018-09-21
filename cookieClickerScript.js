var _BIG_COOKIE = $("#bigCookie")
var _CURRENT_PRODUCT_STATE = undefined
var _NEXT_POWER = $(".crate.upgrade")
var minute = 1000 * 60

function clickIfNotNull(el) {
	if(el) el.click()
}

function getBigCookie(jq) {
	if (!_BIG_COOKIE) {
		_BIG_COOKIE = jq("#bigCookie")
	}
	return _BIG_COOKIE
}

function clickCookie(jq) {
	getBigCookie().click()
	setTimeout(function(){
		clickCookie(jq),
		19
	})
}

function buyProducts() {
	setTimeout(function(){buyNextItem()})
	setTimeout(function(){buyProducts()}, 50)
}

function buyPowers(jq) {
	setTimeout(function(){clickIfNotNull(_NEXT_POWER)})
	setTimeout(function(){buyPowers(jq)}, 45)
}

function clickShimmer(jq) {
	clickIfNotNull(jq(".shimmer"))
	clickIfNotNull(jq("#shimmer"))
	setTimeout(function(){clickShimmer(jq)}, 14)
}

function powerPoll(jq) {
	_NEXT_POWER = jq(".crate.upgrade")
	setTimeout(function(){powerPoll(jq)}, 2000)
}

function productPoll(jq) {
	findNextProductBuy(jq)
	setTimeout(function(){productPoll(jq)}, 2000)
}

function getChildren(jq) {
	return [].slice.call(jq("#products").children)
}

function findNextProductBuy(jq) {
	// get all child elements in the buildings list
	var children = getChildren(jq)
	var price2indexAndMin = makePrice2IndexAndMin(jq, children)
	var price2index = price2indexAndMin.price2index
	var min = price2indexAndMin.min
	var validProducts = filterProducts(price2index, min)
	nextBuy = getBestBuy(validProducts, price2index)
	setCurrentState(min, nextBuy, price2index, children)
}

function setCurrentState(min, nextBuy, price2index, children) {
	_CURRENT_PRODUCT_STATE = {
		min: min,
		nextBuy: nextBuy,
		price2index: price2index,
		children: children,
	}
}

function buyNextItem() {
	if(_CURRENT_PRODUCT_STATE) {
		var children = _CURRENT_PRODUCT_STATE.children
		var nextBuy = _CURRENT_PRODUCT_STATE.nextBuy
		var price2index = _CURRENT_PRODUCT_STATE.price2index
		children[price2index[nextBuy]].click()
	}
}

function makePrice2IndexAndMin(jq, children) {
	var price2index = {}
	var min = -1
	// start at 1 to skip first child
	for(var i = 1; i < children.length; i++) {
		var price = getProductPrice(jq, i)
		price2index[price] = i
		if (price < min || min == -1) {
			min = price
		}
	}
	return {price2index: price2index, min: min}
}

function getProductPrice(jq, index) {
	return Number(jq("#productPrice" + String(index-1)).textContent.split(",").join(""))
}

function filterProducts(price2index, min) {
	var validValues = []
	for (key in price2index) {
		if (min * 10 > key) validValues.push(key)
	}
	return validValues
}

function getBestBuy(validProducts, price2index) {
	bestBuy = undefined
	// oops! my buys are all out of order,
	// I'll be getting clickers forever at this rate
	// buy the highest index of any item cheaper than the
	// selected item
	for (idx in validProducts) {
		var price = validProducts[idx] 
		if (!bestBuy) bestBuy = price
		if (price2index[price] > price2index[bestBuy]) {
			bestBuy = price
		}
	}
	return bestBuy
}

function getProducts(jq) {
	return jq("#products").children
}

productPoll($)
powerPoll($)
clickCookie($)
buyProducts($)
buyPowers($)
clickShimmer($)