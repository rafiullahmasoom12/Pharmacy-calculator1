/* ===================================================================
   📋 د درملو حساب سیسټم - د JavaScript اصلي فایل
   ===================================================================
   دا فایل د ټول سیسټم منطق (Logic) لري.
   
   د فایل جوړښت:
   ۱. ښکلی پاپ اپونه (Alert + Confirm)
   ۲. د معلوماتو خوندي کول (localStorage)
   ۳. د پاڼو ترمنځ تګ راتګ
   ۴. د محاسبې فنکشنونه
   ۵. د نېټې فنکشن
   ۶. د درملو اخیستل
   ۷. د درملو پلورل
   ۸. د موجودي مدیریت
   ۹. د دواخانو مدیریت
   ۱۰. د لټون سیسټم
   ۱۱. د راپور سیسټم
   ۱۲. د بیکپ سیسټم
   ۱۳. د پیژندنې سیسټم (Login)
   ۱۴. نور مرستندویه فنکشنونه
   =================================================================== */


/* ===================================================================
   ۱. 📢 ښکلی پاپ اپونه (Custom Alert & Confirm)
   =================================================================== */

/* -------------------------------------------------------------------
   showAlert() - د پیغام ښودلو لپاره ښکلی پاپ اپ
   -------------------------------------------------------------------
   دې فنکشن د کاروونکي ته یو ښکلی پیغام ښیي.
   - title: د پیغام سرلیک
   - bodyHTML: د پیغام منځپانګه (HTML)
   - type: 'success' (شین) یا 'error' (سور)
   ------------------------------------------------------------------- */
function showAlert(title, bodyHTML, type = 'success') {
    const overlay = document.getElementById('customAlert');
    const icon = document.getElementById('alertIcon');
    
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertBody').innerHTML = bodyHTML;
    
    icon.textContent = type === 'success' ? '✅' : '❌';
    
    overlay.style.display = 'flex';
}

/* -------------------------------------------------------------------
   closeAlert() - د پیغام پاپ اپ بندول
   ------------------------------------------------------------------- */
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

/* -------------------------------------------------------------------
   showConfirm() - د تصدیق پاپ اپ (هو/نه)
   -------------------------------------------------------------------
   دې فنکشن د کاروونکي څخه تصدیق غواړي.
   - title: د پاپ اپ سرلیک
   - bodyHTML: د پاپ اپ منځپانګه
   - callback: فنکشن چې د کاروونکي د انتخاب وروسته چلیږي
               (true = هو، false = نه)
   ------------------------------------------------------------------- */
let confirmCallback = null;

function showConfirm(title, bodyHTML, callback) {
    let overlay = document.getElementById('customConfirm');
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmBody').innerHTML = bodyHTML;
    
    confirmCallback = callback;
    overlay.style.display = 'flex';
}

/* -------------------------------------------------------------------
   closeConfirm() - د تصدیق پاپ اپ بندول او د کاروونکي د انتخاب پلي کول
   ------------------------------------------------------------------- */
function closeConfirm(result) {
    let overlay = document.getElementById('customConfirm');
    overlay.style.display = 'none';
    
    if (confirmCallback) {
        confirmCallback(result);
        confirmCallback = null;
    }
}


/* ===================================================================
   ۲. 💾 د معلوماتو خوندي کول (localStorage)
   =================================================================== */

// د ډاټا د خوندي کولو کیلي
const DB_KEY = 'pharmacy_system_data';

/* -------------------------------------------------------------------
   getData() - د ټولو معلوماتو ترلاسه کول
   -------------------------------------------------------------------
   دا فنکشن د localStorage څخه ټول معلومات راوړي.
   که معلومات نه وي، یو خالي جوړښت راګرځوي.
   ------------------------------------------------------------------- */
function getData() {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
        let parsed = JSON.parse(data);
        // که payments نه وي، یې اضافه کوو
        if (!parsed.payments) {
            parsed.payments = [];
        }
        return parsed;
    }
    // د پیل لپاره خالي جوړښت
    return {
        purchases: [],   // اخیستل
        sales: [],       // پلورونه
        expenses: [],    // شاتړ
        payments: []     // تادیات
    };
}

/* -------------------------------------------------------------------
   saveData() - د معلوماتو خوندي کول
   ------------------------------------------------------------------- */
function saveData(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}


/* ===================================================================
   ۳. 🔄 د پاڼو ترمنځ د تګ راتګ فنکشن
   =================================================================== */

/* -------------------------------------------------------------------
   showPage() - د یوې پاڼې ښودل او نورې پټول
   -------------------------------------------------------------------
   دا فنکشن:
   ۱. ټولې پاڼې پټوي
   ۲. یوازې غوره شوې پاڼه ښکاره کوي
   ۳. د پاڼې اړوند معلومات تازه کوي
   ------------------------------------------------------------------- */
function showPage(pageId) {
    // ټولې پاڼې پټې کړه
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
    });
    
    // غوره شوې پاڼه ښکاره کړه
    document.getElementById(pageId).classList.add('active');

    // 🧹 د فورمونو پاکول — هره پاڼه چې پرانیستل شي
    if (pageId === 'buy-page') clearBuyForm();
    if (pageId === 'sell-page') clearSellForm();
    if (pageId === 'search-page') clearSearchForm();
    
    // د پاڼې اړوند معلومات تازه کړه
    if (pageId === 'inventory-page') renderInventory();
    if (pageId === 'pharmacy-page') renderPharmacies();
    
    if (pageId === 'report-page') {
        // که نېټه نه وي ټاکل شوې، نن ورځ وکاروه
        let dateInput = document.getElementById('report-date');
        if (dateInput && !dateInput.value) {
            let today = new Date();
            let yyyy = today.getFullYear();
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let dd = String(today.getDate()).padStart(2, '0');
            dateInput.value = yyyy + '-' + mm + '-' + dd;
        }
        renderDailyReport();
    }
    
    if (pageId === 'home-page') updateStats();
}


/* ===================================================================
   ۴. 🧮 د محاسبې فنکشنونه
   =================================================================== */

/* -------------------------------------------------------------------
   calcBuyTotal() - د اخیستلو ټولې پیسې محاسبه
   -------------------------------------------------------------------
   فورمول: تعداد × فی قیمت = ټولې پیسې
   ------------------------------------------------------------------- */
function calcBuyTotal() {
    let qty = parseFloat(document.getElementById('buy-qty').value) || 0;
    let price = parseFloat(document.getElementById('buy-price').value) || 0;
    let total = qty * price;
    document.getElementById('buy-total').value = total.toFixed(2);
    calcBuyRemaining();   // د باقي بیا محاسبه
}

/* -------------------------------------------------------------------
   calcBuyRemaining() - د اخیستلو باقي محاسبه
   -------------------------------------------------------------------
   فورمول: ټولې پیسې - وصول = باقي
   ------------------------------------------------------------------- */
function calcBuyRemaining() {
    let total = parseFloat(document.getElementById('buy-total').value) || 0;
    let paid = parseFloat(document.getElementById('buy-paid').value) || 0;
    let remaining = total - paid;
    document.getElementById('buy-remaining').value = remaining.toFixed(2);
}

/* -------------------------------------------------------------------
   calcSellTotal() - د پلور ټولې پیسې محاسبه
   ------------------------------------------------------------------- */
function calcSellTotal() {
    let qty = parseFloat(document.getElementById('sell-qty').value) || 0;
    let price = parseFloat(document.getElementById('sell-price').value) || 0;
    let total = qty * price;
    document.getElementById('sell-total').value = total.toFixed(2);
    calcSellRemaining();
}

/* -------------------------------------------------------------------
   calcSellRemaining() - د پلور باقي محاسبه
   ------------------------------------------------------------------- */
function calcSellRemaining() {
    let total = parseFloat(document.getElementById('sell-total').value) || 0;
    let paid = parseFloat(document.getElementById('sell-paid').value) || 0;
    let remaining = total - paid;
    document.getElementById('sell-remaining').value = remaining.toFixed(2);
}


/* ===================================================================
   ۵. 📅 د نېټې فنکشن
   =================================================================== */

/* -------------------------------------------------------------------
   getTodayDate() - د نن ورځې نېټه (YYYY/MM/DD)
   ------------------------------------------------------------------- */
function getTodayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    return yyyy + '/' + mm + '/' + dd;
}


/* ===================================================================
   ۶. 📦 د موجودي چک کول
   =================================================================== */

/* -------------------------------------------------------------------
   getMedicineStock() - د یو درمل د موجودي مقدار ترلاسه کول
   -------------------------------------------------------------------
   محاسبه: (ټول اخیستل شوي) - (ټول پلورل شوي) = موجودي
   ------------------------------------------------------------------- */
function getMedicineStock(medicineName) {
    let data = getData();
    let nameLower = medicineName.toLowerCase().trim();
    
    // ټول اخیستل شوي د دې درمل
    let totalBought = 0;
    data.purchases.forEach(p => {
        if (p.name.toLowerCase().trim() === nameLower) {
            totalBought += p.qty;
        }
    });
    
    // ټول پلورل شوي د دې درمل
    let totalSold = 0;
    data.sales.forEach(s => {
        if (s.name.toLowerCase().trim() === nameLower) {
            totalSold += s.qty;
        }
    });
    
    let stock = totalBought - totalSold;
    return stock > 0 ? stock : 0;
}


/* ===================================================================
   ۷. 📥 د اخیستلو ثبتول
   =================================================================== */

/* -------------------------------------------------------------------
   savePurchase() - د نوي اخیستلو ثبتول
   -------------------------------------------------------------------
   دا فنکشن:
   ۱. د فورم معلومات اخلي
   ۲. اړین معلومات چک کوي
   ۳. د تصدیق پاپ اپ ښیي
   ۴. که کاروونکي تصدیق کړه → معلومات ثبتوي
   ۵. کور پاڼې ته ځي
   ------------------------------------------------------------------- */
