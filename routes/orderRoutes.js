const express = require("express")
const Order = require("../models/Order")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

//@route GET /api/orders/my-orders
//@desc Get Logged-In User's Orders
//@access Private
router.get("/my-orders", protect, async (req, res) => {
    try {
        //Find Orders For The Authenticated User
        const orders = await Order.find({user: req.user._id}).sort({createdAt: -1,})//Sort By Most Recent Orders
        res.json(orders)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"})
    }
})

//@route GET /api/orders/:id
//@desc GET Order Details By ID
//@Access Private
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email")

        if(!order) {
            return res.status(404).json({message: "Order Not Found"})
        }

        //Return The Full Order Details
        res.json(order)

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"})
    }
})

module.exports = router