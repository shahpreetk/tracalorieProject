// Storage Controller
const StorageCtrl = (function () {
    // PUBLIC METHODS
    return {
        storeItem: function (item) {
            let items;
            // CHECK IF ANY ITEMS IN LS
            if (localStorage.getItem('items') === null) {
                items = [];
                // PUSH NEW ITEM
                items.push(item);
                // SET LS
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // GET WHAT IS ALREADY IN LS
                items = JSON.parse(localStorage.getItem('items'));

                // PUSH NEW ITEM
                items.push(item);

                // RE SET LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function () {
            let items
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function () {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // items: [
        //     //     {id: 0,
        //     //     name: 'Steak Dinner',
        //     //     calories: 1200
        //     // },
        //     // {
        //     //     id: 1,
        //     //     name: 'Cookie',
        //     //     calories: 400
        //     // },
        //     // {
        //     //     id: 2,
        //     //     name: 'Eggs',
        //     //     calories: 300
        //     // },
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    // PUBLIC METHODS
    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            // CREATE ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // CALORIES TO NUMBER
            calories = parseInt(calories);

            // CREATE NEW ITEM
            newItem = new Item(ID, name, calories);

            // ADD TO ITEMS ARRAY
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            // LOOP THROUGH ITEMS
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function (name, calories) {
            // CALORIES TO NUMBER
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function (id) {
            // GET IDS
            const ids = data.items.map(function (item) {
                return item.id;
            });

            // GET INDEX
            const index = ids.indexOf(id);

            // REMOVE ITEM
            data.items.splice(index, 1);
        },
        clearAllItems:function(){
            data.items=[];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;

            // LOOP THROUGH ITEMS AND ADD CALS
            data.items.forEach(function (item) {
                total += item.calories;
            });

            // SET TOTAL CAL IN DATA STRUCTURE
            data.totalCalories = total;

            // RETURN TOTAL
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();


// UI CONTROLLER
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // PUBLIC METHODS
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            // INSERT LIST ITEMS
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            // SHOW THE LIST
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // CREATE LI ELEMENT
            const li = document.createElement('li');
            // ADD CLASS
            li.className = 'collection-item';
            // ADD ID
            li.id = `item-${item.id}`;
            // ADD HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // INSERT ITEM
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // TURN NODE LIST INTO ARRAY
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems:function(){
            let listItems=document.querySelectorAll(UISelectors.listItems);

            listItems=Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();

// APP CONTROLLER
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // LOAD EVENT LISTENERS
    const loadEventListeners = function () {
        // GET UI SELECTORS
        const UISelectors = UICtrl.getSelectors();

        // ADD ITEM EVENT
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // DISABLE SUBMIT ON ENTER
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // EDIT ICON CLICK EVENT
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // UPDATE ITEM EVENT
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // DELETE ITEM EVENT
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // BACK BUTTON EVENT
        document.querySelector(UISelectors.backBtn).addEventListener('click', itemBackSubmit);

        // CLEAR ALL
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // ADD ITEM SUBMIT
    const itemAddSubmit = function (e) {
        // GET FORM INPUT FROM UI CONTROLLER
        const input = UICtrl.getItemInput();

        // CHECK FOR NAME AND CALORIE INPUT
        if (input.name !== '' && input.calories !== '') {
            // ADD ITEM
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // ADD ITEM TO UI LIST
            UICtrl.addListItem(newItem);

            // GET TOTAL CALORIES
            const totalCalories = ItemCtrl.getTotalCalories();

            // ADD TOTAL CALORIES TO UI
            UICtrl.showTotalCalories(totalCalories);

            // STORE IN LOCAL STORAGE
            StorageCtrl.storeItem(newItem);

            // CLEAR FIELDS
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // ITEM EDIT CLICK
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // GET LIST ITEM ID
            const listId = e.target.parentNode.parentNode.id;

            // BREAK INTO AN ARRAY
            const listIdArr = listId.split('-');

            // GET THE ACTUAL ID
            const id = parseInt(listIdArr[1]);

            // GET ITEM
            const itemToEdit = ItemCtrl.getItemById(id);

            // SET CURRENT ITEM
            ItemCtrl.setCurrentItem(itemToEdit);

            // ADD ITEM TO FORM
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // UPDATE ITEM SUBMIT
    const itemUpdateSubmit = function (e) {
        // GET ITEM INPUT
        const input = UICtrl.getItemInput();

        // UPDATE ITEM
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // UPDATE UI
        UICtrl.updateListItem(updatedItem);

        // GET TOTAL CALORIES
        const totalCalories = ItemCtrl.getTotalCalories();

        // ADD TOTAL CALORIES TO UI
        UICtrl.showTotalCalories(totalCalories);

        // UPDATE LOCAL STORAGE
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // DELETE BUTTON EVENT
    const itemDeleteSubmit = function (e) {
        // GET CURRENT ITEM
        const currentItem = ItemCtrl.getCurrentItem();

        // DELETE FROM DATA STRUCTURE
        ItemCtrl.deleteItem(currentItem.id);

        // DELETE FROM UI
        UICtrl.deleteListItem(currentItem.id);

        // GET TOTAL CALORIES
        const totalCalories = ItemCtrl.getTotalCalories();

        // ADD TOTAL CALORIES TO UI
        UICtrl.showTotalCalories(totalCalories);

        // DELETE FROM LOCAL STORAGE
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // BACK BUTTON EVENT 
    const itemBackSubmit = function (e) {
        // GET TOTAL CALORIES
        const totalCalories = ItemCtrl.getTotalCalories();

        // ADD TOTAL CALORIES TO UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // CLEAR ITEMS EVENT
    const clearAllItemsClick = function () {
        ItemCtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.removeItems();
        StorageCtrl.clearItemsFromStorage();
        UICtrl.hideList();
    }

    // PUBLIC METHODS
    return {
        init: function () {
            // CLEAR EDIT STATE/SET INITIAL STATE
            UICtrl.clearEditState();

            // FETCH ITEMS FROM DATA STRUCTURE
            const items = ItemCtrl.getItems();

            // CHECK IF ANY ITEMS
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // POPULATE LIST WITH ITEMS
                UICtrl.populateItemList(items);
            }

            // GET TOTAL CALORIES
            const totalCalories = ItemCtrl.getTotalCalories();

            // ADD TOTAL CALORIES TO UI
            UICtrl.showTotalCalories(totalCalories);

            // LOAD EVENT LISTENERS
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// INITIALIZE APP
App.init();