function savePurchase() {
    // د فورم معلومات
    let pharmacy = document.getElementById('buy-pharmacy').value.trim();
    let name = document.getElementById('buy-name').value.trim();
    let qty = parseFloat(document.getElementById('buy-qty').value);
    let price = parseFloat(document.getElementById('buy-price').value);
    let total = parseFloat(document.getElementById('buy-total').value) || 0;
    let paid = parseFloat(document.getElementById('buy-paid').value) || 0;
    let remaining = parseFloat(document.getElementById('buy-remaining').value) || 0;

    // چک: ټول اړین معلومات ډک دي؟
    if (!pharmacy || !name || !qty || !price) {
        showAlert('خطا!', '<p>مهرباني وکړئ ټول اړین معلومات ډک کړئ!</p>', 'error');
        return;
    }

    // چک: وصول د ټولې پیسې څخه زیات نه وي
    if (paid > total) {
        showAlert(
            'تېروتنه!',
            '<p>وصول شوې پیسې (AFN ' + paid.toFixed(2) + ') د ټولې پیسې (AFN ' + total.toFixed(2) + ') څخه زیاتې نشي کیدای!</p>' +
            '<p>مهرباني وکړئ د <strong>وصول</strong> برخه سمه کړئ.</p>',
            'error'
        );
        document.getElementById('buy-paid').focus();
        return;
    }

    // 🆕 تصدیق — د کاروونکي څخه غوښتنه
    showConfirm(
        'تصدیق',
        '<p style="text-align:center; margin-bottom:15px;">ایا معلومات دقیق او بشپړ دي؟</p>' +
        '<div class="row"><span>🏪 درملتون:</span><strong>' + pharmacy + '</strong></div>' +
        '<div class="row"><span>💊 درمل:</span><strong>' + name + '</strong></div>' +
        '<div class="row"><span>📦 تعداد:</span><strong>' + qty + '</strong></div>' +
        '<div class="row"><span>💰 ټولې پیسې:</span><strong>AFN ' + total.toFixed(2) + '</strong></div>' +
        '<div class="row"><span>💳 وصول:</span><strong>AFN ' + paid.toFixed(2) + '</strong></div>' +
        '<div class="row"><span>🔴 باقي:</span><strong>AFN ' + remaining.toFixed(2) + '</strong></div>',
        function(result) {
            // که کاروونکي "نه" وویل → مه ثبتوه
            if (!result) return;
            
            // ✅ ثبت کړه
            let data = getData();
            data.purchases.push({
                id: Date.now(),
                pharmacy: pharmacy,
                name: name,
                qty: qty,
                price: price,
                total: total,
                paid: paid,
                originalPaid: paid,              // 🆕 د پیل اصلي تادیه (ثابت)
                originalRemaining: remaining,    // 🆕 د پیل اصلي باقي (ثابت)
                remaining: remaining,
                date: getTodayDate()
            });
            saveData(data);

            // د فورم پاکول
            document.getElementById('buy-pharmacy').value = '';
            document.getElementById('buy-name').value = '';
            document.getElementById('buy-qty').value = '';
            document.getElementById('buy-price').value = '';
            document.getElementById('buy-total').value = '';
            document.getElementById('buy-paid').value = '';
            document.getElementById('buy-remaining').value = '';

            // تازه کول
            updateStats();
            showPage('home-page');
        }
    );
}


/* ===================================================================
   ۸. 📤 د پلور ثبتول
   =================================================================== */

/* -------------------------------------------------------------------
   saveSale() - د نوي پلور ثبتول
   -------------------------------------------------------------------
   دا فنکشن:
   ۱. د فورم معلومات اخلي
   ۲. اړین معلومات چک کوي
   ۳. د موجودي چک کوي
   ۴. د تصدیق پاپ اپ ښیي
   ۵. که کاروونکي تصدیق کړه → معلومات ثبتوي
   ------------------------------------------------------------------- */
function saveSale() {
    let pharmacy = document.getElementById('sell-pharmacy').value.trim();
    let name = document.getElementById('sell-name').value.trim();
    let qty = parseFloat(document.getElementById('sell-qty').value);
    let price = parseFloat(document.getElementById('sell-price').value);
    let total = parseFloat(document.getElementById('sell-total').value) || 0;
    let paid = parseFloat(document.getElementById('sell-paid').value) || 0;
    let remaining = parseFloat(document.getElementById('sell-remaining').value) || 0;

    // چک: ټول اړین معلومات ډک دي؟
    if (!pharmacy || !name || !qty || !price) {
        showAlert('خطا!', '<p>مهرباني وکړئ ټول اړین معلومات ډک کړئ!</p>', 'error');
        return;
    }

    // چک: د موجودي
    let availableStock = getMedicineStock(name);

    if (availableStock === 0) {
        showAlert(
            'دوا موجوده نه ده',
            '<p>د <strong>"' + name + '"</strong> په نامه هېڅ درمل په موجودي کې نشته.</p>' +
            '<p>مهرباني وکړئ لومړی دا درمل واخلئ.</p>',
            'error'
        );
        return;
    }

    if (qty > availableStock) {
        showAlert(
            'موجودي کې دومره دوا نشته',
            '<div class="row"><span>📦 د "' + name + '" شته موجودي:</span><strong>' + availableStock + ' دانې</strong></div>' +
            '<div class="row"><span>🛒 د پلورلو غوښتنه:</span><strong>' + qty + ' دانې</strong></div>',
            'error'
        );
        return;
    }

    // چک: وصول د ټولې پیسې څخه زیات نه وي
    if (paid > total) {
        showAlert(
            'تېروتنه!',
            '<p>وصول شوې پیسې (AFN ' + paid.toFixed(2) + ') د ټولې پیسې (AFN ' + total.toFixed(2) + ') څخه زیاتې نشي کیدای!</p>' +
            '<p>مهرباني وکړئ د <strong>وصول</strong> برخه سمه کړئ.</p>',
            'error'
        );
        document.getElementById('sell-paid').focus();
        return;
    }

    // 🆕 تصدیق
    showConfirm(
        'تصدیق',
        '<p style="text-align:center; margin-bottom:15px;">ایا معلومات دقیق او بشپړ دي؟</p>' +
        '<div class="row"><span>🏪 درملتون:</span><strong>' + pharmacy + '</strong></div>' +
        '<div class="row"><span>💊 درمل:</span><strong>' + name + '</strong></div>' +
        '<div class="row"><span>📦 تعداد:</span><strong>' + qty + '</strong></div>' +
        '<div class="row"><span>💰 ټولې پیسې:</span><strong>AFN ' + total.toFixed(2) + '</strong></div>' +
        '<div class="row"><span>💳 وصول:</span><strong>AFN ' + paid.toFixed(2) + '</strong></div>' +
        '<div class="row"><span>🔴 باقي:</span><strong>AFN ' + remaining.toFixed(2) + '</strong></div>' +
        '<div class="row"><span>📦 پاتې موجودي:</span><strong>' + (availableStock - qty) + ' دانې</strong></div>',
        function(result) {
            if (!result) return;
            
            // ✅ ثبت کړه
            let data = getData();
            data.sales.push({
                id: Date.now(),
                pharmacy: pharmacy,
                name: name,
                qty: qty,
                price: price,
                total: total,
                paid: paid,
                originalPaid: paid,
                originalRemaining: remaining,
                remaining: remaining,
                date: getTodayDate()
            });
            saveData(data);

            // د فورم پاکول
            document.getElementById('sell-pharmacy').value = '';
            document.getElementById('sell-name').value = '';
            document.getElementById('sell-qty').value = '';
            document.getElementById('sell-price').value = '';
            document.getElementById('sell-total').value = '';
            document.getElementById('sell-paid').value = '';
            document.getElementById('profit-indicator').style.display = 'none';

            updateStats();
            showPage('home-page');
        }
    );
}


/* ===================================================================
   ۹. 📊 د عمومي معلوماتو تازه کول
   =================================================================== */

/* -------------------------------------------------------------------
   updateStats() - د کور پاڼې احصائې تازه کول
   -------------------------------------------------------------------
   دا فنکشن محاسبه کوي:
   - ټول اخیستل
   - ټول پلور
   - خالصه ګټه یا تاوان
   ------------------------------------------------------------------- */
function updateStats() {
    let data = getData();
    
    // ټول اخیستل
    let totalBuy = data.purchases.reduce((sum, p) => sum + p.total, 0);
    
    // ټول پلور
    let totalSell = data.sales.reduce((sum, s) => sum + s.total, 0);
    
    // د پلورل شوو درملو قیمت (Cost of Goods Sold)
    let costOfSoldGoods = 0;
    data.sales.forEach(sale => {
        let sameNamePurchases = data.purchases.filter(p => 
            p.name.toLowerCase().trim() === sale.name.toLowerCase().trim()
        );
        
        if (sameNamePurchases.length > 0) {
            let totalQtyBought = sameNamePurchases.reduce((sum, p) => sum + p.qty, 0);
            let totalCostBought = sameNamePurchases.reduce((sum, p) => sum + p.total, 0);
            let avgPrice = totalQtyBought > 0 ? (totalCostBought / totalQtyBought) : 0;
            costOfSoldGoods += avgPrice * sale.qty;
        }
    });
    
    // خالصه ګټه / تاوان
    let netProfit = 0;
    let netLoss = 0;
    
    if (totalSell === 0) {
        netProfit = 0;
        netLoss = 0;
    } else {
        let result = totalSell - costOfSoldGoods;
        
        if (result >= 0) {
            netProfit = result;
            netLoss = 0;
        } else {
            netProfit = 0;
            netLoss = Math.abs(result);
        }
    }
    
    // ښودل
    document.getElementById('total-buy').innerText = 'AFN ' + totalBuy.toFixed(2);
    document.getElementById('total-sell').innerText = 'AFN ' + totalSell.toFixed(2);
    
    let profitElement = document.getElementById('net-profit');
    let lossElement = document.getElementById('total-loss');
    
    if (netProfit > 0) {
        profitElement.innerText = 'AFN ' + netProfit.toFixed(2);
        profitElement.className = 'value profit';
        lossElement.innerText = 'AFN 0.00';
        lossElement.className = 'value';
    } else if (netLoss > 0) {
        profitElement.innerText = 'AFN 0.00';
        profitElement.className = 'value';
        lossElement.innerText = 'AFN ' + netLoss.toFixed(2);
        lossElement.className = 'value loss';
    } else {
        profitElement.innerText = 'AFN 0.00';
        profitElement.className = 'value';
        lossElement.innerText = 'AFN 0.00';
        lossElement.className = 'value';
    }
}


