const controller = {};

// Json file to simulate database
const json_orders = fs.readFileSync('src/database/orders.json', 'utf-8');
let orders = JSON.parse(json_orders);

controller.registerSeller = () => {

}

controller.authSeller = () => {
    
}

module.exports = controller;