export const validationQuery = (query) => {
  const { rules, id, not, ...rest } = query;
  const rulesData = rules.map((item) => {
    if (item?.rules) {
      return {
        group: validationQuery(item)
      };
    } else {
      return {
        rule: {
          //id: item.id,
          datatype: item.field,
          lhs: Array.isArray(item.operator) ? item.operator[0] : '',
          operator: Array.isArray(item.operator) ? item.operator[1] : item.operator,
          rhs: item.value
        }
      };
    }
  });
  return {
    ...rest,
    not : not ? not : false,
    rules: rulesData
  };
};
