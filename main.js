let currentDate = document.getElementById('currentDate');
let currentTime = document.getElementById('currentTime');
let productName = document.getElementById('productName');
let price = document.getElementById('price');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let container_cte_cou = document.getElementById('container-cte-cou');
let category = document.getElementById('category');
let count = document.getElementById('count');
let countLb = document.getElementById('countLb');
let body = document.querySelector('body');
let sunBtn = document.getElementById('sunBtn');
let moonBtn = document.getElementById('moonBtn');
let getStarted = document.getElementById('getStarted');
let create = document.getElementById('create');
let edit = document.getElementById('edit');
let clearAll = document.getElementById('clearAll');
let searchNameBtn = document.getElementById('searchNameBtn');
let searchCategoryBtn = document.getElementById('searchCategoryBtn');
let searchInput = document.getElementById('searchInput');
let tbody = document.getElementById('tbody');
let mood = 'create';
let searchMood = 'Name';
let dataProduct;
let copyEditIndex = 0;   // عن طريق اخذ نسخة منه his block خارج local حتى نحل مشكلة عدم استخدام المتغير global هذا متغير
var totalResult = 0;


if (localStorage.product != null ) {
    dataProduct = JSON.parse(localStorage.product);
}
else {
    dataProduct = [];
}


function getCurrentDateAndTime()
{
    fetch('http://api.aladhan.com/v1/currentTime?zone=Asia/Baghdad')
    .then((response) => {
        if (response.ok)    return response.json();
        else                return Promise.reject(response);
    })
    .then((data) => {

        currentTime.innerHTML += data.data;

    }).catch(response => console.error(response.status));
    /////////////////////////////////////////////////////
    fetch('http://api.aladhan.com/v1/currentDate?zone=Asia/Baghdad')
    .then((response) => {
        if (response.ok)    return response.json();
        else                return Promise.reject(response);
    })
    .then((data) => {

        currentDate.innerHTML += data.data;

    }).catch(response => console.error(response.status));
}
getCurrentDateAndTime();


window.onscroll = _ =>  {   if (scrollY > 1111)  scrollBtn.classList.remove("hidden");
                            else                scrollBtn.classList.add("hidden");
                        }

function scrollUP()
{
    scroll ({
                top: 0,
                behavior: 'smooth',
            });
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

function toInput()
{
    if (body.offsetWidth > 751)
    {
        scroll ({
                top: 679,
                behavior: 'smooth',
            });
    }
    else
    {
        scroll ({
                top: 699,
                behavior: 'smooth',
            });
    }
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

    if ((productName.value != '') && (price.value != '') && (category.value != ''))
    {
        if (mood === 'create')
        {
            if (newProduct.count < 100)
            {
                if (newProduct.count > 1) //..................... if (count > 1)
                    for (let i = 1 ; i < newProduct.count ; i++)
                        dataProduct.push(newProduct);
                
            dataProduct.push(newProduct);
            clearData();
            }
            else
            {
                count.value = '';
                countLb.innerHTML = 'Max Count: 99'
                count.focus();
            }
        }
        else //.................................. when (mood === 'edit')
        {
            dataProduct[copyEditIndex] = newProduct; //... copyEditIndex: have th value of product index we r wanna to edit it ,,, its = i

            //... we put the mood back to its default ,, to create
            mood = 'create';
            //create.innerHTML = 'Create'; 
            
            //.. make input count block and return style of button also to default
            container_cte_cou.classList.remove('md:grid-cols-1');
            container_cte_cou.classList.add('md:grid-cols-2');
            count.classList.remove('hidden');
            countLb.classList.remove('hidden');
            create.classList.remove('hidden');
            edit.classList.add('hidden');
            clearData();
        }
        productName.removeAttribute('required');
        price.removeAttribute('required');
        category.removeAttribute('required');

    }
    else
    {
        if (productName.value == '')    {   productName.focus();    productName.setAttribute('required', '');   }
        else if (price.value == '')     {   price.focus();          price.setAttribute('required', '');         }
        else                            {   category.focus();       category.setAttribute('required', '');      }
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
                    <button onclick="editData ( ${k} )" class="font-medium text-blue-600 dark:text-blue-500 hover:underline pr-4">
                        Edit
                    </button>
                    <button onclick="deleteProduct ( ${k} )" class="font-medium text-red-600 dark:text-red-500 hover:underline">
                        Delete
                    </button>
                </td>
            </tr>`;
    return x;
} //---------------- trBlock()


/****************** show data ***/
function showData()
{
    let table = '';

    if (dataProduct.length > 0)
    {

        for (let i = 0 ; i < dataProduct.length ; i++)
            table += trBlock(i);

        clearAll.classList.remove('hidden');
        clearAll.innerHTML = `Clear All (${dataProduct.length})`;
    }
    else {
        clearAll.classList.add('hidden');

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
    countLb.innerHTML = 'Count'
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
    countLb.classList.remove('hidden');
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

    container_cte_cou.classList.remove('md:grid-cols-2');
    container_cte_cou.classList.add('md:grid-cols-1');
    count.classList.add('hidden');
    countLb.classList.add('hidden');
    edit.classList.remove('hidden');
    create.classList.add('hidden');

    productName.focus();
} //---------------------------------- editData()


/************************ delete specific product ***/
function deleteProduct(i)
{
    dataProduct.splice(i,1);
    localStorage.product = JSON.stringify(dataProduct);

    showData();
} //-------------- deleteProduct()