import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      currency: {
        type: String,
        enum: ["USD", "GBP", "INR"],
        default: "INR",
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    variants: [
      {
        sku: {
          type: String,
          trim: true,
        },
        attributes: {
          type: Map,
          of: String,
        },
        price: {
          currency: {
            type: String,
            enum: ["USD", "GBP", "INR"],
            default: "INR",
          },
          amount: {
            type: Number,
            min: 0,
          },
        },
        stock: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;