/* ===================================================================
   ۱۰. 📦 د موجودي لیست
   =================================================================== */

/* -------------------------------------------------------------------
   renderInventory() - د موجودي لیست (د درملتونونو ګروپ)
   -------------------------------------------------------------------
   دا فنکشن یوازې د درملتونونو نومونه ښیي.
   کله چې یو درملتون کلیک شي → تفصیل ښکاري.
   ------------------------------------------------------------------- */
function renderInventory() {
    let data = getData();
    let inventoryDiv = document.getElementById('inventory-list');
    
    if (data.purchases.length === 0) {
        inventoryDiv.innerHTML = '<p class="empty-msg">تر اوسه هېڅ معلومات ثبت شوي نه دي.</p>';
        return;
    }

    // د پلورل شوو درملو ټولټال
    let soldTotals = {};
    data.sales.forEach(s => {
        let key = s.name.toLowerCase().trim();
        if (!soldTotals[key]) soldTotals[key] = 0;
        soldTotals[key] += s.qty;
    });

    // د هر اخیستنې لپاره، موجودي محاسبه
    let purchasesOldFirst = [...data.purchases].sort((a, b) => a.id - b.id);
    let processedNames = {};
    let purchaseAvailability = {};
    
    purchasesOldFirst.forEach(purchase => {
        let key = purchase.name.toLowerCase().trim();
        let totalSoldForThisMedicine = soldTotals[key] || 0;
        
        if (!processedNames[key]) processedNames[key] = 0;
        
        let alreadySoldFromThisMedicine = processedNames[key];
        let soldFromThisPurchase = 0;
        
        if (alreadySoldFromThisMedicine < totalSoldForThisMedicine) {
            let remainingToSell = totalSoldForThisMedicine - alreadySoldFromThisMedicine;
            soldFromThisPurchase = Math.min(remainingToSell, purchase.qty);
            processedNames[key] += soldFromThisPurchase;
        }
        
        purchaseAvailability[purchase.id] = purchase.qty - soldFromThisPurchase;
    });
    
    // د درملتونونو ګروپ کول
    let grouped = {};
    let sortedPurchases = [...data.purchases].sort((a, b) => b.id - a.id);
    
    sortedPurchases.forEach(purchase => {
        let availableQty = purchaseAvailability[purchase.id];
        
        // که موجودي 0 او باقي 0 وي → پټ کړه
        if (availableQty <= 0 && purchase.remaining <= 0) return;
        
        if (!grouped[purchase.pharmacy]) {
            grouped[purchase.pharmacy] = {
                name: purchase.pharmacy,
                lastId: purchase.id,
                count: 0
            };
        }
        grouped[purchase.pharmacy].count += 1;
    });
    
    let pharmacyList = Object.values(grouped).sort((a, b) => b.lastId - a.lastId);
    
    if (pharmacyList.length === 0) {
        inventoryDiv.innerHTML = '<p class="empty-msg">ټول درمل پلورل شوي دي، یا هېڅ معلومات نشته.</p>';
        return;
    }
    
    // لیست — یوازې د درملتونونو نومونه
    let html = '';
    pharmacyList.forEach(item => {
        html += '<div onclick="showInventoryPharmacy(\'' + item.name.replace(/'/g, "\\'") + '\')" ' +
                'style="background:white; padding:20px; border-radius:12px; margin-bottom:10px; ' +
                'box-shadow:0 2px 8px rgba(0,0,0,0.08); cursor:pointer; border-right:4px solid #1a6b8a; ' +
                'transition: all 0.2s; display:flex; justify-content:space-between; align-items:center;">' +
                '<h3 style="color:#1a6b8a; margin:0; font-size:18px;">🏪 ' + item.name + '</h3>' +
                '<span style="color:#999; font-size:24px;">›</span>' +
                '</div>';
    });
    
    inventoryDiv.innerHTML = html;
}

/* -------------------------------------------------------------------
   showInventoryPharmacy() - د یو درملتون تفصیل
   -------------------------------------------------------------------
   دا فنکشن د یو درملتون ټول اخیستل ښیي — د هر درمل تفصیل سره.
   یوازې هغه درمل ښکاري چې موجودي یا باقي لري.
   ------------------------------------------------------------------- */
function showInventoryPharmacy(pharmacyName) {
    let data = getData();
    let inventoryDiv = document.getElementById('inventory-list');
    
    // د دې درملتون ټول اخیستل
    let pharmacyPurchases = data.purchases.filter(p => p.pharmacy === pharmacyName);
    
    if (pharmacyPurchases.length === 0) {
        inventoryDiv.innerHTML = '<p class="empty-msg">هېڅ معلومات نشته.</p>';
        return;
    }
    
    // د موجودي محاسبه
    let soldTotals = {};
    data.sales.forEach(s => {
        let key = s.name.toLowerCase().trim();
        if (!soldTotals[key]) soldTotals[key] = 0;
        soldTotals[key] += s.qty;
    });
    
    let purchasesOldFirst = [...data.purchases].sort((a, b) => a.id - b.id);
    let processedNames = {};
    let purchaseAvailability = {};
    
    purchasesOldFirst.forEach(p => {
        let key = p.name.toLowerCase().trim();
        let totalSoldForThisMedicine = soldTotals[key] || 0;
        
        if (!processedNames[key]) processedNames[key] = 0;
        
        let alreadySoldFromThisMedicine = processedNames[key];
        let soldFromThisPurchase = 0;
        
        if (alreadySoldFromThisMedicine < totalSoldForThisMedicine) {
            let remainingToSell = totalSoldForThisMedicine - alreadySoldFromThisMedicine;
            soldFromThisPurchase = Math.min(remainingToSell, p.qty);
            processedNames[key] += soldFromThisPurchase;
        }
        
        purchaseAvailability[p.id] = p.qty - soldFromThisPurchase;
    });
    
    let html = '';
    
    // د بیرته تګ تڼۍ
    html += '<button class="back-btn" onclick="renderInventory()" style="background:#6c757d;">⬅️ بیرته موجودي ته</button>';
    
    // د درملتون نوم
    html += '<div class="info-card" style="border-right:4px solid #1a6b8a;">' +
            '<h2 style="color:#1a6b8a; text-align:center; margin-bottom:10px;">🏪 ' + pharmacyName + '</h2>' +
            '<div class="info-row"><span>📦 د اخیستلو شمیر:</span> <span>' + pharmacyPurchases.length + '</span></div>' +
            '</div>';
    
    // د هر درمل تفصیل
    let sortedPurchases = [...pharmacyPurchases].sort((a, b) => b.id - a.id);
    let visibleCount = 0;
    
    sortedPurchases.forEach(purchase => {
        let availableQty = purchaseAvailability[purchase.id];
        
        // که موجودي 0 او باقي 0 وي → مه ښکاره کړه
        if (availableQty <= 0 && purchase.remaining <= 0) return;
        
        visibleCount++;
        
        let purchasePayments = (data.payments || []).filter(p => p.purchaseId === purchase.id);
        
        let originalPaid = purchase.originalPaid !== undefined ? purchase.originalPaid : purchase.paid;
        let originalRemaining = purchase.originalRemaining !== undefined ? purchase.originalRemaining : purchase.remaining;
        
        // د پاتې پیسې حالت
        let topRemainingStatus = '';
        if (purchase.remaining > 0) {
            topRemainingStatus = '<div class="info-row"><span>🔴 پاتې پیسې (باقي):</span> <span style="color:#e74c3c; font-weight:bold;">AFN ' + originalRemaining.toFixed(2) + '</span></div>';
        } else {
            topRemainingStatus = '<div class="info-row"><span>پاتې پیسې (باقي):</span> <span style="color:#27ae60; font-weight:bold;">AFN 0.00 — حساب مکمل دی. 🟢</span></div>';
        }
        
        html += '<div class="info-card" style="border-right:4px solid #3498db;">' +
                '<h3>💊 ' + purchase.name + '</h3>' +
                '<div class="info-row"><span>📦 موجود مقدار:</span> <span>' + availableQty + ' دانې</span></div>' +
                '<div class="info-row"><span>💵 فی قیمت:</span> <span>AFN ' + purchase.price.toFixed(2) + '</span></div>' +
                '<div class="info-row"><span>💰 ټولې پیسې:</span> <span>AFN ' + purchase.total.toFixed(2) + '</span></div>' +
                '<div class="info-row"><span>💳 پر وخت ورکړې پیسې:</span> <span>AFN ' + originalPaid.toFixed(2) + '</span></div>' +
                topRemainingStatus +
                '<div class="info-row"><span>📅 د اخیستلو نېټه:</span> <span>' + purchase.date + '</span></div>';
        
        // د ورکړو تاریخچه
        if (purchasePayments.length > 0) {
            html += '<div class="payment-history">' +
                    '<h4 style="color:#1a6b8a; font-size:14px; margin-top:10px; margin-bottom:5px;">📋 د ورکړو تاریخچه:</h4>';
            
            let sortedPayments = [...purchasePayments].sort((a, b) => a.id - b.id);
            
            sortedPayments.forEach(pay => {
                html += '<div style="background:#f0f8fb; padding:10px; border-radius:8px; margin-bottom:8px; border-right:4px solid #27ae60;">' +
                        '<div class="info-row" style="margin-bottom:5px;">' +
                        '<span>💵 وروسته ورکړل شوې:</span>' +
                        '<span style="color:#27ae60; font-weight:bold;">AFN ' + pay.amount.toFixed(2) + '</span>' +
                        '</div>' +
                        '<div class="info-row">' +
                        '<span>📅 نېټه:</span>' +
                        '<span>' + pay.date + '</span>' +
                        '</div>' +
                        '</div>';
            });
            
            // پاتې باقي
            let remainingColor = purchase.remaining > 0 ? '#e74c3c' : '#27ae60';
            let remainingText = purchase.remaining > 0 ? 
                'AFN ' + purchase.remaining.toFixed(2) : 
                'AFN 0.00 — حساب مکمل دی. 🟢';
            
            html += '<div style="background:#fff3cd; padding:12px; border-radius:8px; margin-top:10px; border-right:4px solid ' + remainingColor + ';">' +
                    '<div class="info-row">' +
                    '<span>🔴 پاتې باقي:</span>' +
                    '<span style="color:' + remainingColor + '; font-weight:bold; font-size:16px;">' + remainingText + '</span>' +
                    '</div>' +
                    '</div>';
            
            html += '</div>';
        }
        
        // د تادیې تڼۍ او فورم
        if (purchase.remaining > 0) {
            html += '<button class="payment-btn" onclick="togglePaymentForm(' + purchase.id + ')" style="margin-top:10px;">📥 پیسې ورکړل</button>' +
                    '<div id="payment-form-' + purchase.id + '" class="payment-form" style="display:none;">' +
                    '<div class="form-group" style="margin-top:10px;">' +
                    '<label>د تادیې اندازه (AFN):</label>' +
                    '<input type="number" id="payment-amount-' + purchase.id + '" placeholder="د پیسو اندازه" min="1" max="' + purchase.remaining + '">' +
                    '<small style="color:#666; font-size:12px;">د باقي اعظمي اندازه: AFN ' + purchase.remaining.toFixed(2) + '</small>' +
                    '</div>' +
                    '<button class="submit-btn" onclick="savePayment(' + purchase.id + ')">📥 تادیه ثبتول</button>' +
                    '</div>';
        }
        
        html += '</div>';
    });
    
    // که هېڅ درمل نه وي پاتې شوي
    if (visibleCount === 0) {
        html += '<p class="empty-msg">🎉 د دې درملتون ټول درمل پلورل شوي او ټولې پیسې ورکړل شوې دي.</p>';
    }
    
    inventoryDiv.innerHTML = html;
}


/* ===================================================================
   ۱۱. 📋 د دواخانو لیست
   =================================================================== */

/* -------------------------------------------------------------------
   renderPharmacies() - د دواخانو لیست (یوازې نومونه)
   -------------------------------------------------------------------
   دا فنکشن یوازې هغه درملتونونه ښیي چې پوروړي دي (باقي > 0).
   ------------------------------------------------------------------- */
function renderPharmacies() {
    let data = getData();
    let pharmacyDiv = document.getElementById('pharmacy-list');
    
    if (data.sales.length === 0) {
        pharmacyDiv.innerHTML = '<p class="empty-msg">تر اوسه هېڅ پلور ثبت شوی نه دی.</p>';
        return;
    }

    // د درملتونونو ګروپ کول
    let grouped = {};
    data.sales.forEach(s => {
        if (!grouped[s.pharmacy]) {
            grouped[s.pharmacy] = {
                name: s.pharmacy,
                total: 0,
                currentRemaining: 0,
                salesCount: 0,
                lastId: 0
            };
        }
        grouped[s.pharmacy].total += s.total;
        grouped[s.pharmacy].currentRemaining += s.remaining;
        grouped[s.pharmacy].salesCount += 1;
        
        if (s.id > grouped[s.pharmacy].lastId) {
            grouped[s.pharmacy].lastId = s.id;
        }
    });

    // یوازې هغه درملتونونه چې اوسنی باقي لري
    let sortedPharmacies = Object.values(grouped)
        .filter(item => item.currentRemaining > 0)
        .sort((a, b) => b.lastId - a.lastId);

    if (sortedPharmacies.length === 0) {
        pharmacyDiv.innerHTML = '<p class="empty-msg">🎉 ټول پورونه خلاص شوي دي — هېڅ درملتون پوروړی نه دی.</p>';
        return;
    }

    let html = '';
    sortedPharmacies.forEach(item => {
        html += '<div onclick="showPharmacyDetail(\'' + item.name.replace(/'/g, "\\'") + '\')" ' +
                'style="background:white; padding:20px; border-radius:12px; margin-bottom:10px; ' +
                'box-shadow:0 2px 8px rgba(0,0,0,0.08); cursor:pointer; border-right:4px solid #1a6b8a; ' +
                'transition: all 0.2s; display:flex; justify-content:space-between; align-items:center;">' +
                '<h3 style="color:#1a6b8a; margin:0; font-size:18px;">🏪 ' + item.name + '</h3>' +
                '<span style="color:#999; font-size:24px;">›</span>' +
                '</div>';
    });
    pharmacyDiv.innerHTML = html;
}

/* -------------------------------------------------------------------
   showPharmacyDetail() - د یو درملتون تفصیل
   -------------------------------------------------------------------
   دا فنکشن د یو درملتون ټول پلورونه ښیي.
   یوازې هغه پلورونه چې باقي لري.
   ------------------------------------------------------------------- */
function showPharmacyDetail(pharmacyName) {
    let data = getData();
    let pharmacyDiv = document.getElementById('pharmacy-list');
    
    let pharmacySales = data.sales.filter(s => s.pharmacy === pharmacyName);
    
    if (pharmacySales.length === 0) {
        pharmacyDiv.innerHTML = '<p class="empty-msg">هېڅ معلومات نشته.</p>';
        return;
    }
    
    // ټولټال
    let totalSales = pharmacySales.reduce((sum, s) => sum + s.total, 0);
    let totalPaid = pharmacySales.reduce((sum, s) => sum + (s.originalPaid !== undefined ? s.originalPaid : s.paid), 0);
    let totalRemaining = pharmacySales.reduce((sum, s) => sum + s.remaining, 0);
    let originalRemaining = pharmacySales.reduce((sum, s) => sum + (s.originalRemaining !== undefined ? s.originalRemaining : 0), 0);
    
    let html = '';
    
    // د بیرته تګ تڼۍ
    html += '<button class="back-btn" onclick="renderPharmacies()" style="background:#6c757d;">⬅️ بیرته دواخانو ته</button>';
    
    // د درملتون نوم
    html += '<div class="info-card" style="border-right:4px solid #1a6b8a;">' +
            '<h2 style="color:#1a6b8a; text-align:center; margin-bottom:15px;">🏪 ' + pharmacyName + '</h2>' +
            '<div class="info-row"><span>📦 د پلورونو شمیر:</span> <span>' + pharmacySales.length + '</span></div>' +
            '<div class="info-row"><span>💰 ټول پلور:</span> <span>AFN ' + totalSales.toFixed(2) + '</span></div>' +
            '<div class="info-row"><span>💳 د پلور پر وخت ترلاسه شوې:</span> <span>AFN ' + totalPaid.toFixed(2) + '</span></div>' +
            '<div class="info-row"><span>🔴 پاتې پیسې (باقي):</span> <span style="color:#e74c3c; font-weight:bold;">AFN ' + originalRemaining.toFixed(2) + '</span></div>' +
            '</div>';
    
    // د هر پلور تفصیل
    html += '<h3 style="color:#3498db; text-align:center; margin:20px 0 15px; font-size:16px;">📋 پلورل شوي درمل:</h3>';
    
    let sortedSales = [...pharmacySales].sort((a, b) => b.id - a.id);
    let visibleCount = 0;
    
    sortedSales.forEach((sale, index) => {
        // که باقي 0 وي → مه ښکاره کړه
        if (sale.remaining <= 0) return;
        
        visibleCount++;
        
        let saleRemaining = sale.remaining;
        let salePaid = sale.originalPaid !== undefined ? sale.originalPaid : sale.paid;
        
        let remainingColor = saleRemaining > 0 ? '#e74c3c' : '#27ae60';
        let remainingText = saleRemaining > 0 ? 
            'AFN ' + saleRemaining.toFixed(2) : 
            'AFN 0.00 — حساب مکمل دی. 🟢';
        
        html += '<div class="info-card" style="border-right:4px solid #3498db;">' +
                '<h3>💊 ' + sale.name + '</h3>' +
                '<div class="info-row"><span>📦 تعداد:</span> <span>' + sale.qty + ' دانې</span></div>' +
                '<div class="info-row"><span>💵 فی قیمت:</span> <span>AFN ' + sale.price.toFixed(2) + '</span></div>' +
                '<div class="info-row"><span>💰 ټولې پیسې:</span> <span>AFN ' + sale.total.toFixed(2) + '</span></div>' +
                '<div class="info-row"><span>💳 پر وخت ترلاسه شوې:</span> <span>AFN ' + salePaid.toFixed(2) + '</span></div>' +
                '<div class="info-row"><span>🔴 پاتې پیسې (باقي):</span> <span style="color:' + remainingColor + '; font-weight:bold;">' + remainingText + '</span></div>' +
                '<div class="info-row"><span>📅 د پلور نېټه:</span> <span>' + sale.date + '</span></div>' +
                '</div>';
    });
    
    if (visibleCount === 0) {
        html += '<p class="empty-msg">🎉 د دې درملتون ټول پورونه خلاص شوي دي.</p>';
    }
    
    // د وروسته ورکړو تاریخچه
    let pharmacyPayments = (data.payments || []).filter(p => p.pharmacy === pharmacyName);
    
    if (pharmacyPayments.length > 0) {
        html += '<div class="payment-history">' +
                '<h4 style="color:#1a6b8a; font-size:14px; margin-top:15px; margin-bottom:8px;">📋 د وروسته ورکړو تاریخچه:</h4>';
        
        let sortedPayments = [...pharmacyPayments].sort((a, b) => a.id - b.id);
        
        sortedPayments.forEach(pay => {
            let remainingAfter = pay.remainingAfter !== undefined ? pay.remainingAfter : 0;
            let remainingColor = remainingAfter > 0 ? '#e74c3c' : '#27ae60';
            let remainingText = remainingAfter > 0 ? 
                'AFN ' + remainingAfter.toFixed(2) : 
                'AFN 0.00 — حساب مکمل دی. 🟢';
            
            html += '<div style="background:#f0f8fb; padding:10px; border-radius:8px; margin-bottom:8px; border-right:4px solid #27ae60;">' +
                    '<div class="info-row" style="margin-bottom:5px;">' +
                    '<span>💵 وروسته ترلاسه شوې:</span>' +
                    '<span style="color:#27ae60; font-weight:bold;">AFN ' + pay.amount.toFixed(2) + '</span>' +
                    '</div>' +
                    '<div class="info-row" style="margin-bottom:5px;">' +
                    '<span>📅 نېټه:</span>' +
                    '<span>' + pay.date + '</span>' +
                    '</div>' +
                    '<div class="info-row">' +
                    '<span>💰 پاتې:</span>' +
                    '<span style="color:' + remainingColor + '; font-weight:bold;">' + remainingText + '</span>' +
                    '</div>' +
                    '</div>';
        });
        
        html += '</div>';
    }
    
    // د تادیې تڼۍ
    if (totalRemaining > 0) {
        let formId = 'pharmacy-form-detail';
        let inputId = 'pharmacy-payment-detail';
        
        html += '<button class="payment-btn" onclick="togglePharmacyPaymentForm(\'' + pharmacyName.replace(/'/g, "\\'") + '\')" style="margin-top:15px;">📥 پاتې پیسې ورکول</button>' +
                '<div id="' + formId + '" class="payment-form" style="display:none;">' +
                '<div class="form-group" style="margin-top:10px;">' +
                '<label>د تادیې اندازه (AFN):</label>' +
                '<input type="number" id="' + inputId + '" placeholder="د پیسو اندازه" min="1" max="' + totalRemaining + '">' +
                '<small style="color:#666; font-size:12px;">د باقي اعظمي اندازه: AFN ' + totalRemaining.toFixed(2) + '</small>' +
                '</div>' +
                '<button class="submit-btn" onclick="savePharmacyPayment(\'' + pharmacyName.replace(/'/g, "\\'") + '\')">📥 تادیه ثبتول</button>' +
                '</div>';
    }
    
    pharmacyDiv.innerHTML = html;
}


/* ===================================================================
   ۱۲. 🔍 د لټون سیسټم
   =================================================================== */

/* -------------------------------------------------------------------
   searchMedicine() - د درملو او درملتونونو لټون
   -------------------------------------------------------------------
   دا فنکشن:
   - د درملو نوم لټوي
   - د درملتون نوم لټوي
   - پایلې په څو برخو کې ښیي
   ------------------------------------------------------------------- */
function searchMedicine() {
    let query = document.getElementById('search-input').value.trim().toLowerCase();
    let resultsDiv = document.getElementById('search-results');
    
    if (!query) {
        resultsDiv.innerHTML = '';
        return;
    }

    let data = getData();
    
    // 📥 د اخیستلو پایلې
    let purchaseResults = data.purchases.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.pharmacy && p.pharmacy.toLowerCase().includes(query))
    );
    purchaseResults.sort((a, b) => b.id - a.id);
    
    // 📤 د پلور پایلې
    let saleResults = data.sales.filter(s => 
        s.name.toLowerCase().includes(query) ||
        (s.pharmacy && s.pharmacy.toLowerCase().includes(query))
    );
    saleResults.sort((a, b) => b.id - a.id);

    if (purchaseResults.length === 0 && saleResults.length === 0) {
        resultsDiv.innerHTML = '<p class="empty-msg">🔍 هېڅ دوا ونه موندل شوه.</p>';
        return;
    }

    let html = '';

    // ۱. 📦 موجوده مال
    let medicineNames = new Set();
    purchaseResults.forEach(p => medicineNames.add(p.name.toLowerCase().trim()));
    
    let stockItems = [];
    medicineNames.forEach(nameLower => {
        let totalBought = data.purchases
            .filter(p => p.name.toLowerCase().trim() === nameLower)
            .reduce((sum, p) => sum + p.qty, 0);
        
        let totalSold = data.sales
            .filter(s => s.name.toLowerCase().trim() === nameLower)
            .reduce((sum, s) => sum + s.qty, 0);
        
        let available = totalBought - totalSold;
        
        if (available > 0) {
            let originalName = data.purchases.find(p => 
                p.name.toLowerCase().trim() === nameLower
            )?.name || nameLower;
            
            stockItems.push({
                name: originalName,
                quantity: available
            });
        }
    });
    
    if (stockItems.length > 0) {
        html += '<h3 style="color:#27ae60; text-align:center; margin:20px 0 15px; font-size:18px;">📦 موجوده مال (' + stockItems.length + ')</h3>';
        stockItems.forEach(item => {
            html += '<div class="info-card" style="border-right:4px solid #27ae60; background:#f0fdf4;">' +
                    '<h3>💊 ' + item.name + '</h3>' +
                    '<div class="info-row"><span>📦 موجود مقدار:</span> <span style="color:#27ae60; font-weight:bold;">' + item.quantity + ' دانې</span></div>' +
                    '</div>';
        });
    }

    // ۲. 🔴 زما پور
    let myDebts = purchaseResults.filter(p => p.remaining > 0);
    
    if (myDebts.length > 0) {
        html += '<h3 style="color:#e74c3c; text-align:center; margin:25px 0 15px; font-size:18px;">🔴 زما پور (' + myDebts.length + ')</h3>';
        myDebts.forEach(item => {
            html += '<div class="info-card" style="border-right:4px solid #e74c3c; background:#fef2f2;">' +
                    '<h3>💊 ' + item.name + '</h3>' +
                    '<div class="info-row"><span>🏪 له درملتون:</span> <span>' + item.pharmacy + '</span></div>' +
                    '<div class="info-row"><span>📦 تعداد:</span> <span>' + item.qty + '</span></div>' +
                    '<div class="info-row"><span>🔴 باقي:</span> <span style="color:#e74c3c; font-weight:bold;">AFN ' + item.remaining.toFixed(2) + '</span></div>' +
                    '<div class="info-row"><span>📅 نېټه:</span> <span>' + item.date + '</span></div>' +
                    '</div>';
        });
    }

    // ۳. 🟣 دوی پوروړي
    let theirDebts = saleResults.filter(s => s.remaining > 0);
    
    if (theirDebts.length > 0) {
        html += '<h3 style="color:#8e44ad; text-align:center; margin:25px 0 15px; font-size:18px;">🟣 دوی پوروړي (' + theirDebts.length + ')</h3>';
        theirDebts.forEach(item => {
            html += '<div class="info-card" style="border-right:4px solid #8e44ad; background:#faf5ff;">' +
                    '<h3>💊 ' + item.name + '</h3>' +
                    '<div class="info-row"><span>🏪 درملتون:</span> <span>' + item.pharmacy + '</span></div>' +
                    '<div class="info-row"><span>📦 تعداد:</span> <span>' + item.qty + '</span></div>' +
                    '<div class="info-row"><span>🔴 اوسنی باقي:</span> <span style="color:#8e44ad; font-weight:bold;">AFN ' + item.remaining.toFixed(2) + '</span></div>' +
                    '<div class="info-row"><span>📅 نېټه:</span> <span>' + item.date + '</span></div>' +
                    '</div>';
        });
    }

    // ۴. 📥 د اخیستلو تاریخچه
    if (purchaseResults.length > 0) {
        html += '<h3 style="color:#3498db; text-align:center; margin:25px 0 15px; font-size:18px;">📥 د اخیستلو تاریخچه (' + purchaseResults.length + ')</h3>';
        purchaseResults.forEach(item => {
            html += '<div class="info-card" style="border-right:4px solid #3498db;">' +
                    '<h3>💊 ' + item.name + '</h3>' +
                    '<div class="info-row"><span>🏪 له درملتون:</span> <span>' + item.pharmacy + '</span></div>' +
                    '<div class="info-row"><span>📦 تعداد:</span> <span>' + item.qty + '</span></div>' +
                    '<div class="info-row"><span>💰 ټولې پیسې:</span> <span>AFN ' + item.total.toFixed(2) + '</span></div>' +
                    '<div class="info-row"><span>📅 نېټه:</span> <span>' + item.date + '</span></div>' +
                    '</div>';
        });
    }

    // ۵. 📤 د پلور تاریخچه
    if (saleResults.length > 0) {
        html += '<h3 style="color:#9b59b6; text-align:center; margin:25px 0 15px; font-size:18px;">📤 د پلور تاریخچه (' + saleResults.length + ')</h3>';
        saleResults.forEach(item => {
            html += '<div class="info-card" style="border-right:4px solid #9b59b6;">' +
                    '<h3>💊 ' + item.name + '</h3>' +
                    '<div class="info-row"><span>🏪 درملتون:</span> <span>' + item.pharmacy + '</span></div>' +
                    '<div class="info-row"><span>📦 تعداد:</span> <span>' + item.qty + '</span></div>' +
                    '<div class="info-row"><span>💰 ټولې پیسې:</span> <span>AFN ' + item.total.toFixed(2) + '</span></div>' +
                    '<div class="info-row"><span>📅 نېټه:</span> <span>' + item.date + '</span></div>' +
                    '</div>';
        });
    }

    resultsDiv.innerHTML = html;
}


/* ===================================================================
   ۱۳. 📊 د نن ورځې راپور
   =================================================================== */

/* -------------------------------------------------------------------
   renderDailyReport() - د یوې ورځې راپور جوړول
   -------------------------------------------------------------------
   دا فنکشن:
   - د ټاکلې ورځې پلورونه ښیي
   - د ټاکلې ورځې اخیستل ښیي
   - د ټاکلې ورځې تادیات ښیي
   - ګټه/تاوان محاسبه کوي
   ------------------------------------------------------------------- */
function renderDailyReport() {
    let dateInput = document.getElementById('report-date');
    let contentDiv = document.getElementById('report-content');
    
    // که نېټه نه وي ټاکل شوې، نن ورځ وکاروه
    if (!dateInput.value) {
        let today = new Date();
        let yyyy = today.getFullYear();
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = yyyy + '-' + mm + '-' + dd;
    }
    
    // د نېټې بدلول (YYYY-MM-DD → YYYY/MM/DD)
    let selectedDate = dateInput.value.replace(/-/g, '/');
    
    let data = getData();
    
    // د ټاکلې ورځې معلومات
    let todaySales = data.sales.filter(s => s.date === selectedDate);
    let todayPurchases = data.purchases.filter(p => p.date === selectedDate);
    let todayPayments = (data.payments || []).filter(p => p.date === selectedDate);
    
    // محاسبې
    let totalSales = todaySales.reduce((sum, s) => sum + s.total, 0);
    let cashReceived = todaySales.reduce((sum, s) => sum + (s.originalPaid || s.paid || 0), 0);
    let totalRemaining = todaySales.reduce((sum, s) => sum + (s.originalRemaining || 0), 0);
    let totalBuy = todayPurchases.reduce((sum, p) => sum + p.total, 0);
    
    // د پلورل شوو درملو قیمت
    let costOfSoldGoods = 0;
    todaySales.forEach(sale => {
        let sameNamePurchases = data.purchases.filter(p => 
            p.name.toLowerCase().trim() === sale.name.toLowerCase().trim()
        );
        
        if (sameNamePurchases.length > 0) {
            let totalQty = sameNamePurchases.reduce((sum, p) => sum + p.qty, 0);
            let totalCost = sameNamePurchases.reduce((sum, p) => sum + p.total, 0);
            let avgPrice = totalQty > 0 ? (totalCost / totalQty) : 0;
            costOfSoldGoods += avgPrice * sale.qty;
        }
    });
    
    let netProfit = totalSales - costOfSoldGoods;
    
    // ============================================
    // 🎨 د HTML جوړول
    // ============================================
    let html = '';
    
    // 📅 نېټه
    html += '<div style="text-align:center; background:linear-gradient(135deg, #667eea, #764ba2); color:white; padding:15px; border-radius:12px; margin-bottom:20px;">' +
            '<div style="font-size:14px; opacity:0.9;">📅 د راپور نېټه</div>' +
            '<div style="font-size:22px; font-weight:bold; margin-top:5px;">' + selectedDate + '</div>' +
            '</div>';
    
    // 💊 د پلورل شوو درملو لیست
    html += '<div class="info-card" style="border-right:4px solid #3498db;">' +
            '<h3 style="color:#3498db;">💊 نن پلورل شوي درمل (' + todaySales.length + ')</h3>';
    
    if (todaySales.length === 0) {
        html += '<p style="color:#999; text-align:center; padding:15px;">نن هېڅ پلور نه دی شوی.</p>';
    } else {
        todaySales.forEach(sale => {
            html += '<div class="info-row" style="border-bottom:1px dashed #eee; padding:8px 0;">' +
                    '<span>💊 ' + sale.name + ' <span style="color:#666;">(' + sale.qty + ' × ' + sale.price.toFixed(2) + ')</span></span>' +
                    '<span style="color:#27ae60; font-weight:bold;">AFN ' + sale.total.toFixed(2) + '</span>' +
                    '</div>';
        });
    }
    html += '</div>';
    
    // 📊 د پلور احصائیې
    html += '<div class="info-card" style="border-right:4px solid #27ae60;">' +
            '<h3 style="color:#27ae60;">📤 د پلور احصائیې</h3>' +
            '<div class="info-row"><span>📦 د پلورونو شمیر:</span> <span>' + todaySales.length + '</span></div>' +
            '<div class="info-row"><span>💰 ټول پلور:</span> <span style="color:#27ae60; font-weight:bold;">AFN ' + totalSales.toFixed(2) + '</span></div>' +
            '<div class="info-row"><span>💳 پر وخت ترلاسه شوې:</span> <span style="color:#27ae60; font-weight:bold;">AFN ' + cashReceived.toFixed(2) + '</span></div>' +
            '<div class="info-row"><span>🔴 پاتې پیسې (باقي):</span> <span style="color:#e74c3c; font-weight:bold;">AFN ' + totalRemaining.toFixed(2) + '</span></div>' +
            '</div>';
    
    // 📥 اخیستل
    html += '<div class="info-card" style="border-right:4px solid #3498db;">' +
            '<h3 style="color:#3498db;">📥 نن اخیستل</h3>' +
            '<div class="info-row"><span>📦 د اخیستلو شمیر:</span> <span>' + todayPurchases.length + '</span></div>' +
            '<div class="info-row"><span>💰 ټول اخیستل:</span> <span style="color:#3498db; font-weight:bold;">AFN ' + totalBuy.toFixed(2) + '</span></div>' +
            '</div>';
    
    // 💳 تادیات
    if (todayPayments.length > 0) {
        let totalPaymentsAmount = todayPayments.reduce((sum, p) => sum + p.amount, 0);
        html += '<div class="info-card" style="border-right:4px solid #f39c12;">' +
                '<h3 style="color:#f39c12;">💳 نن تادیات</h3>' +
                '<div class="info-row"><span>📦 د تادیاتو شمیر:</span> <span>' + todayPayments.length + '</span></div>' +
                '<div class="info-row"><span>💰 ټولې تادیې:</span> <span style="color:#f39c12; font-weight:bold;">AFN ' + totalPaymentsAmount.toFixed(2) + '</span></div>' +
                '</div>';
    }
    
    // 🎯 د ګټې/تاوان لنډیز
    let profitColor = netProfit >= 0 ? '#27ae60' : '#e74c3c';
    let profitIcon = netProfit >= 0 ? '🟢' : '🔴';
    let profitText = netProfit >= 0 ? 'خالصه ګټه' : 'تاوان';
    
    html += '<div class="info-card" style="border-right:4px solid ' + profitColor + '; background:' + (netProfit >= 0 ? '#f0fdf4' : '#fef2f2') + ';">' +
            '<h3 style="color:' + profitColor + ';">' + profitIcon + ' د نن لنډیز</h3>' +
            '<div class="info-row"><span>💰 ټول پلور:</span> <span style="font-weight:bold;">AFN ' + totalSales.toFixed(2) + '</span></div>' +
            '<div class="info-row"><span>📦 د پلورل شوو قیمت:</span> <span>AFN ' + costOfSoldGoods.toFixed(2) + '</span></div>' +
            '<div style="border-top:2px solid ' + profitColor + '; margin:10px 0; padding-top:10px;">' +
            '<div class="info-row"><span style="font-size:18px; font-weight:bold; color:' + profitColor + ';">' + profitText + ':</span>' +
            '<span style="font-size:20px; font-weight:bold; color:' + profitColor + ';">AFN ' + Math.abs(netProfit).toFixed(2) + '</span></div>' +
            '</div>' +
            '</div>';
    
    contentDiv.innerHTML = html;
}


/* ===================================================================
   ۱۴. 🧹 د فورمونو پاکول
   =================================================================== */

function clearBuyForm() {
    let fields = ['buy-pharmacy', 'buy-name', 'buy-qty', 'buy-price', 'buy-total', 'buy-paid', 'buy-remaining'];
    fields.forEach(id => {
        let field = document.getElementById(id);
        if (field) field.value = '';
    });
}

function clearSellForm() {
    let fields = ['sell-pharmacy', 'sell-name', 'sell-qty', 'sell-price', 'sell-total', 'sell-paid', 'sell-remaining'];
    fields.forEach(id => {
        let field = document.getElementById(id);
        if (field) field.value = '';
    });
    
    let indicator = document.getElementById('profit-indicator');
    if (indicator) indicator.style.display = 'none';
}

function clearSearchForm() {
    let field = document.getElementById('search-input');
    if (field) field.value = '';
    
    let results = document.getElementById('search-results');
    if (results) results.innerHTML = '';
}


/* ===================================================================
   ۱۵. 💰 د پاتې پیسو تادیه (له درملتون څخه)
   =================================================================== */

/* -------------------------------------------------------------------
   savePayment() - د درملتون د پور تادیه
   -------------------------------------------------------------------
   دا فنکشن د یو اخیستنې پور کموي.
   - originalPaid: نه بدلیږي (ثابت)
   - remaining: کمیږي (د تادیاتو سره)
   ------------------------------------------------------------------- */
function savePayment(purchaseId) {
    let amountInput = document.getElementById('payment-amount-' + purchaseId);
    let amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showAlert('خطا!', '<p>مهرباني وکړئ د تادیې اندازه ولیکئ!</p>', 'error');
        return;
    }

    let data = getData();
    let purchase = data.purchases.find(p => p.id === purchaseId);
    
    if (!purchase) {
        showAlert('خطا!', '<p>دا اخیستنه ونه موندل شوه!</p>', 'error');
        return;
    }

    if (amount > purchase.remaining) {
        showAlert(
            'تېروتنه!',
            '<p>تادیه د باقي (AFN ' + purchase.remaining.toFixed(2) + ') څخه زیاته نشي کیدای!</p>',
            'error'
        );
        amountInput.focus();
        return;
    }

    // د تادیې ثبتول
    if (!data.payments) data.payments = [];
    data.payments.push({
        id: Date.now(),
        purchaseId: purchaseId,
        amount: amount,
        date: getTodayDate()
    });

    // یوازې remaining کمیږي — paid نه بدلیږي
    purchase.remaining -= amount;
    saveData(data);

    showAlert(
        'تادیه ثبت شوه!',
        '<div class="row"><span>💵 تادیه:</span><strong>AFN ' + amount.toFixed(2) + '</strong></div>' +
        '<div class="row"><span>📅 نېټه:</span><strong>' + getTodayDate() + '</strong></div>' +
        '<div class="row"><span>🔴 پاتې باقي:</span><strong>AFN ' + purchase.remaining.toFixed(2) + '</strong></div>',
        'success'
    );

    showInventoryPharmacy(purchase.pharmacy);
    updateStats();
}

/* -------------------------------------------------------------------
   togglePaymentForm() - د تادیې فورم ښکاره/پټول
   ------------------------------------------------------------------- */
function togglePaymentForm(purchaseId) {
    let formDiv = document.getElementById('payment-form-' + purchaseId);
    if (formDiv) {
        if (formDiv.style.display === 'none' || formDiv.style.display === '') {
            formDiv.style.display = 'block';
        } else {
            formDiv.style.display = 'none';
        }
    }
}


/* ===================================================================
   ۱۶. 💵 د دواخانو د پور تادیه
   =================================================================== */

/* -------------------------------------------------------------------
   savePharmacyPayment() - د درملتون د پور تادیه
   -------------------------------------------------------------------
   دا فنکشن د یو درملتون ټول پور کموي.
   - remainingAfter: د تادیې وروسته پاتې (ذخیره کیږي)
   ------------------------------------------------------------------- */
function savePharmacyPayment(pharmacyName) {
    // د دواړو id وګوره (لیست + تفصیل)
    let listInputId = 'pharmacy-payment-' + pharmacyName.replace(/\s/g, '_');
    let detailInputId = 'pharmacy-payment-detail';
    
    let amountInput = document.getElementById(listInputId) || document.getElementById(detailInputId);
    
    if (!amountInput) {
        showAlert('خطا!', '<p>د تادیې فورم ونه موندل شو!</p>', 'error');
        return;
    }
    
    let amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showAlert('خطا!', '<p>مهرباني وکړئ د تادیې اندازه ولیکئ!</p>', 'error');
        return;
    }

    let data = getData();
    
    // د دې درملتون پلورونه چې باقي لري
    let pharmacySales = data.sales.filter(s => 
        s.pharmacy === pharmacyName && s.remaining > 0
    );
    
    if (pharmacySales.length === 0) {
        showAlert('خطا!', '<p>د دې درملتون باقي نشته!</p>', 'error');
        return;
    }

    let totalRemaining = pharmacySales.reduce((sum, s) => sum + s.remaining, 0);

    if (amount > totalRemaining) {
        showAlert(
            'تېروتنه!',
            '<p>تادیه د ټول باقي (AFN ' + totalRemaining.toFixed(2) + ') څخه زیاته نشي کیدای!</p>',
            'error'
        );
        amountInput.focus();
        return;
    }

    let newRemaining = totalRemaining - amount;

    // د تادیې ثبتول
    if (!data.payments) data.payments = [];
    data.payments.push({
        id: Date.now(),
        pharmacy: pharmacyName,
        amount: amount,
        remainingAfter: newRemaining,
        date: getTodayDate()
    });

    // د پور کموالی
    let remainingToPay = amount;
    for (let i = 0; i < pharmacySales.length; i++) {
        if (remainingToPay <= 0) break;
        
        let sale = pharmacySales[i];
        let saleIndex = data.sales.findIndex(s => s.id === sale.id);
        
        if (remainingToPay >= sale.remaining) {
            remainingToPay -= sale.remaining;
            data.sales[saleIndex].remaining = 0;
        } else {
            data.sales[saleIndex].remaining -= remainingToPay;
            remainingToPay = 0;
        }
    }

    saveData(data);

    showAlert(
        'تادیه ثبت شوه!',
        '<div class="row"><span>🏪 درملتون:</span><strong>' + pharmacyName + '</strong></div>' +
        '<div class="row"><span>💵 تادیه:</span><strong>AFN ' + amount.toFixed(2) + '</strong></div>' +
        '<div class="row"><span>📅 نېټه:</span><strong>' + getTodayDate() + '</strong></div>' +
        '<div class="row"><span>💰 پاتې باقي:</span><strong>AFN ' + newRemaining.toFixed(2) + '</strong></div>',
        'success'
    );

    showPharmacyDetail(pharmacyName);
    updateStats();
}

