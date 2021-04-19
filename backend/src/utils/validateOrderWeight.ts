const validateOrderWeight = (items : any, minWeight : any, maxWeight : any) => {

  let total = 0;
  items.forEach((item : any) => (total += Number.parseInt(item.product_weight)));

  if (total <= minWeight || total >= maxWeight) {
    return false;
  }

  return true;
};

export default validateOrderWeight;