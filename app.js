// Storage Controller

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
        items: [{
                id: 0,
                name: 'Steak Dinner',
                calories: 1200
            },
            {
                id: 1,
                name: 'Cookie',
                calories: 400
            },
            {
                id: 2,
                name: 'Eggs',
                calories: 300
            },
        ],
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
        logData: function () {
            return data;
        }
    }
})();


// UI CONTROLLER
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
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
        getSelectors: function () {
            return UISelectors;
        }
    }
})();

// APP CONTROLLER
const App = (function (ItemCtrl, UICtrl) {
    // LOAD EVENT LISTENERS
    const loadEventListeners = function () {
        // GET UISELECTORS
        const UISelectors = UICtrl.getSelectors();

        // ADD ITEM EVENT
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
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
        }

        e.preventDefault();
    }

    // PUBLIC METHODS
    return {
        init: function () {
            // FETCH ITEMS FROM DATA STRUCTURE
            const items = ItemCtrl.getItems();

            // POPULATE LIST WITH ITEMS
            UICtrl.populateItemList(items);

            // LOAD EVENT LISTENERS
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

// INITIALIZE APP
App.init();