/* -------------------------------------------------------------------
   togglePharmacyPaymentForm() - د تادیې فورم ښکاره/پټول
   ------------------------------------------------------------------- */
function togglePharmacyPaymentForm(pharmacyName) {
    let listId = 'pharmacy-form-' + pharmacyName.replace(/\s/g, '_');
    let listForm = document.getElementById(listId);
    if (listForm) {
        if (listForm.style.display === 'none' || listForm.style.display === '') {
            listForm.style.display = 'block';
        } else {
            listForm.style.display = 'none';
        }
    }
    
    let detailForm = document.getElementById('pharmacy-form-detail');
    if (detailForm) {
        if (detailForm.style.display === 'none' || detailForm.style.display === '') {
            detailForm.style.display = 'block';
        } else {
            detailForm.style.display = 'none';
        }
    }
}


/* ===================================================================
   ۱۷. 🎯 د ګټې/تاوان چراغ
   =================================================================== */

/* -------------------------------------------------------------------
   checkProfitIndicator() - د ګټې/تاوان چراغ چک کول
   -------------------------------------------------------------------
   کله چې کاروونکی د پلور فورم ډکوي، دا فنکشن:
   - د اخیستلو اوسط قیمت محاسبه کوي
   - د پلور قیمت سره پرتله کوي
   - شین/سور/ژېړ چراغ ښیي
   ------------------------------------------------------------------- */
