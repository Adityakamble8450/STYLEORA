import { body, validationResult } from "express-validator";

const validateReq = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

export const createProductValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),
  validateReq,
];

export const createVariantValidator = [
  body("stock")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Stock must be 0 or greater"),
  body("priceAmount")
    .optional({ values: "falsy" })
    .isFloat({ gt: 0 })
    .withMessage("Variant price must be greater than 0"),
  body("attribute")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (!value) return true;

      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "object" && !Array.isArray(parsed) && parsed !== null;
      } catch {
        throw new Error("attribute must be a valid JSON object");
      }
    }),
  body("attributeKey")
    .optional({ values: "falsy" })
    .isLength({ min: 1, max: 50 })
    .withMessage("attributeKey must be between 1 and 50 characters"),
  body("attributeValue")
    .optional({ values: "falsy" })
    .isLength({ min: 1, max: 100 })
    .withMessage("attributeValue must be between 1 and 100 characters"),
  validateReq,
];


