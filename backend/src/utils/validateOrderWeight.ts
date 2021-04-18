const validateOrderWeight = (items, minWeight, maxWeight) => {

  let total = 0;
  items.forEach((item) => (total += Number.parseInt(item.product_weight)));

  if (total <= minWeight || total >= maxWeight) {
    return false;
  }

  return true;
};

module.exports = validateOrderWeight;