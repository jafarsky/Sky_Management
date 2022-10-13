const url_time = 'http://api.aladhan.com/v1/currentTime?zone=Asia/Baghdad';
const url_date = 'http://api.aladhan.com/v1/currentDate?zone=Asia/Baghdad';

let currentDate = document.getElementById('currentDate');
let currentTime = document.getElementById('currentTime');
let productName = document.getElementById('productName');
let price = document.getElementById('price');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let category = document.getElementById('category');
let count = document.getElementById('count');
let countLb = document.getElementById('countLb');
let body = document.querySelector('body');
let sunBtn = document.getElementById('sunBtn');
let moonBtn = document.getElementById('moonBtn');
let create = document.getElementById('create');
let edit = document.getElementById('edit');
let aleartNoProducts = document.getElementById('aleartNoProducts');
let productsContent = document.getElementById('productsContent');
let countProducts = document.getElementById('countProducts');
let searchNameBtn = document.getElementById('searchNameBtn');
let searchCategoryBtn = document.getElementById('searchCategoryBtn');
let searchInput = document.getElementById('searchInput');
let tbody = document.getElementById('tbody');
let mood = 'create';
let searchMood = 'Name';
let copyEditIndex = 0;   // عن طريق اخذ نسخة منه his block خارج local حتى نحل مشكلة عدم استخدام المتغير global هذا متغير
var totalResult = 0;
var dataProduct = [];


if (localStorage.product != undefined) {
    dataProduct = JSON.parse(localStorage.product);
}



async function getCurrentTime()
{
    try {
        const response = await axios.get(url_time);
        currentTime.innerHTML = response.data.data;

    }   catch (error) {
            console.log(error);
        }
}

async function getCurrentDate()
{
    await getCurrentTime();

    try {
        const response = await axios.get(url_date);
        currentDate.innerHTML = response.data.data;

    }   catch (error) {
            console.log(error);
        }
}
getCurrentDate();


window.onscroll = _ =>  {   if (scrollY > 1111)  scrollBtn.classList.remove("hidden");
                            else                 scrollBtn.classList.add("hidden");
                        }

sunBtn.onclick = function() {
    body.classList.remove('dark');
    this.classList.add('hidden');
    moonBtn.classList.remove('hidden');
}

moonBtn.onclick = function() {
    body.classList.add('dark');
    this.classList.add('hidden');
    sunBtn.classList.remove('hidden')
}

/************************** create product ***/
function create_edit()
{
    let newProduct = {
        productName: productName.value.toLowerCase(),
        price: price.value,
        ads: ads.value,
        discount: discount.value,
        total: totalResult,
        count: count.value,
        category: category.value.toLowerCase(),
    } //--------------------------------------- newProduct{}

    if (newProduct.count == '')     newProduct.count = 1;
    
    let isCount = (newProduct.count <= 999)  ?  true  :  false;

    if ((isCount) && (productName.value != '') && (price.value != '') && (category.value != ''))
    {
        if (mood === 'create')
        {
            count.removeAttribute('required');

            dataProduct.push(newProduct);
            clearData();

            productName.removeAttribute('required');
            price.removeAttribute('required');
            category.removeAttribute('required');
            count.removeAttribute('required');
        }

        else //.................................. when (mood === 'edit')
        {
            //... we put the mood back to its default ,, to create
            mood = 'create';
            
            dataProduct[copyEditIndex] = newProduct; //... copyEditIndex: have th value of product index we r wanna to edit it ,,, its = i

            create.classList.remove('hidden');
            edit.classList.add('hidden');
            clearData();
        }
    }
    else
    {
        if      (productName.value == '')   {  productName.focus();    productName.setAttribute('required', '');  }
        else if (price.value       == '')   {  price.focus();          price.setAttribute('required', '');        }
        else if (category.value    == '')   {  category.focus();       category.setAttribute('required', '');     }

        else {
            countLb.innerHTML = 'Max Count is 999';
            count.setAttribute('required', '');
            count.value='';
            count.focus();
        }
    }

    localStorage.setItem('product', JSON.stringify(dataProduct));

    showData();
} //------------ create_edit()


/******************* get total ***/
function getTotal()
{
    if ((price.value != '') || (ads.value != ''))
    {
        totalResult = (+price.value + +ads.value);

        if (+discount.value > 0  &&  +discount.value <= 100)
            totalResult -= (totalResult * +discount.value / 100);

        total.innerHTML = `Total = ${ totalResult }$`;
    }
    else
        total.innerHTML = 'Total ?';
} //--------------------------------- getTotal()


