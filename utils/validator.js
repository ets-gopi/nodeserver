class Validator {
  constructor(schema) {
    this.schema = schema;
  }
  isValidDate(date) {
    // Check if the value is an instance of Date and is not NaN
    return date instanceof Date && !isNaN(date);
  }

  validate(data) {
    let errors = {};
    //console.log(data);
    let copiedData = { ...data };
    for (const key in this.schema) {
      const rules = this.schema[key];
      let value = copiedData[key];
      //console.log(value,key,rules.type);
      //Handle the Objects
      if (
        rules.required &&
        typeof rules.type === "object" &&
        !Array.isArray(rules.type)
      ) {
        if (typeof value !== "object") {
          errors[key] = `${key} must be an object.`;
        } else {
          const nestedValidator = new Validator(rules.type);
          const nestedValidation = nestedValidator.validate(value);
          //console.log(nestedValidation);
          if (Object.keys(nestedValidation.errors).length > 0) {
            errors[key] = nestedValidation.errors;
          } else {
            copiedData[key] = nestedValidation.data;
          }
        }
        continue;
      }

      //Handle the arrays.
      if (rules.required && Array.isArray(rules.type)) {
        if (!Array.isArray(value)) {
          errors[key] = `${key} must be an array.`;
        } else {
          const valueType = rules.type[0];
          if (valueType && typeof valueType === "string") {
            const invalidItems = value.filter(
              (item, ind) => typeof item !== valueType
            );
            //console.log(invalidItems);
            if (invalidItems.length > 0) {
              errors[key] = `${key} must be an array of ${valueType}.`;
            } else if (value.length === 0) {
              errors[key] = `${key} must be an array of length greater than 0.`;
            }
          }
          if (valueType && typeof valueType === "object") {
            const nestedValidator = new Validator(rules.type[0]);
            value.forEach((obj, ind) => {
              const nestedValidation = nestedValidator.validate(obj);
              //console.log(nestedValidation);
              if (Object.keys(nestedValidation.errors).length > 0) {
                errors[`${key}[${ind}]`] = nestedValidation.errors;
              } else {
                copiedData[key][ind] = nestedValidation.data;
              }
            });
          }
        }
        continue;
      }

      // check the field is required or not.
      if (
        rules.required &&
        (value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim().length === 0))
      ) {
        errors[key] = `${key} is required.`;
        continue;
      }

      // check the trim
      if (rules.trim && typeof value === "string") {
        value = value.trim();
        copiedData[key] = value;
      }

      // check for date validation.
      if (rules.type === "date") {
        const dateValue = new Date(value);
        if (!this.isValidDate(dateValue)) {
          errors[key] = `${key} must be a valid date.`;
        }
        continue;
      }

      // check the type
      if (rules.required && rules.type && typeof value !== rules.type) {
        errors[key] = `${key} must be a ${rules.type}.`;
        continue;
      }

      // check the minLength
      if (
        rules.minLength &&
        rules.minLength > 0 &&
        typeof value === "string" &&
        value.length > 0 &&
        value.length < rules.minLength
      ) {
        errors[
          key
        ] = `${key} value must be atleast ${rules.minLength} characters long.`;
      }

      // Validate that checkIn is before checkOut
      const checkIn = copiedData.checkIn;
      const checkOut = copiedData.checkOut;

      if (checkIn && checkOut) {
        const currentDate = new Date();
        const checkInDate = new Date(checkIn);

        // Remove time part of currentDate for comparison with checkInDate
        currentDate.setHours(0, 0, 0, 0);
        checkInDate.setHours(0, 0, 0, 0);

        if (checkInDate < currentDate) {
          errors[
            "checkIn"
          ] = `Check-in date must be today or after the current date`;
          console.log(
            "Check-in date:",
            checkInDate,
            "Current date:",
            currentDate
          );
          continue;
        }
        if (new Date(checkIn) >= new Date(checkOut)) {
          errors["checkIn"] = `Check-in date must be before check-out date.`;
          continue;
        }
      }
    }

    return { data: copiedData, errors };
  }
}

module.exports = Validator;