function checkProfitIndicator() {
    let sellName = document.getElementById('sell-name').value.trim();
    let sellPrice = parseFloat(document.getElementById('sell-price').value) || 0;
    
    let indicator = document.getElementById('profit-indicator');
    let text = document.getElementById('indicator-text');
    
    if (!sellName || sellPrice <= 0) {
        indicator.style.display = 'none';
        return;
    }
    
    let data = getData();
    let nameLower = sellName.toLowerCase().trim();
    
    let samePurchases = data.purchases.filter(p => 
        p.name.toLowerCase().trim() === nameLower
    );
    
    if (samePurchases.length === 0) {
        indicator.style.display = 'none';
        return;
    }
    
    let totalQty = samePurchases.reduce((sum, p) => sum + p.qty, 0);
    let totalCost = samePurchases.reduce((sum, p) => sum + p.total, 0);
    let avgBuyPrice = totalQty > 0 ? (totalCost / totalQty) : 0;
    
    let diff = sellPrice - avgBuyPrice;
    
    indicator.style.display = 'flex';
    indicator.classList.remove('yellow', 'green', 'red');
    
    let percentDiff = avgBuyPrice > 0 ? ((diff / avgBuyPrice) * 100) : 0;
    
    if (Math.abs(diff) < 0.01) {
        indicator.classList.add('yellow');
        text.innerText = '🟡 نه ګټه، نه تاوان — فی قیمت مساوي دی';
    } else if (diff > 0) {
        indicator.classList.add('green');
        text.innerText = '🟢 ګټه — AFN ' + diff.toFixed(2) + ' (' + percentDiff.toFixed(1) + '%)';
    } else {
        indicator.classList.add('red');
        text.innerText = '🔴 تاوان — AFN ' + Math.abs(diff).toFixed(2) + ' (' + Math.abs(percentDiff).toFixed(1) + '%)';
    }
}