/****************** <tr> block */
function trBlock(k)
{
    let x = `
            <tr class="border-b border-gray-200 dark:border-gray-700">
                <td>
                    ${k+1}
                </td>
                <td scope="row" class="font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    ${dataProduct[k].productName}
                </td>
                <td>
                    ${dataProduct[k].price}
                </td>
                <td>
                    ${dataProduct[k].ads}
                </td>
                <td>
                    ${dataProduct[k].discount}%
                </td>
                <td>
                    ${dataProduct[k].total}$
                </td>
                <td class="bg-gray-50 dark:bg-gray-800">
                    ${dataProduct[k].category}
                </td>
                <td class="flex">
                    <p class="pr-3">
                        ${dataProduct[k].count}
                    </p>
                    <button onclick="plusCount(${k})" class="pr-1 hover:text-blue-600 dark:hover:text-blue-500">
                        <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12c0-2.8 1.6-5.2 4-6.3V3.5C2.5 4.8 0 8.1 0 12s2.5 7.2 6 8.5v-2.2c-2.4-1.1-4-3.5-4-6.3m13-9c-5 0-9 4-9 9s4 9 9 9s9-4 9-9s-4-9-9-9m5 10h-4v4h-2v-4h-4v-2h4V7h2v4h4v2Z"/></svg>
                    </button>
                    <button onclick="minusCount(${k})" class="hover:text-red-600 dark:hover:text-red-500">
                        <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M17 13H7v-2h10m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"/></svg>
                    </button>
                </td>
                <td>
                    <span class="flex">
                        <button onclick="editData(${k})" class="font-medium text-blue-600 dark:text-blue-500 hover:underline pr-4">
                            Edit
                        </button>
                        <button onclick="deleteProduct(${k})" class="font-medium text-red-600 dark:text-red-500 hover:underline">
                            Delete
                        </button>
                    </span>
                </td>
            </tr>`;
    return x;
} //---------------- trBlock()


/******************** plus count one */
function plusCount(i)
{
    if (dataProduct[i].count < 999)
    {
        dataProduct[i].count++;
        localStorage.setItem('product', JSON.stringify(dataProduct));

        clearData();
        showData();
    }
} //---------------------- plusCount()


/********************* minus count one */
function minusCount(i)
{
    if (dataProduct[i].count > 1)
    {
        dataProduct[i].count--;
        localStorage.setItem('product', JSON.stringify(dataProduct));

        clearData();
        showData();
    }
    else
    {
        deleteProduct(i);
    }
} //-------------------- minusCount()


/****************** show data ***/
function showData()
{
    let table = '';

    if (dataProduct.length > 0)
    {
        for (let i = 0 ; i < dataProduct.length ; i++)
            table += trBlock(i);

        aleartNoProducts.classList.add('hidden');
        productsContent.classList.remove('hidden');
        countProducts.innerHTML = dataProduct.length;
    }
    else {
        aleartNoProducts.classList.remove('hidden');
        productsContent.classList.add('hidden');

        if (mood == 'edit')
            clearData();
    }
    tbody.innerHTML = table;
}
showData();


/*******************  clear data ***/
function clearData()
{
    productName.value = '';
    price.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = 'Total ?';
    totalResult = '';
    category.value = '';
    count.value = '';
    countLb.innerHTML = 'Count';
} //------------------------- clearData()


/************************* search mood */
function getSearchMood(id)
{
    if (id == 'searchNameBtn')
        searchMood = 'Name';

    else
        searchMood = 'Category';

    searchInput.placeholder = `By ${searchMood}`;

    searchInput.focus();
    
    searchInput.value = '';
    showData(); //.........to show our data again
} //-------------- getSearchMood()


/********************************** search products */
function searchProducts(value)
{
    let table = '';

    for (let i = 0 ; i < dataProduct.length; i++) {
        if (searchMood == 'Name') {
            if ( dataProduct[i].productName.includes(value.toLowerCase()) ) {
                table += trBlock(i);
            }
        }
        else {
            if ( dataProduct[i].category.includes(value.toLowerCase()) ) {
                table += trBlock(i);
            }
        }
    }

    tbody.innerHTML = table;
} //------------------------- searchProducts()


/******************* delete all products ***/
function deleteAll()
{
    localStorage.clear();
    dataProduct.splice(0);
    localStorage.product = JSON.stringify(dataProduct);

    showData();
    clearData();
    mood = 'create';

    count.classList.remove('hidden');
    create.classList.remove('hidden');
    edit.classList.add('hidden');
} //---------------- deleteAll()


/********************* edit data ***/
function editData(i)
{
    mood = 'edit';
    copyEditIndex = i; //.... copy value of i in copyEditIndex ,, to made it global in pur program

    productName.value = dataProduct[i].productName;
    price.value = dataProduct[i].price;
    ads.value = dataProduct[i].ads;
    discount.value = dataProduct[i].discount;
    getTotal(); // to get total of price of product we r wanna to edit
    category.value = dataProduct[i].category;
    count.value = dataProduct[i].count;

    edit.classList.remove('hidden');
    create.classList.add('hidden');

    productName.focus();
} //---------------------------------- editData()


/************************ delete specific product ***/
function deleteProduct(i)
{
    dataProduct.splice(i,1);
    localStorage.product = JSON.stringify(dataProduct);

    create.classList.remove('hidden');
    edit.classList.add('hidden');
    showData();
    clearData();
} //-------------- deleteProduct()



/*

teast someting

*/