/* ===================================================================
   ۱۸. 💾 د بیکپ سیسټم
   =================================================================== */

/* -------------------------------------------------------------------
   copyBackup() - د معلوماتو کاپي کول
   -------------------------------------------------------------------
   دا فنکشن ټول معلومات د JSON په بڼه کاپي کوي.
   کاروونکی یې په Notes/WhatsApp کې ساتلی شي.
   ------------------------------------------------------------------- */
function copyBackup() {
    let data = getData();
    let backupText = JSON.stringify(data);
    
    // د کاپي لپاره یو لنډمهاله textarea
    let textarea = document.createElement('textarea');
    textarea.value = backupText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    textarea.focus();
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        showAlert(
            '✅',
            '<p style="text-align:center; font-size:16px; color:#333;">معلومات کاپي شول په خوندي ځای کې یې وساتئ.</p>',
            'success'
        );
    } catch (error) {
        // که copy کار ونه کړ
        showAlert(
            '❌ Copy کار ونه کړ',
            '<p>دا متن په لاس کاپي کړه:</p>' +
            '<textarea style="width:100%; height:150px; font-size:11px; direction:ltr;" onclick="this.select()">' + backupText + '</textarea>',
            'error'
        );
    }
    
    document.body.removeChild(textarea);
}

/* -------------------------------------------------------------------
   restoreData() - د معلوماتو بحالول (پینل)
   -------------------------------------------------------------------
   دا فنکشن یو پینل پرانیزي چې کاروونکی پکې د بیکپ متن پیست کړي.
   ------------------------------------------------------------------- */
function restoreData() {
    let box = document.createElement('div');
    box.id = 'restoreBox';
    box.innerHTML = `
        <div style="
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:white;
            z-index:9999;
            padding:20px;
            box-sizing:border-box;
            overflow-y:auto;
        ">
            <h2 style="text-align:center; color:#f39c12; margin-bottom:15px;">
                📥 Restore Backup
            </h2>
            
            <p style="text-align:center; color:#666; margin-bottom:10px;">
                خپل Backup JSON متن دلته Paste کړئ:
            </p>
            
            <textarea
                id="restoreText"
                style="
                    width:100%;
                    height:60%;
                    min-height:300px;
                    font-size:12px;
                    direction:ltr;
                    box-sizing:border-box;
                    padding:10px;
                    border:2px solid #f39c12;
                    border-radius:8px;
                "
                placeholder="Backup JSON دلته Paste کړئ..."
            ></textarea>
            
            <br><br>
            
            <button
                onclick="processRestore()"
                style="
                    background:#27ae60;
                    color:white;
                    padding:15px;
                    border:none;
                    border-radius:10px;
                    font-size:16px;
                    font-weight:bold;
                    width:100%;
                    margin-bottom:10px;
                    cursor:pointer;
                "
            >
                ✅ Restore کول
            </button>
            
            <button
                onclick="document.getElementById('restoreBox').remove()"
                style="
                    background:#e74c3c;
                    color:white;
                    padding:15px;
                    border:none;
                    border-radius:10px;
                    font-size:16px;
                    font-weight:bold;
                    width:100%;
                    cursor:pointer;
                "
            >
                ❌ بندول
            </button>
        </div>
    `;
    
    document.body.appendChild(box);
}

/* -------------------------------------------------------------------
   processRestore() - د بیکپ بحالول
   -------------------------------------------------------------------
   دا فنکشن:
   - د پیست شوي متن JSON چک کوي
   - تصدیق غواړي
   - معلومات بحالوي
   ------------------------------------------------------------------- */
function processRestore() {
    let textarea = document.getElementById('restoreText');
    
    if (!textarea) return;
    
    let backupText = textarea.value.trim();
    
    if (!backupText) {
        showAlert('خطا!', '<p>Backup متن خالي دی.</p>', 'error');
        return;
    }
    
    try {
        let backup = JSON.parse(backupText);
        
        // د معلوماتو تاییدول
        if (!backup || !Array.isArray(backup.purchases) || !Array.isArray(backup.sales)) {
            showAlert('خطا!', '<p>Backup معلومات سم نه دي.</p>', 'error');
            return;
        }
        
        // تصدیق
        if (!confirm('ایا غواړې هغه معلومات بېرته داخل کړې چې موږ کاپي کړي وو؟')) {
            return;
        }
        
        // د ډاټا بحالول
        let newData = {
            purchases: backup.purchases,
            sales: backup.sales,
            expenses: backup.expenses || [],
            payments: backup.payments || []
        };
        
        saveData(newData);
        
        showAlert(
            '',
            '<p style="text-align:center; font-size:16px; color:#333;">معلومات په بریالی توګه داخل شول. ✅</p>',
            'success'
        );
        
        // د پینل بندول
        let restoreBox = document.getElementById('restoreBox');
        if (restoreBox) restoreBox.remove();
        
        updateStats();
        showPage('home-page');
        
    } catch (error) {
        showAlert(
            '❌ خطا!',
            '<p>Backup JSON سم نه دی.</p>' +
            '<p>مهرباني وکړئ Backup بیا Copy کړئ.</p>',
            'error'
        );
    }
}


/* ===================================================================
   ۱۹. 🗑️ د ټول معلوماتو پاکول
   =================================================================== */

/* -------------------------------------------------------------------
   clearAllData() - د ټول معلوماتو پاکول
   -------------------------------------------------------------------
   دا فنکشن د تصدیق پاپ اپ سره ټول معلومات ړنګوي.
   ------------------------------------------------------------------- */
function clearAllData() {
    showConfirm(
        '⚠️ خطرناک عمل!',
        '<p style="text-align:center; font-size:15px; color:#e74c3c; font-weight:bold; margin-bottom:15px;">' +
        'ایا تاسو غواړئ ټول معلومات پاک کړئ؟' +
        '</p>' +
        '<p style="text-align:center; color:#666; font-size:14px; line-height:1.8;">' +
        '🗑️ د <strong>ټولو</strong> درملو، پلورونو، اخیستلو او پورونو معلومات به <strong>تل لپاره</strong> ړنګ شي.' +
        '</p>' +
        '<p style="text-align:center; color:#e74c3c; font-size:13px; margin-top:15px; font-weight:bold;">' +
        '⚠️ دا کار <u>بیرته نه شي کیدای!</u>' +
        '</p>',
        function(result) {
            if (!result) return;
            
            localStorage.removeItem(DB_KEY);
            localStorage.removeItem(DB_KEY);
            //localStorage.removeItem(USER_PASSWORD_KEY);  // 🆕 د کاروونکي پاسورډ هم ړنګ کړه
            showAlert(
                '✅ ټول معلومات پاک شول!',
                '<p style="text-align:center;">سیسټم بیا خالي دی.</p>' +
                '<p style="text-align:center; color:#27ae60; margin-top:10px;">' +
                '🎉 تاسو کولای شئ نوي معلومات ثبت کړئ.' +
                '</p>',
                'success'
            );
            updateStats();
            showPage('home-page');
        }
    );
}


/* ===================================================================
   ۲۰. 🔐 د اپ پیژندنه (Login)
   =================================================================== */

// 🆕 د اپ پاسورډ — دلته بدل کړه
const APP_PASSWORD = '1234';

/* ===================================================================
   🔐 د اپ پیژندنه (Login System)
   =================================================================== */

// د localStorage کیلي د کاروونکي پاسورډ لپاره
const USER_PASSWORD_KEY = 'pharmacy_user_password';

/* -------------------------------------------------------------------
   getSavedPassword() - د کاروونکي خوندي شوی پاسورډ ترلاسه کول
   ------------------------------------------------------------------- */
function getSavedPassword() {
    return localStorage.getItem(USER_PASSWORD_KEY);
}

/* -------------------------------------------------------------------
   savePassword() - د کاروونکي پاسورډ ذخیره کول
   ------------------------------------------------------------------- */
function savePassword(password) {
    localStorage.setItem(USER_PASSWORD_KEY, password);
}

/* -------------------------------------------------------------------
   showSetupOrLogin() - د ټاکلو یا ننوتلو پاڼه ښودل
   -------------------------------------------------------------------
   که پاسورډ نه وي ذخیره شوی → د ټاکلو پاڼه
   که پاسورډ ذخیره شوی وي → د ننوتلو پاڼه
   ------------------------------------------------------------------- */
function showSetupOrLogin() {
    let savedPassword = getSavedPassword();
    let setupPage = document.getElementById('setupPasswordPage');
    let loginPage = document.getElementById('loginPage');
    
    if (savedPassword) {
        // پاسورډ ذخیره شوی → د ننوتلو پاڼه
        setupPage.style.display = 'none';
        loginPage.style.display = 'block';
        
        // د input ته focus
        setTimeout(() => {
            let loginInput = document.getElementById('loginPassword');
            if (loginInput) loginInput.focus();
        }, 300);
    } else {
        // پاسورډ نه دی ذخیره شوی → د ټاکلو پاڼه
        setupPage.style.display = 'block';
        loginPage.style.display = 'none';
        
        // د input ته focus
        setTimeout(() => {
            let newPassInput = document.getElementById('newPassword');
            if (newPassInput) newPassInput.focus();
        }, 300);
    }
}

/* -------------------------------------------------------------------
   setUserPassword() - د کاروونکي لخوا د پاسورډ ټاکل
   -------------------------------------------------------------------
   دا فنکشن:
   ۱. دواړه پاسورډونه چک کوي
   ۲. د دوی مساوي والی چک کوي
   ۳. د اوږدوالي چک کوي (لږ تر لږه ۴)
   ۴. پاسورډ ذخیره کوي
   ۵. بیا یې ننوتلو پاڼې ته ځي
   ------------------------------------------------------------------- */
function setUserPassword() {
    let newPassInput = document.getElementById('newPassword');
    let confirmPassInput = document.getElementById('confirmPassword');
    let errorMsg = document.getElementById('setupError');
    
    let newPassword = newPassInput.value.trim();
    let confirmPassword = confirmPassInput.value.trim();
    
    // چک ۱: خالي نه وي
    if (!newPassword || !confirmPassword) {
        errorMsg.textContent = '❌ مهرباني وکړئ دواړه پاسورډونه ولیکئ!';
        errorMsg.style.display = 'block';
        return;
    }
    
    // چک ۲: لږ تر لږه ۴ عدد
    if (newPassword.length < 4) {
        errorMsg.textContent = '❌ پاسورډ باید لږ تر لږه ۴ عدد وي!';
        errorMsg.style.display = 'block';
        newPassInput.value = '';
        confirmPassInput.value = '';
        newPassInput.focus();
        return;
    }
    
    // چک ۳: دواړه مساوي وي
    if (newPassword !== confirmPassword) {
        errorMsg.textContent = '❌ پاسورډونه سره مساوي نه دي!';
        errorMsg.style.display = 'block';
        confirmPassInput.value = '';
        confirmPassInput.focus();
        return;
    }
    
    // ✅ پاسورډ ذخیره کړه
    savePassword(newPassword);
    
    // د ټاکلو پاڼه پټه کړه — د ننوتلو پاڼه ښکاره کړه
    document.getElementById('setupPasswordPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    
    // د پاسورډ input پاکول
    newPassInput.value = '';
    confirmPassInput.value = '';
    errorMsg.style.display = 'none';
    
    // د ننوتلو input ته focus
    setTimeout(() => {
        let loginInput = document.getElementById('loginPassword');
        if (loginInput) loginInput.focus();
    }, 100);
    
    // پیغام
    showAlert(
        '✅ پاسورډ ټاکل شو!',
        '<p style="text-align:center;">اوس خپل پاسورډ ولیکه ترڅو اپ ته ننوځې.</p>',
        'success'
    );
}

/* -------------------------------------------------------------------
   loginApp() - د اپ ننوتل
   -------------------------------------------------------------------
   دا فنکشن:
   - د کاروونکي پاسورډ د خوندي شوي پاسورډ سره پرتله کوي
   - که سم وي → کور پاڼه ښیي
   - که غلط وي → خطا ښیي
   ------------------------------------------------------------------- */
function loginApp() {
    let passwordInput = document.getElementById('loginPassword');
    let errorMsg = document.getElementById('loginError');
    
    if (!passwordInput) return;
    
    let password = passwordInput.value.trim();
    let savedPassword = getSavedPassword();
    
    if (password === savedPassword) {
        // ✅ سم پاسورډ
        let loginPage = document.getElementById('login-page');
        if (loginPage) {
            loginPage.style.display = 'none';
        }
        
        // ټولې پاڼې پټې کړه
        document.querySelectorAll('.page-section').forEach(page => {
            page.classList.remove('active');
        });
        
        // کور پاڼه ښکاره کړه
        let homePage = document.getElementById('home-page');
        if (homePage) {
            homePage.classList.add('active');
        }
        
        // احصائې تازه کړه
        if (typeof updateStats === 'function') {
            updateStats();
        }
        
        passwordInput.value = '';
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
        
    } else {
        // ❌ غلط پاسورډ
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
        
        passwordInput.value = '';
        passwordInput.focus();
        
        // د لړزیدو انیمیشن
        let loginBox = document.querySelector('.login-box');
        if (loginBox) {
            loginBox.style.animation = 'none';
            setTimeout(() => {
                loginBox.style.animation = 'loginShake 0.5s';
            }, 10);
        }
    }
}

/* ===================================================================
   ۲۱. 🚀 د پیل فنکشن
   =================================================================== */

window.onload = function() {
    // 🆕 د ټاکلو یا ننوتلو پاڼه ښکاره کړه
    showSetupOrLogin();
};